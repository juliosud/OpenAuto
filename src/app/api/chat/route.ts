import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

type ResultType = "diagnosis" | "parts" | "text";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

interface DiagnosisPart {
  name: string;
  link: string;
}

interface DiagnosisDetails {
  steps: string[];
  diagrams?: string[];
  specs: string[];
  parts: DiagnosisPart[];
  rationale?: string;
  sources?: { label: string; href?: string }[];
}

interface DiagnosisResult {
  id: number;
  summary: string;
  probability: number;
  details: DiagnosisDetails;
}

interface PartResult {
  id: number;
  name: string;
  description: string;
  specs: string[];
  compatibility: string[];
  link: string;
}

interface ChatAPIResponse {
  type?: ResultType;
  message?: string;
  diagnoses?: DiagnosisResult[];
  parts?: PartResult[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const diagramPool = [
  "/pump-exploded.jpeg",
  "/suspension-diagram.jpg",
  "/chassis-diagram.jpg",
];

const systemPrompt = `
You are OpenAuto, an AI assistant that helps diagnose vehicle issues or suggest automotive parts/specs.
Always respond with strict JSON using this shape:
{
  "type": "diagnosis" | "parts" | "text",
  "message": "concise natural language summary",
  "diagnoses": [
    {
      "id": number,
      "summary": "short issue description",
      "probability": 0-100,
      "details": {
        "steps": ["action 1", "..."],
        "diagrams": ["optional image url", "..."],
         "specs": ["key spec", "..."],
         "parts": [
           { "name": "Part name", "link": "https://example.com" }
         ],
        "rationale": "Support your diagnosis referencing TSBs, community data, or documents.",
        "sources": [
          { "label": "NHTSA TSB 18-1234", "href": "https://..." }
        ]
      }
    }
  ],
  "parts": [
    {
      "id": number,
      "name": "Part name",
      "description": "what this part does",
      "specs": ["spec detail"],
      "compatibility": ["vehicle/application"],
      "link": "https://example.com"
    }
  ]
}

- Use "diagnosis" when the user describes symptoms or wants troubleshooting help.
- Use "parts" when they ask for a component, spec sheet, torque data, replacement info, etc.
- Use "text" for any other conversational reply.
- Every array is optional but if provided it must follow the schema. Keep between 1-5 entries.
- Provide friendly but professional content, rooted in general automotive knowledge.
- Do not include markdown, explanations, or extra prose outside of the JSON object.
`;

const fallbackMessage =
  "Here’s what I found based on your request. Let me know if you need more detail.";

const normalizeDiagnoses = (diagnoses?: DiagnosisResult[]) => {
  if (!Array.isArray(diagnoses)) return [];

  return diagnoses.map((diagnosis, index) => {
    const probability = Math.min(
      99,
      Math.max(1, Math.round(Number(diagnosis.probability) || 50))
    );

    const steps = Array.isArray(diagnosis.details?.steps)
      ? diagnosis.details.steps
      : [];
    const specs = Array.isArray(diagnosis.details?.specs)
      ? diagnosis.details.specs
      : [];
    const parts = Array.isArray(diagnosis.details?.parts)
      ? diagnosis.details.parts
      : [];
    const sources = Array.isArray(diagnosis.details?.sources)
      ? diagnosis.details.sources
      : [];

    const diagrams =
      Array.isArray(diagnosis.details?.diagrams) &&
      diagnosis.details.diagrams.length > 0
        ? diagnosis.details.diagrams
        : [
            diagramPool[index % diagramPool.length],
            diagramPool[(index + 1) % diagramPool.length],
          ];

    return {
      id: diagnosis.id ?? index + 1,
      summary: diagnosis.summary ?? "Possible issue",
      probability,
      details: {
        steps,
        specs,
        parts,
        diagrams,
        rationale:
          diagnosis.details?.rationale ??
          "Likely cause based on common field reports and OEM guidance.",
        sources,
      },
    };
  });
};

const normalizeParts = (parts?: PartResult[]) => {
  if (!Array.isArray(parts)) return [];

  return parts.map((part, index) => ({
    id: part.id ?? index + 1,
    name: part.name ?? "Component",
    description:
      part.description ??
      "Replacement component information based on your request.",
    specs: Array.isArray(part.specs) ? part.specs : [],
    compatibility: Array.isArray(part.compatibility)
      ? part.compatibility
      : [],
    link: part.link || "#",
  }));
};

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured." },
      { status: 500 }
    );
  }

  try {
    const { messages, vehicle } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Conversation history is required." },
        { status: 400 }
      );
    }

    const vehicleContext =
      vehicle && (vehicle.make || vehicle.model || vehicle.year)
        ? `Vehicle info (if provided): Make=${vehicle.make || "unknown"}, Model=${
            vehicle.model || "unknown"
          }, Year=${vehicle.year || "unknown"}.`
        : "Vehicle info not provided.";

    const serviceNotesContext = vehicle?.notes
      ? `Service notes (critical context): ${vehicle.notes}`
      : "Service notes not available; rely on latest user description.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n${vehicleContext}\n${serviceNotesContext}`,
        },
        ...(messages as IncomingMessage[]).map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    });

    const rawContent = completion.choices[0]?.message?.content ?? "{}";
    const parsed: ChatAPIResponse = JSON.parse(rawContent);

    const sanitizedDiagnoses = normalizeDiagnoses(parsed.diagnoses);
    const sanitizedParts = normalizeParts(parsed.parts);

    const responsePayload = {
      type: parsed.type ?? "text",
      message: parsed.message ?? fallbackMessage,
      diagnoses: sanitizedDiagnoses,
      parts: sanitizedParts,
    };

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("[chat-route]", error);
    return NextResponse.json(
      { error: "Failed to process chat request." },
      { status: 500 }
    );
  }
}

