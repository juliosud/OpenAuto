"use client";

import { motion } from "framer-motion";
import { Wrench, FileText, PackageSearch } from "lucide-react";

export interface PartSpec {
  id: number;
  name: string;
  description: string;
  specs: string[];
  compatibility: string[];
  link: string;
}

interface PartSpecCardProps {
  part: PartSpec;
  index: number;
}

export default function PartSpecCard({ part, index }: PartSpecCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4 shadow-lg shadow-black/20"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-accent/70 flex items-center gap-2">
            <PackageSearch className="w-4 h-4" />
            Part Reference
          </p>
          <h3 className="text-2xl font-semibold mt-1">{part.name}</h3>
        </div>
        <a
          href={part.link}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 bg-accent text-black font-semibold rounded-xl hover:bg-accent/90 transition-colors"
        >
          View Part
        </a>
      </div>

      <p className="text-zinc-300 leading-relaxed mb-6">{part.description}</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-zinc-100 uppercase tracking-wide">
            <FileText className="w-4 h-4 text-accent" />
            Key Specs
          </div>
          <ul className="space-y-2 text-zinc-300 text-sm">
            {part.specs.map((spec, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-accent">•</span>
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-zinc-100 uppercase tracking-wide">
            <Wrench className="w-4 h-4 text-accent" />
            Fits / Compatibility
          </div>
          <ul className="space-y-2 text-zinc-300 text-sm">
            {part.compatibility.map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-accent">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

