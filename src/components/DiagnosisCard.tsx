"use client";

import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export interface Diagnosis {
  id: number;
  summary: string;
  probability: number;
  details: {
    steps: string[];
    diagrams: string[];
    specs: string[];
    parts: { name: string; link: string }[];
    rationale?: string;
    sources?: { label: string; href?: string }[];
  };
}

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  index: number;
  onClick: () => void;
  onThumbsUp: () => void;
  onThumbsDown: () => void;
}

export default function DiagnosisCard({
  diagnosis,
  index,
  onClick,
  onThumbsUp,
  onThumbsDown,
}: DiagnosisCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all shadow-lg shadow-black/20 mb-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div
          onClick={onClick}
          className="flex-1 cursor-pointer hover:text-accent transition-colors"
        >
          <p className="text-base leading-relaxed">{diagnosis.summary}</p>
          {diagnosis.details.rationale && (
            <p className="text-sm text-zinc-400 mt-2">
              {diagnosis.details.rationale}
            </p>
          )}
          {diagnosis.details.sources && diagnosis.details.sources.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
              {diagnosis.details.sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.href || "#"}
                  target={source.href ? "_blank" : undefined}
                  rel={source.href ? "noopener noreferrer" : undefined}
                  className={`px-2 py-1 rounded-full border border-zinc-800 ${
                    source.href
                      ? "hover:border-accent hover:text-accent transition-colors"
                      : ""
                  }`}
                >
                  {source.label || "Reference"}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="px-4 py-2 bg-accent/10 border border-accent/30 rounded-lg">
            <span className="text-accent font-semibold">
              {diagnosis.probability}% likely
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onThumbsUp();
            }}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
            aria-label="Thumbs up"
          >
            <ThumbsUp className="w-5 h-5 text-zinc-500 group-hover:text-accent transition-colors" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onThumbsDown();
            }}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
            aria-label="Thumbs down"
          >
            <ThumbsDown className="w-5 h-5 text-zinc-500 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
