"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";

const STEPS = [
  "Initializing neural link...",
  "Scanning global domain records...",
  "Analyzing semantic reputation...",
  "Cross-referencing LinkedIn presence...",
  "Predicting interview patterns...",
  "Finalizing intelligence report..."
];

export function ProcessingStepper({ isProcessing }: { isProcessing: boolean }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);

    return () => clearInterval(interval);
  }, [isProcessing]);

  return (
    <div className="space-y-4 w-full max-w-sm mx-auto">
      {STEPS.map((step, idx) => (
        <div 
          key={idx} 
          className={`flex items-center gap-3 transition-opacity duration-500 ${
            idx > currentStep ? "opacity-20" : "opacity-100"
          }`}
        >
          {idx < currentStep ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : idx === currentStep ? (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          ) : (
            <div className="w-4 h-4 rounded-full border border-white/10" />
          )}
          <span className={`text-[10px] font-black uppercase tracking-widest ${
            idx === currentStep ? "text-white" : "text-slate-500"
          }`}>
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}
