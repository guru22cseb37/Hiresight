"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "icon" | "full";
  className?: string;
  size?: number;
}

export function Logo({ variant = "full", className, size = 40 }: LogoProps) {
  const isFull = variant === "full";
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("flex items-center gap-3", className)}
    >
      <div className="relative group">
        <motion.div 
          animate={{ 
            boxShadow: ["0 0 0px rgba(99, 102, 241, 0)", "0 0 20px rgba(99, 102, 241, 0.4)", "0 0 0px rgba(99, 102, 241, 0)"] 
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-xl bg-blue-500/20 blur-xl"
        />
        <Image
          src={isFull ? "/logo-full.png" : "/logo-icon.png"}
          alt="HireSight Logo"
          width={isFull ? size * 4 : size}
          height={size}
          className="relative z-10 object-contain transition-transform group-hover:scale-105"
          priority
        />
      </div>
    </motion.div>
  );
}
