"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import DiagnosisCard, { Diagnosis } from "@/components/DiagnosisCard";
import DetailsSidebar from "@/components/DetailsSidebar";
import PartSpecCard, { PartSpec } from "@/components/PartSpecCard";
import {
  ChevronLeft,
  ChevronRight,
  Activity,
  Wrench,
  BookOpen,
  LayoutGrid,
  FileStack,
  ClipboardList,
  Sparkles,
  X,
} from "lucide-react";

type ResultType = "diagnosis" | "parts";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  type: ResultType | "text";
  content: string;
  diagnoses?: Diagnosis[];
  parts?: PartSpec[];
}

interface VehicleProfile {
  id: string;
  label: string;
  make: string;
  model: string;
  year: string;
  source: "Manual" | "Tekmetric" | "Mitchell";
  lastUpdated: string;
  notes: string;
}

interface ChatAPIResponse {
  type: ResultType | "text";
  message: string;
  diagnoses?: Diagnosis[];
  parts?: PartSpec[];
}

type IconRenderer = React.ComponentType<{ className?: string }>;

type InfoSection = {
  icon: IconRenderer;
  title: string;
  description: string;
  details?: string[];
  links?: {
    label: string;
    href: string;
    list?: string[];
    content?: {
      title: string;
      body: string[];
    };
  }[];
  table?: {
    searchable?: boolean;
    columns: string[];
    rows: { cells: (string | number)[]; link?: string }[];
  };
  list?: string[];
  content?: {
    title: string;
    body: { type: "text" | "list" | "embed"; value: string | string[] }[];
  };
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const defaultVehicles = useMemo<VehicleProfile[]>(
    () => [
      {
        id: "veh-4",
        label: "Civic 2007 – Steering Noise",
        make: "Honda",
        model: "Civic",
        year: "2007",
        source: "Manual",
        lastUpdated: "Customer concern documented",
        notes:
          "Customer states: When the vehicle is cold, there is a grinding noise when turning the steering wheel. Noise is present on initial startup and during low-speed turns. After the vehicle warms up, the noise fades away and is no longer noticeable.",
      },
      {
        id: "veh-1",
        label: "Camry – MIL On",
        make: "Toyota",
        model: "Camry",
        year: "2018",
        source: "Tekmetric",
        lastUpdated: "Today, 2:31 PM",
        notes:
          "Customer reports check engine light and occasional rough idle after cold starts. Recently had spark plugs replaced.",
      },
      {
        id: "veh-2",
        label: "F-150 – Brake Noise",
        make: "Ford",
        model: "F-150",
        year: "2015",
        source: "Mitchell",
        lastUpdated: "Yesterday, 5:02 PM",
        notes:
          "Driver hears metallic squeal when braking at low speed. Rotors were resurfaced 6 months ago.",
      },
      {
        id: "veh-3",
        label: "Civic – Custom Chat",
        make: "Honda",
        model: "Civic",
        year: "2021",
        source: "Manual",
        lastUpdated: "No history yet",
        notes: "New conversation. Add any customer concern details here.",
      },
    ],
    []
  );
  const [vehicles, setVehicles] = useState(defaultVehicles);
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    defaultVehicles[0]?.id ?? ""
  );
  const [conversations, setConversations] = useState<
    Record<string, ChatMessage[]>
  >(() =>
    defaultVehicles.reduce(
      (map, vehicle) => ({
        ...map,
        [vehicle.id]: [],
      }),
      {}
    )
  );
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(
    null
  );
  const messageCounter = useRef(1);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [infoPanelOpen, setInfoPanelOpen] = useState(true);
  const [garageOpen, setGarageOpen] = useState(false);
  const [newVehicleForm, setNewVehicleForm] = useState({
    label: "",
    make: "",
    model: "",
    year: "",
    source: "Manual" as VehicleProfile["source"],
    notes: "",
  });
  const [activeInfoSection, setActiveInfoSection] = useState<InfoSection | null>(
    null
  );
  const [infoSearch, setInfoSearch] = useState("");
  const [previousInfoSection, setPreviousInfoSection] =
    useState<InfoSection | null>(null);
  const [selectionBubble, setSelectionBubble] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const infoSections: InfoSection[] = [
    {
      icon: Activity,
      title: "Diagnostic Trouble Codes",
      description: "Latest DTCs relevant to this vehicle and symptoms.",
      links: [
        { label: "B Code Charts", href: "#", list: [] },
        { label: "Diagnostic Trouble Code Descriptions", href: "#" },
        { label: "Manufacturer Code Charts", href: "#" },
        { label: "P Code Charts", href: "#" },
        { label: "U Code Charts", href: "#" },
      ],
    },
    {
      icon: ClipboardList,
      title: "Service Tables",
      description: "Fluid capacities, torque specs, and intervals.",
      details: [
        "Torque specs for steering, suspension, and drivetrain linkages",
        "Fluid capacities and change intervals with OEM fluids",
        "Reset procedures after service (angle sensors, TPMS, EPS)",
      ],
    },
    {
      icon: FileStack,
      title: "TSBs",
      description: "Technical Service Bulletins that match this concern.",
      table: {
        searchable: true,
        columns: ["TSB#", "Date", "Title"],
        rows: [
          {
            cells: [
            "22-100",
            "2025/11/06",
            "Updating Control Units/Modules with the Honda ECU Reprogramming Application",
            ],
            link: "/tsb/document.pdf",
          },
          {
            cells: [
            "99-018",
            "2025/09/03",
            "Required Special Tools and Equipment",
            ],
          },
          {
            cells: [
            "18-134",
            "2024/09/24",
            "Recommended Sealers and Adhesives for Collision and Body Repairs",
            ],
          },
          { cells: ["98-051", "2024/09/16", "Special Tool Loan Program"] },
          { cells: ["99-030", "2024/06/19", "Honda Recommended Materials"] },
          { cells: ["07-030", "2023/12/08", "A/C Leak Detection"] },
          { cells: ["89-003", "2022/12/15", "Battery Maintenance at Dealers"] },
          {
            cells: [
            "22-059",
            "2022/12/15",
            "CPX-900 Battery Tester Update Information",
            ],
          },
          {
            cells: [
            "22-060",
            "2022/12/15",
            "Honda DCA-8000 Dynamic Diagnostic Charging System Update Information",
            ],
          },
          {
            cells: [
            "20-016",
            "2020/03/10",
            "Warranty Extension: Customer Support Program for Front Passenger's Airbag Inflator (Expires January 31, 2030)",
            ],
          },
          {
            cells: [
            "20-018",
            "2020/02/07",
            "Service Manual Update: Accessory Power Socket Troubleshooting",
            ],
          },
          {
            cells: [
            "19-112",
            "2019/10/29",
            "Service Manual Update: Troubleshooting Guidelines Update",
            ],
          },
      ],
    },
  },
  {
      icon: LayoutGrid,
      title: "Diagrams",
      description: "Annotated system diagrams and schematics.",
      details: [
        "Exploded steering rack diagrams with part identifiers",
        "Hydraulic/electric assist flow schematics",
        "Connector pin-outs and harness routing references",
      ],
    },
    {
      icon: BookOpen,
      title: "Specifications",
      description: "Critical numbers: voltages, pressures, tolerances.",
      details: [
        "Power steering pump or EPS motor pressure specs",
        "Column bearing tolerances (cold vs warm)",
        "Acceptable current draw for EPS assist motors",
      ],
    },
    {
      icon: Wrench,
      title: "Parts and Labor",
      description: "Common parts, availability, and labor times.",
      details: [
        "Pump kits, fluid types, racks, and steering shafts",
        "Labor hour guides from Mitchell/Tekmetric",
        "Aftermarket vs OEM component comparisons",
      ],
    },
    {
      icon: Sparkles,
      title: "Maintenance & Community",
      description: "Community-proven fixes and maintenance advice.",
      table: {
        searchable: true,
        columns: ["Issue", "System", "Symptom", "Date", "Repairs"],
        rows: [
          {
            cells: [
            "engine cranks but will not start",
            "Engine Mechanical",
            "Lack of Power / Will Not Crank",
            "07/18/2024 08:53:36",
            "3",
            ],
          },
          {
            cells: ["Grinding", "Engine Mechanical", "Noise", "04/04/2024 08:36:51", "1"],
          },
          {
            cells: [
            "MIL ON, Engine Lacks Power",
            "Computers and Control Systems",
            "MIL On, Hesitation",
            "05/25/2023 12:15:21",
            "1",
            ],
          },
          {
            cells: [
            "No ATF after axle seal repair; won't exceed 20 mph",
            "Transmissions & Clutch",
            "MIL On",
            "02/26/2022 09:12:30",
            "2",
            ],
          },
          {
            cells: [
            "Left Front Door Will Not Open",
            "Body and Frame",
            "Sticks / High Effort",
            "12/08/2021 08:27:52",
            "1",
            ],
          },
          {
            cells: [
            "Cranks No Start, No ECM Communication",
            "Computers and Control Systems",
            "Cranks No Start, No Comm",
            "11/29/2021 13:01:51",
            "1",
            ],
          },
          {
            cells: [
            "A/C Inoperative",
            "Heating and Air Conditioning",
            "Inoperative",
            "09/07/2021 06:37:47",
            "2",
            ],
          },
          {
            cells: [
            "A/C Compressor Does Not Disengage",
            "Heating and Air Conditioning",
            "Does Not Disengage",
            "05/20/2021 08:15:37",
            "1",
            ],
          },
          {
            cells: [
            "Intermittent A/C Blows Warm Air",
            "Heating and Air Conditioning",
            "Intermittent / Inoperative",
            "05/19/2021 07:39:39",
            "1",
            ],
          },
          {
            cells: [
            "Difficulty Entering Audio Anti-Theft Code After Battery Replacement",
            "Accessories and Optional Equipment",
            "No Communication / Inoperative",
            "05/12/2021 09:22:17",
            "1",
            ],
          },
          {
            cells: [
            "Cranks, Does Not Start",
            "Computers and Control Systems",
            "Cranks Does Not Start",
            "02/23/2021 09:12:48",
            "1",
            ],
          },
          {
            cells: [
            "Overheating, Fans Not Coming On",
            "Cooling Systems",
            "Inoperative / Overheating",
            "02/15/2021 06:19:50",
            "1",
            ],
          },
          {
            cells: [
            "Engine rumbles roars vibrates",
            "Transmissions & Clutch",
            "Vibration / Shake",
            "12/04/2020 08:58:19",
            "3",
            ],
          },
          {
            cells: [
            "pressure too low",
            "Heating and Air Conditioning",
            "High / Low Pressure",
            "09/12/2020 14:01:39",
            "2",
            ],
          },
          {
            cells: [
            "CODE P0300",
            "Computers and Control Systems",
            "P0300",
            "09/05/2020 07:34:38",
            "3",
            ],
          },
          {
            cells: [
            "Engine Stalls, MIL On, DTC: P0335",
            "Computers and Control Systems",
            "Intermittent / Stalls / MIL On",
            "07/15/2020 11:46:14",
            "1",
            ],
          },
      ],
    },
  },
];

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const messages = conversations[selectedVehicleId] ?? [];
  const drawerOpen = Boolean(selectedDiagnosis || activeInfoSection);

  const getNextMessageId = () => {
    const next = messageCounter.current;
    messageCounter.current += 1;
    return next;
  };

  const appendMessage = (vehicleId: string, newMessage: ChatMessage) => {
    setConversations((prev) => {
      const current = prev[vehicleId] ?? [];
      return { ...prev, [vehicleId]: [...current, newMessage] };
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const vehicleId = selectedVehicleId || "default";

    const query = searchQuery.trim();
    const userMessage: ChatMessage = {
      id: getNextMessageId(),
      role: "user",
      type: "text",
      content: query,
    };

    const nextMessages = [...messages, userMessage];
    appendMessage(vehicleId, userMessage);
    setSearchQuery("");
    setIsLoading(true);
    setSelectedDiagnosis(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          vehicle: {
            make: currentVehicle?.make,
            model: currentVehicle?.model,
            year: currentVehicle?.year,
            label: currentVehicle?.label,
            source: currentVehicle?.source,
            notes: currentVehicle?.notes,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach OpenAI");
      }

      const data: ChatAPIResponse = await response.json();
      const responseMessage: ChatMessage = {
        id: getNextMessageId(),
        role: "assistant",
        type: data.type ?? "text",
        content: data.message,
        diagnoses: data.diagnoses,
        parts: data.parts,
      };

      appendMessage(vehicleId, responseMessage);
    } catch (error) {
      console.error(error);
      appendMessage(vehicleId, {
        id: getNextMessageId(),
        role: "assistant",
        type: "text",
        content:
          "I couldn't reach the real diagnostic service right now. Please try again in a moment.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiagnosisClick = (diagnosis: Diagnosis) => {
    setSelectedDiagnosis(diagnosis);
  };

  const handleCloseSidebar = () => {
    setSelectedDiagnosis(null);
  };

  const handleThumbsUp = (id: number) => {
    console.log("Thumbs up for diagnosis:", id);
    // Implement feedback logic
  };

  const handleThumbsDown = (id: number) => {
    console.log("Thumbs down for diagnosis:", id);
    // Implement feedback logic
  };

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, selectedVehicleId]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (
        !selection ||
        selection.isCollapsed ||
        selection.rangeCount === 0 ||
        !selection.toString().trim()
      ) {
        setSelectionBubble(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionBubble({
        text: selection.toString().trim(),
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + window.scrollY - 16,
      });
    };

    document.addEventListener("mouseup", handleSelectionChange);
    document.addEventListener("keyup", handleSelectionChange);

    return () => {
      document.removeEventListener("mouseup", handleSelectionChange);
      document.removeEventListener("keyup", handleSelectionChange);
    };
  }, []);

  const handleAskFromSelection = () => {
    if (!selectionBubble) return;
    setSearchQuery(selectionBubble.text);
    setSelectionBubble(null);
    searchInputRef.current?.focus();
  };

  const renderMessages = () =>
    messages.map((message) => (
      <div
        key={message.id}
        className={`flex ${
          message.role === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`rounded-2xl border px-6 py-5 shadow-lg shadow-black/20 ${
            message.role === "user"
              ? "inline-flex max-w-full md:max-w-[70%] flex-col bg-accent text-black border-accent/70"
              : "w-full bg-zinc-900 border-zinc-800 text-white"
          }`}
        >
          <p
            className={`text-sm uppercase tracking-wide mb-3 ${
              message.role === "user" ? "text-black/70" : "text-accent/70"
            }`}
          >
            {message.role === "user" ? "You" : "OpenAuto AI"}
          </p>

          <p
            className={`text-lg leading-relaxed ${
              message.role === "user" ? "text-black" : "text-zinc-200"
            }`}
          >
            {message.content}
          </p>

          {message.type === "diagnosis" && message.diagnoses && (
            <div className="mt-6 space-y-4">
              {message.diagnoses.map((diagnosis, index) => (
                <DiagnosisCard
                  key={`${message.id}-${diagnosis.id}`}
                  diagnosis={diagnosis}
                  index={index}
                  onClick={() => handleDiagnosisClick(diagnosis)}
                  onThumbsUp={() => handleThumbsUp(diagnosis.id)}
                  onThumbsDown={() => handleThumbsDown(diagnosis.id)}
                />
              ))}
            </div>
          )}

          {message.type === "parts" && (
            <div className="mt-6 space-y-4">
              {message.parts && message.parts.length > 0 ? (
                message.parts.map((part, index) => (
                  <PartSpecCard
                    key={`${message.id}-${part.id}`}
                    part={part}
                    index={index}
                  />
                ))
              ) : (
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-center text-zinc-400">
                  No matching parts or specs found. Try refining the request.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    ));

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicleForm.label.trim() || !newVehicleForm.notes.trim()) {
      alert("Please provide a vehicle label and service notes.");
      return;
    }

    const newVehicle: VehicleProfile = {
      id: `veh-${Date.now()}`,
      label: newVehicleForm.label.trim(),
      make: newVehicleForm.make.trim() || "Unknown",
      model: newVehicleForm.model.trim() || "Unknown",
      year: newVehicleForm.year.trim() || "Unknown",
      source: newVehicleForm.source,
      lastUpdated: "Just added",
      notes: newVehicleForm.notes.trim(),
    };

    setVehicles((prev) => [newVehicle, ...prev]);
    setConversations((prev) => ({ ...prev, [newVehicle.id]: [] }));
    setSelectedVehicleId(newVehicle.id);
    setNewVehicleForm({
      label: "",
      make: "",
      model: "",
      year: "",
      source: "Manual",
      notes: "",
    });
    setIsAddFormOpen(false);
  };

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Left Sidebar */}
      <aside
        className={`hidden lg:flex border-r border-zinc-900 bg-zinc-950/70 backdrop-blur flex-col overflow-hidden transition-all duration-300 ${
          garageOpen ? "w-80" : "w-14"
        }`}
      >

        {garageOpen ? (
          <>
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">Vehicles</h2>
              <button
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-accent transition-colors"
                onClick={() => setGarageOpen(false)}
                aria-label="Collapse vehicles"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
            <div className="px-6 py-4 border-b border-zinc-900/60">
              <button
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-semibold text-accent hover:border-accent transition-colors"
                onClick={() => setIsAddFormOpen((prev) => !prev)}
              >
                {isAddFormOpen ? "Close" : "+ Add Vehicle"}
              </button>
              {isAddFormOpen && (
                <form className="mt-4 space-y-3" onSubmit={handleAddVehicle}>
                  <input
                    type="text"
                    placeholder="Vehicle label (e.g., Tahoe - Misfire)"
                    value={newVehicleForm.label}
                    onChange={(e) =>
                      setNewVehicleForm((prev) => ({ ...prev, label: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-black/40 border border-zinc-800 rounded-lg text-sm"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Make"
                      value={newVehicleForm.make}
                      onChange={(e) =>
                        setNewVehicleForm((prev) => ({ ...prev, make: e.target.value }))
                      }
                      className="w-1/3 px-3 py-2 bg-black/40 border border-zinc-800 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Model"
                      value={newVehicleForm.model}
                      onChange={(e) =>
                        setNewVehicleForm((prev) => ({ ...prev, model: e.target.value }))
                      }
                      className="w-1/3 px-3 py-2 bg-black/40 border border-zinc-800 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Year"
                      value={newVehicleForm.year}
                      onChange={(e) =>
                        setNewVehicleForm((prev) => ({ ...prev, year: e.target.value }))
                      }
                      className="w-1/3 px-3 py-2 bg-black/40 border border-zinc-800 rounded-lg text-sm"
                    />
                  </div>
                  <select
                    value={newVehicleForm.source}
                    onChange={(e) =>
                      setNewVehicleForm((prev) => ({
                        ...prev,
                        source: e.target.value as VehicleProfile["source"],
                      }))
                    }
                    className="w-full px-3 py-2 bg-black/40 border border-zinc-800 rounded-lg text-sm"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Tekmetric">Tekmetric</option>
                    <option value="Mitchell">Mitchell</option>
                  </select>
                  <textarea
                    placeholder="Service notes / current issue (required)"
                    value={newVehicleForm.notes}
                    onChange={(e) =>
                      setNewVehicleForm((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-black/40 border border-zinc-800 rounded-lg text-sm min-h-[90px]"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    Save Vehicle
                  </button>
                </form>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {vehicles.map((vehicle) => {
                const vehicleMessages = conversations[vehicle.id] ?? [];
                const lastMessage = vehicleMessages[vehicleMessages.length - 1];
                const isActive = vehicle.id === selectedVehicleId;

                return (
                  <button
                    key={vehicle.id}
                    onClick={() => setSelectedVehicleId(vehicle.id)}
                    className={`w-full text-left px-5 py-4 border-b border-zinc-900 transition-colors ${
                      isActive ? "bg-zinc-900/60" : "hover:bg-zinc-900/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{vehicle.label}</p>
                      <span className="text-xs uppercase tracking-wide text-zinc-500">
                        {vehicle.source}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      {vehicle.make} {vehicle.model} • {vehicle.year}
                    </p>
                    <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
                      {lastMessage?.content || vehicle.notes}
                    </p>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-start justify-center pt-6">
            <button
              className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-accent transition-colors"
              onClick={() => setGarageOpen(true)}
              aria-label="Expand vehicles"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <div
          className={`flex-1 transition-all duration-300 overflow-hidden ${
            selectedDiagnosis || activeInfoSection ? "mr-0 md:mr-[50%]" : ""
          }`}
        >
        <div className="h-full overflow-y-auto">
          <div
            className={`w-full ${
              drawerOpen
                ? "ml-auto pl-6 pr-3 py-10 max-w-full"
                : "mx-auto px-6 py-12 max-w-5xl"
            }`}
          >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="text-sm uppercase tracking-wide text-zinc-500 mb-2">
              Chatting about
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">
              {currentVehicle?.label || "OpenAuto"}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-6">
              <span className="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
                {currentVehicle?.make || "Make"}
              </span>
              <span className="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
                {currentVehicle?.model || "Model"}
              </span>
              <span className="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
                {currentVehicle?.year || "Year"}
              </span>
            </div>

            {currentVehicle?.notes && (
              <div
                className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6 ${
                  drawerOpen ? "ml-auto max-w-4xl" : "mx-auto max-w-4xl"
                }`}
              >
                <p className="text-xs uppercase tracking-wide text-accent mb-2">
                  Service Context
                </p>
                <p className="text-zinc-300 leading-relaxed">
                  {currentVehicle.notes}
                </p>
              </div>
            )}
          </motion.div>

            <div
              className={`max-w-4xl flex flex-col gap-10 pb-24 ${
                drawerOpen ? "ml-auto pr-3 w-full" : "mx-auto w-full"
              }`}
            >
            <div className="space-y-6">{renderMessages()}</div>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="mx-auto w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-center text-zinc-400"
              >
                Thinking through the best answer…
              </motion.div>
            )}

            <div ref={scrollAnchorRef} />

          {/* Search Bar */}
            <div className="sticky bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-zinc-900 pt-6 pb-4 -mx-4">
              <div className="max-w-3xl mx-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            isLoading={isLoading}
            inputRef={searchInputRef}
          />
              </div>
            </div>
          </div>
          </div>
        </div>
        </div>

        {/* Right Info Panel */}
        <aside
          className={`hidden xl:flex flex-col bg-zinc-950/80 backdrop-blur transition-all duration-300 ${
            infoPanelOpen ? "w-80" : "w-12"
          }`}
        >
          <button
            className="absolute -left-4 top-6 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-accent transition-colors"
            onClick={() => setInfoPanelOpen((prev) => !prev)}
            aria-label="Toggle info panel"
          >
            {infoPanelOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {infoPanelOpen && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <h3 className="text-lg font-semibold">Popular Information</h3>
              {infoSections.map((section) => (
                <button
                  key={section.title}
                  onClick={() => {
                    setPreviousInfoSection(null);
                    setInfoSearch("");
                    setActiveInfoSection(section);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 text-left hover:border-accent/60 transition-colors"
                >
                  <section.icon className="w-5 h-5 text-accent" />
                  <p className="font-semibold text-white">{section.title}</p>
                </button>
              ))}
            </div>
          )}
        </aside>
      </div>

      {selectionBubble && (
        <button
          className="fixed z-40 px-3 py-1 rounded-full bg-accent text-black text-xs font-semibold shadow-lg shadow-black/30 border border-black/20"
          style={{
            top: Math.max(selectionBubble.y, 80),
            left: selectionBubble.x,
            transform: "translate(-50%, -100%)",
          }}
          onClick={handleAskFromSelection}
        >
          Ask OpenAuto
        </button>
      )}

      {/* Info Panel Drawer */}
      <AnimatePresence>
        {activeInfoSection && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-full md:w-1/2 bg-zinc-950 overflow-y-auto shadow-2xl z-40"
          >
            <div className="sticky top-0 bg-zinc-950 border-b border-zinc-800 p-6 flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <activeInfoSection.icon className="w-6 h-6 text-accent" />
                <div>
                  <p className="text-lg font-semibold text-white">
                    {activeInfoSection.title}
                  </p>
                  <p className="text-sm text-zinc-500">Reference digest</p>
                </div>
              </div>
              <div className="flex gap-2">
                {previousInfoSection && (
                  <button
                    onClick={() => {
                      setActiveInfoSection(previousInfoSection);
                      setPreviousInfoSection(null);
                      setInfoSearch("");
                    }}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    aria-label="Go back"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setActiveInfoSection(null);
                    setPreviousInfoSection(null);
                    setInfoSearch("");
                  }}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  aria-label="Close info drawer"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <section>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {activeInfoSection.description}
                </p>
              </section>

              {activeInfoSection.table && (
                <section className="space-y-4">
                  {activeInfoSection.table.searchable && (
                    <input
                      type="text"
                      placeholder="Filter by issue, system, symptom, or date…"
                      value={infoSearch}
                      onChange={(e) => setInfoSearch(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40"
                    />
                  )}
                  <div className="overflow-x-auto border border-zinc-800 rounded-2xl">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-900">
                        <tr>
                          {activeInfoSection.table.columns.map((col) => (
                            <th
                              key={col}
                              className="px-4 py-3 font-semibold text-zinc-300 uppercase tracking-wide text-xs border-b border-zinc-800"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activeInfoSection.table.rows
                          .filter((row) => {
                            if (!infoSearch.trim()) return true;
                            const query = infoSearch.toLowerCase();
                            return row.cells.some((cell) =>
                              String(cell).toLowerCase().includes(query)
                            );
                          })
                          .map((row, idx) => (
                            <tr
                              key={`${row.cells[0]}-${idx}`}
                              className={`border-b border-zinc-900 ${
                                row.link ? "cursor-pointer hover:bg-zinc-900/60" : "odd:bg-black/10 even:bg-black/5"
                              }`}
                              onClick={() => {
                                if (row.link) {
                                  setPreviousInfoSection(activeInfoSection);
                                  setInfoSearch("");
                                  setActiveInfoSection({
                                    icon: activeInfoSection.icon,
                                    title: `${row.cells[0]} – ${row.cells[2]}`,
                                    description: String(row.cells[2]),
                                    content: {
                                      title: String(row.cells[2]),
                                      body: [
                                        {
                                          type: "text",
                                          value: `TSB ${row.cells[0]} (${row.cells[1]})`,
                                        },
                                        {
                                          type: "embed",
                                          value: row.link,
                                        },
                                      ],
                                    },
                                  });
                                }
                              }}
                            >
                              {row.cells.map((cell, cellIdx) => (
                                <td key={cellIdx} className="px-4 py-3 text-zinc-200">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {activeInfoSection.links && (
                <section className="space-y-3">
                  {activeInfoSection.links.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => {
                        if (link.label === "B Code Charts") {
                          setPreviousInfoSection(activeInfoSection);
                          setInfoSearch("");
                          setActiveInfoSection({
                            icon: Activity,
                            title: "B Code Charts",
                            description:
                              "Common B-series diagnostic trouble codes.",
                            list: [
                              "B1000",
                              "B1001",
                              "B1002",
                              "B1008",
                              "B1011",
                              "B1026",
                              "B1032",
                              "B1036",
                              "B1077",
                              "B1078",
                              "B1079",
                              "B1127",
                              "B1128",
                              "B1129",
                              "B1150",
                              "B1152",
                              "B1155",
                              "B1156",
                              "B1157",
                              "B1159",
                              "B1160",
                              "B1168",
                              "B1169",
                              "B1170",
                              "B1175",
                              "B1176",
                              "B1177",
                              "B1178",
                              "B1183",
                              "B1187",
                              "B1188",
                              "B1900",
                              "B1905",
                              "B1906",
                              "B1925",
                            ],
                          });
                        }
                      }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-accent text-left hover:text-white hover:border-accent transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}
                </section>
              )}

              {activeInfoSection.list && (
                <section className="space-y-3">
                  <h4 className="text-sm uppercase tracking-wide text-zinc-500">
                    Codes
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-zinc-200">
                    {activeInfoSection.list.map((code) => (
                      <button
                        key={code}
                        onClick={() => {
                          if (code === "B1000") {
                            setPreviousInfoSection(activeInfoSection);
                            setActiveInfoSection({
                              icon: Activity,
                              title: "B1000 – Communication Bus Line Error",
                              description:
                                "If multiple DTCs are present, follow B-CAN System Diagnosis Test Mode A before proceeding.",
                              content: {
                                title: "DTC B1000 Troubleshooting Steps",
                                body: [
                                  {
                                    type: "text",
                                    value:
                                      "1. Clear the DTCs with the HDS.\n2. Turn the ignition switch OFF, then back ON (II).\n3. Wait at least 6 seconds.\n4. Recheck for DTCs with the HDS.",
                                  },
                                  {
                                    type: "text",
                                    value:
                                      "Is DTC B1000 indicated?\nYES – Go to step 5.\nNO – Intermittent failure. Inspect connections, wiring, battery, and charging system.",
                                  },
                                  {
                                    type: "text",
                                    value:
                                      "5. Check for accompanying DTCs B1008, B1011, and B1032.\nYES – Go to step 6.\nNO – Faulty MICU; replace the under-dash fuse/relay box.",
                                  },
                                  {
                                    type: "text",
                                    value:
                                      "6. With ignition OFF, disconnect control units one at a time. After each removal, clear DTCs and recheck.",
                                  },
                                  {
                                    type: "text",
                                    value:
                                      "Is B1000 still indicated when each unit is disconnected?\nYES – Go to step 8.\nNO – Replace the last unit removed.",
                                  },
                                  {
                                    type: "text",
                                    value:
                                      "8. Disconnect under-dash fuse/relay box connector Q (16P). Check continuity between terminal No.6 and body ground.",
                                  },
                                  {
                                    type: "text",
                                    value:
                                      "Continuity present?\nYES – Repair short to ground.\nNO – Move to step 10.",
                                  },
                                  {
                                    type: "text",
                                    value:
                                      "10. Ignition ON (II). Measure voltage between connector Q terminal No.6 and ground.",
                                  },
                                  {
                                    type: "text",
                                    value:
                                      "Voltage present?\nYES – Repair short to power between fuse/relay box and affected control unit.\nNO – Faulty MICU; replace the under-dash fuse/relay box.",
                                  },
                                ],
                              },
                            });
                          }
                        }}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-left hover:border-accent/60 hover:text-accent transition-colors"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {activeInfoSection.content && (
                <section className="space-y-4">
                  {activeInfoSection.content.body.map((entry, idx) => {
                    if (entry.type === "embed" && typeof entry.value === "string") {
                      return (
                        <div
                          key={idx}
                          className="bg-black border border-zinc-800 rounded-xl overflow-hidden h-[calc(100vh-8rem)]"
                        >
                          <iframe
                            src={entry.value}
                            className="w-full h-full"
                            title={`embed-${idx}`}
                          />
                        </div>
                      );
                    }
                    return (
                      <p
                        key={idx}
                        className="text-zinc-300 leading-relaxed whitespace-pre-wrap"
                      >
                        {entry.value}
                      </p>
                    );
                  })}
                </section>
              )}

              {activeInfoSection.details && (
                <section className="space-y-3">
                  {activeInfoSection.details.map((detail) => (
                    <div
                      key={detail}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300"
                    >
                      {detail}
                    </div>
                  ))}
                </section>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Sidebar */}
      <DetailsSidebar
        diagnosis={selectedDiagnosis}
        onClose={handleCloseSidebar}
      />
    </div>
  );
}
