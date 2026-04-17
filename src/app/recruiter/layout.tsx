"use client";

import { Sidebar } from "@/components/layout/Sidebar";

export const dynamic = 'force-dynamic';

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar role="recruiter" />
      <main className="flex-1 md:ml-64 overflow-y-auto overflow-x-hidden relative h-full">
        {/* Recruiter-specific violet background accents */}
        <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[128px] -z-10 pointer-events-none" />
        <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px] -z-10 pointer-events-none" />
        
        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
