"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  isLoading,
  inputRef,
}: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      onSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto mb-12"
    >
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
        <input
          type="text"
          ref={inputRef}
          placeholder="Ask for a diagnosis or specific part details…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="w-full pl-14 pr-6 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white text-lg placeholder-zinc-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20"
        />
        {isLoading && (
          <div className="absolute inset-0 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-accent/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
