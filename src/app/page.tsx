"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { DemoWidget } from "@/components/landing/DemoWidget";
import { FeatureSects } from "@/components/landing/FeatureSects";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background selection:bg-blue-500/30 relative overflow-hidden">
      {/* Grand Masterpiece Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url("/landing-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background via-transparent to-background z-0" />
      
      <div className="relative z-10">
        <Navbar />
      
      <div className="pt-10">
        <Hero />
        <DemoWidget />
        <FeatureSects />
        <FAQSection />
        <CTASection />
      </div>

        <Footer />
      </div>
    </main>
  );
}

function FAQSection() {
  const faqs = [
    { q: "How does the ATS scoring work?", a: "Our AI uses the same semantic parsing techniques as major Applicant Tracking Systems (Workday, Greenhouse, Lever) to evaluate keyword density, role alignment, and formatting compatibility." },
    { q: "Is HireSight really free?", a: "Yes! HireSight is built to help talent meet opportunity without barriers. All core features for both job seekers and recruiters are free." },
    { q: "Can I manage multiple resumes?", a: "Absolutely. Our Resume Vault allows you to store, version, and AI-tailor multiple resumes for different target roles." },
    { q: "How accurate is the salary intelligence?", a: "We aggregate real-time data from 2024-2025 across Indian and global tech markets, adjusted for company tier and role seniority." },
    { q: "Will my data be shared with employers?", a: "Your data is private. Employers only see what you submit to them. Your integrity scans and resume variants are for your eyes only." },
    { q: "Does the JD optimizer work for hybrid roles?", a: "Yes, our optimizer accounts for location-specific nuances and inclusive language for Remote, Hybrid, and On-site roles." },
  ];

  return (
    <section className="py-24 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        <p className="text-slate-400">Everything you need to know about the platform.</p>
      </div>
      <Accordion className="space-y-4">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="glass px-6 rounded-2xl border-white/5 bg-white/[0.02] border-none">
            <AccordionTrigger className="text-slate-200 hover:text-white hover:no-underline text-left">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 px-6 text-center">
      <div className="max-w-4xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-white/10 glass relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-violet-500" />
        <h2 className="text-4xl font-bold text-white mb-6">Ready to Accelerate Your Career?</h2>
        <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
          Join thousands of developers and recruiters using HireSight to fix the broken hiring funnel.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth?signup=true">
            <Button size="lg" className="h-14 px-10 bg-blue-600 hover:bg-blue-500 text-base">
              Start for Free
            </Button>
          </Link>
          <p className="text-xs text-slate-500">No credit card required. EVER.</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">H</div>
          <span className="font-bold text-white uppercase tracking-widest text-sm">HireSight</span>
        </div>
        
        <div className="flex gap-8 text-xs font-medium text-slate-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-blue-400">Home</Link>
          <Link href="#features" className="hover:text-blue-400">Features</Link>
          <Link href="/auth" className="hover:text-blue-400">Login</Link>
          <Link href="mailto:hello@hiresight.in" className="hover:text-blue-400">Contact</Link>
        </div>

        <div className="text-slate-600 text-[10px] uppercase tracking-widest flex items-center gap-2">
          Made with <span className="text-red-500">❤</span> in India
        </div>
      </div>
    </footer>
  );
}
