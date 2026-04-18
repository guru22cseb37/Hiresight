"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeContextType = {
  themeColor: string;
  setThemeColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColor] = useState("#0A0A0F");

  useEffect(() => {
    const savedColor = localStorage.getItem("hiresight-theme-color");
    if (savedColor) {
      setThemeColor(savedColor);
      updateThemeVariables(savedColor);
    }
  }, []);

  const updateThemeVariables = (color: string) => {
    const root = document.documentElement;
    root.style.setProperty("--background", color);
    
    // Calculate contrast color for text
    const contrastColor = getContrastColor(color);
    root.style.setProperty("--foreground", contrastColor === "light" ? "#F8FAFC" : "#0F172A");
    root.style.setProperty("--card", contrastColor === "light" ? lightenColor(color, 5) : darkenColor(color, 5));
    root.style.setProperty("--card-foreground", contrastColor === "light" ? "#F8FAFC" : "#0F172A");
    root.style.setProperty("--border", contrastColor === "light" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)");
  };

  const handleSetThemeColor = (color: string) => {
    setThemeColor(color);
    localStorage.setItem("hiresight-theme-color", color);
    updateThemeVariables(color);
  };

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor: handleSetThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeCustomizer = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeCustomizer must be used within ThemeProvider");
  return context;
};

// Helper: Calculate relative luminance for contrast
function getContrastColor(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'dark' : 'light';
}

function lightenColor(col: string, amt: number) {
  let usePound = false;
  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }
  let num = parseInt(col, 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

function darkenColor(col: string, amt: number) {
  return lightenColor(col, -amt);
}
