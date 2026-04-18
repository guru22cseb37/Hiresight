"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, X, RotateCcw, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeCustomizer } from "./ThemeProvider";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  { name: "Deep Space", color: "#0A0A0F" },
  { name: "Midnight", color: "#0F172A" },
  { name: "Ghost White", color: "#F8FAFC" },
  { name: "Forest", color: "#064E3B" },
  { name: "Bordeaux", color: "#450A0A" },
  { name: "Royal", color: "#1E1B4B" },
  { name: "Slate", color: "#1E293B" },
  { name: "Pure", color: "#FFFFFF" },
];

export function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const { themeColor, setThemeColor } = useThemeCustomizer();

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-500/40 border border-white/10 group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="palette" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Palette className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[320px] glass p-6 rounded-[32px] border-white/10 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Elite Styles
              </h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-500 hover:text-white"
                onClick={() => setThemeColor("#0A0A0F")}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Color Picker */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master Background</label>
              <div className="flex items-center gap-4">
                 <input 
                   type="color" 
                   value={themeColor}
                   onChange={(e) => setThemeColor(e.target.value)}
                   className="h-12 w-12 rounded-xl bg-transparent border-0 cursor-pointer p-0"
                 />
                 <div className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-slate-300">
                    {themeColor.toUpperCase()}
                 </div>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Strategic Presets</label>
               <div className="grid grid-cols-4 gap-3">
                  {PRESET_COLORS.map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => setThemeColor(preset.color)}
                      className={cn(
                        "h-10 w-full rounded-xl border-2 transition-all relative group",
                        themeColor === preset.color ? "border-blue-500 scale-105" : "border-white/5 hover:border-white/20"
                      )}
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    >
                      {themeColor === preset.color && (
                        <Check className={cn(
                          "w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                          getContrastColor(preset.color) === 'dark' ? 'text-black' : 'text-white'
                        )} />
                      )}
                    </button>
                  ))}
               </div>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-[10px] text-blue-400 leading-relaxed font-medium text-center uppercase tracking-widest">
               Adaptive text logic engaged. <br/> Contrast sync active.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getContrastColor(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'dark' : 'light';
}
