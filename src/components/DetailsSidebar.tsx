"use client";

import { useState } from "react";
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
  const [activeDiagram, setActiveDiagram] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {diagnosis && (
        <>
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full md:w-1/2 bg-zinc-950 border-l border-zinc-800 overflow-y-auto shadow-2xl z-40"
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
              {/* Rationale */}
              {diagnosis.details.rationale && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-accent" />
                    <h3 className="text-lg font-semibold">Why this fits</h3>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 text-zinc-300 leading-relaxed">
                    {diagnosis.details.rationale}
                  </div>
                </section>
              )}

              {/* Sources */}
              {diagnosis.details.sources && diagnosis.details.sources.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-accent" />
                    <h3 className="text-lg font-semibold">Source Material</h3>
                  </div>
                  <div className="space-y-3">
                    {diagnosis.details.sources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.href || "#"}
                        target={source.href ? "_blank" : undefined}
                        rel={source.href ? "noopener noreferrer" : undefined}
                        className="block bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 hover:border-accent/60 transition-colors"
                      >
                        {source.label || source.href || "Reference"}
                      </a>
                    ))}
                  </div>
                </section>
              )}

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {diagnosis.details.diagrams.map((diagram, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden text-left hover:border-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40"
                      onClick={() => setActiveDiagram(diagram)}
                    >
                      <img
                        src={diagram}
                        alt={`Diagram ${index + 1}`}
                        className="w-full h-48 object-cover bg-zinc-800"
                      />
                      <div className="p-3 text-sm text-zinc-400">
                        Diagram {index + 1} (click to expand)
                      </div>
                    </motion.button>
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

          {/* Diagram Lightbox */}
          <AnimatePresence>
            {activeDiagram && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={() => setActiveDiagram(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-[90vw] max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setActiveDiagram(null)}
                    className="absolute top-4 right-4 p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors"
                    aria-label="Close diagram"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                  <img
                    src={activeDiagram}
                    alt="Expanded diagram"
                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
