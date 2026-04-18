import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CSPostHogProvider } from "@/components/providers/PostHogProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HireSight | AI-Powered Hiring Intelligence",
  description: "Land your dream job or find the perfect candidate with HireSight's AI intelligence platform.",
};

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeCustomizer } from "@/components/theme/ThemeCustomizer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} antialiased selection:bg-blue-500/30`}
        suppressHydrationWarning
      >
        <CSPostHogProvider>
          <ThemeProvider>
            <TooltipProvider>
              {children}
              <ThemeCustomizer />
              <Toaster position="top-right" closeButton theme="dark" />
            </TooltipProvider>
          </ThemeProvider>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
