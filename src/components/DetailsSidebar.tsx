"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Wrench, Image as ImageIcon, FileText, Package } from "lucide-react";
import { Diagnosis } from "./DiagnosisCard";

interface DetailsSidebarProps {
  diagnosis: Diagnosis | null;
  onClose: () => void;
}

export default function DetailsSidebar({
  diagnosis,
  onClose,
}: DetailsSidebarProps) {
  return (
    <AnimatePresence>
      {diagnosis && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 h-screen w-full md:w-1/2 bg-zinc-950 border-l border-zinc-800 overflow-y-auto shadow-2xl"
        >
          <div className="sticky top-0 bg-zinc-950 border-b border-zinc-800 p-6 flex justify-between items-center z-10">
            <h2 className="text-xl font-bold text-accent">Diagnosis Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Step-by-Step Fix */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Wrench className="w-6 h-6 text-accent" />
                <h3 className="text-lg font-semibold">Step-by-Step Fix</h3>
              </div>
              <div className="space-y-3">
                {diagnosis.details.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-accent text-black rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="text-zinc-300 leading-relaxed">{step}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Diagrams */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <ImageIcon className="w-6 h-6 text-accent" />
                <h3 className="text-lg font-semibold">Diagrams</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {diagnosis.details.diagrams.map((diagram, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden"
                  >
                    <img
                      src={diagram}
                      alt={`Diagram ${index + 1}`}
                      className="w-full h-48 object-cover bg-zinc-800"
                    />
                    <div className="p-3 text-sm text-zinc-400">
                      Diagram {index + 1}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Technical Specs */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-accent" />
                <h3 className="text-lg font-semibold">Technical Specs</h3>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                <ul className="space-y-2">
                  {diagnosis.details.specs.map((spec, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 text-zinc-300"
                    >
                      <span className="text-accent mt-1">•</span>
                      <span>{spec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Parts */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-accent" />
                <h3 className="text-lg font-semibold">Required Parts</h3>
              </div>
              <div className="space-y-3">
                {diagnosis.details.parts.map((part, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex justify-between items-center hover:border-zinc-700 transition-colors"
                  >
                    <span className="text-zinc-300">{part.name}</span>
                    <a
                      href={part.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      View Part
                    </a>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
