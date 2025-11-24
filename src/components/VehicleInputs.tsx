"use client";

import { motion } from "framer-motion";

interface VehicleInputsProps {
  make: string;
  model: string;
  year: string;
  onMakeChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

export default function VehicleInputs({
  make,
  model,
  year,
  onMakeChange,
  onModelChange,
  onYearChange,
}: VehicleInputsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex gap-4 justify-center mb-12"
    >
      <input
        type="text"
        placeholder="Make"
        value={make}
        onChange={(e) => onMakeChange(e.target.value)}
        className="w-32 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
      />
      <input
        type="text"
        placeholder="Model"
        value={model}
        onChange={(e) => onModelChange(e.target.value)}
        className="w-32 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
      />
      <input
        type="text"
        placeholder="Year"
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
        className="w-32 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
      />
    </motion.div>
  );
}
