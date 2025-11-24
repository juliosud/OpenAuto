"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import VehicleInputs from "@/components/VehicleInputs";
import SearchBar from "@/components/SearchBar";
import DiagnosisCard, { Diagnosis } from "@/components/DiagnosisCard";
import DetailsSidebar from "@/components/DetailsSidebar";

// Mock diagnosis data
const mockDiagnoses: Diagnosis[] = [
  {
    id: 1,
    summary: "Faulty oxygen sensor causing poor fuel efficiency and rough idle",
    probability: 78,
    details: {
      steps: [
        "Locate the oxygen sensor on the exhaust manifold",
        "Disconnect the electrical connector from the sensor",
        "Use an oxygen sensor socket to remove the old sensor",
        "Apply anti-seize compound to the threads of the new sensor",
        "Install the new sensor and torque to 30-40 ft-lbs",
        "Reconnect the electrical connector and clear error codes",
      ],
      diagrams: ["/placeholder.png", "/placeholder.png"],
      specs: [
        "Sensor Type: Heated Oxygen Sensor (HO2S)",
        "Location: Bank 1, Sensor 1 (upstream)",
        "Torque Specification: 30-40 ft-lbs",
        "Voltage Range: 0.1-0.9V",
        "Response Time: <100ms",
      ],
      parts: [
        { name: "Bosch Oxygen Sensor (15730)", link: "#" },
        { name: "Anti-Seize Compound", link: "#" },
        { name: "Oxygen Sensor Socket", link: "#" },
      ],
    },
  },
  {
    id: 2,
    summary:
      "Worn brake pads causing squealing noise and reduced stopping power",
    probability: 85,
    details: {
      steps: [
        "Safely lift and secure the vehicle on jack stands",
        "Remove the wheel to access the brake caliper",
        "Remove the caliper bolts and slide the caliper off",
        "Remove the old brake pads from the caliper bracket",
        "Compress the caliper piston using a C-clamp",
        "Install new brake pads and reassemble the caliper",
        "Pump the brake pedal to restore pressure before driving",
      ],
      diagrams: ["/placeholder.png", "/placeholder.png", "/placeholder.png"],
      specs: [
        "Pad Thickness: Minimum 3mm",
        "Rotor Thickness: Check manufacturer specs",
        "Caliper Bolt Torque: 25-35 ft-lbs",
        "Wheel Lug Torque: 80-100 ft-lbs",
        "Break-in Period: 200-300 miles",
      ],
      parts: [
        { name: "Ceramic Brake Pad Set", link: "#" },
        { name: "Brake Cleaner Spray", link: "#" },
        { name: "Brake Lubricant", link: "#" },
      ],
    },
  },
  {
    id: 3,
    summary:
      "Failing alternator leading to battery drain and electrical issues",
    probability: 72,
    details: {
      steps: [
        "Disconnect the negative battery terminal",
        "Remove the serpentine belt from the alternator pulley",
        "Disconnect the electrical connections from the alternator",
        "Remove the mounting bolts and extract the alternator",
        "Install the new alternator and secure with mounting bolts",
        "Reconnect electrical connections and install the belt",
        "Reconnect battery and test charging system output",
      ],
      diagrams: ["/placeholder.png"],
      specs: [
        "Output Voltage: 13.5-14.5V at idle",
        "Amperage Rating: Check vehicle specifications",
        "Belt Tension: 50-70 lbs deflection",
        "Mounting Bolt Torque: 30-40 ft-lbs",
        "Test Load: 12.6V minimum at rest",
      ],
      parts: [
        { name: "Remanufactured Alternator", link: "#" },
        { name: "Serpentine Belt", link: "#" },
        { name: "Battery Terminal Cleaner", link: "#" },
      ],
    },
  },
  {
    id: 4,
    summary:
      "Clogged fuel filter restricting fuel flow and causing engine hesitation",
    probability: 65,
    details: {
      steps: [
        "Relieve fuel system pressure by removing the fuel pump fuse",
        "Locate the fuel filter along the fuel line",
        "Place a drain pan under the filter to catch fuel",
        "Disconnect the fuel lines from both ends of the filter",
        "Remove the old filter from its mounting bracket",
        "Install the new filter ensuring correct flow direction",
        "Reconnect fuel lines and check for leaks before starting",
      ],
      diagrams: ["/placeholder.png", "/placeholder.png"],
      specs: [
        "Filter Type: Inline fuel filter",
        "Micron Rating: 10-40 microns",
        "Flow Direction: Arrow on filter body",
        "Replacement Interval: 30,000-40,000 miles",
        "Fuel Pressure: 40-60 PSI (typical)",
      ],
      parts: [
        { name: "OEM Fuel Filter", link: "#" },
        { name: "Fuel Line Quick Disconnect Tool", link: "#" },
        { name: "Shop Towels", link: "#" },
      ],
    },
  },
  {
    id: 5,
    summary:
      "Dirty mass airflow sensor affecting air-fuel mixture and performance",
    probability: 68,
    details: {
      steps: [
        "Turn off the engine and disconnect the battery",
        "Locate the MAF sensor between the air filter and throttle body",
        "Disconnect the electrical connector from the sensor",
        "Remove the clamps or screws securing the sensor",
        "Spray MAF sensor cleaner on the sensing elements (do not touch)",
        "Allow to air dry completely (10-15 minutes)",
        "Reinstall the sensor and reconnect all connections",
      ],
      diagrams: ["/placeholder.png"],
      specs: [
        "Sensor Type: Hot-wire or hot-film MAF",
        "Voltage Range: 0-5V output",
        "Airflow Range: 0-400 g/s (varies by engine)",
        "Cleaning Interval: Every 30,000 miles",
        "Drying Time: 10-15 minutes minimum",
      ],
      parts: [
        { name: "MAF Sensor Cleaner", link: "#" },
        { name: "Replacement Air Filter", link: "#" },
        { name: "Electrical Contact Cleaner", link: "#" },
      ],
    },
  },
];

export default function Home() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(
    null
  );

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setDiagnoses(mockDiagnoses);
      setIsLoading(false);
    }, 1500);
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className={`transition-all duration-300 ${
          selectedDiagnosis ? "mr-0 md:mr-[50%]" : ""
        }`}
      >
        <div className="container mx-auto px-6 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-accent mb-8">
              OpenAuto
            </h1>

            <VehicleInputs
              make={make}
              model={model}
              year={year}
              onMakeChange={setMake}
              onModelChange={setModel}
              onYearChange={setYear}
            />
          </motion.div>

          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            isLoading={isLoading}
          />

          {/* Diagnosis Results */}
          {diagnoses.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-2xl font-semibold mb-6 text-zinc-300">
                Possible Diagnoses
              </h2>
              {diagnoses.map((diagnosis, index) => (
                <DiagnosisCard
                  key={diagnosis.id}
                  diagnosis={diagnosis}
                  index={index}
                  onClick={() => handleDiagnosisClick(diagnosis)}
                  onThumbsUp={() => handleThumbsUp(diagnosis.id)}
                  onThumbsDown={() => handleThumbsDown(diagnosis.id)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Details Sidebar */}
      <DetailsSidebar
        diagnosis={selectedDiagnosis}
        onClose={handleCloseSidebar}
      />
    </div>
  );
}
