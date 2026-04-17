"use client";

import { useState } from "react";
import { 
  Building2, Users, Bell, Shield, 
  Key, Globe, Mail, CreditCard, 
  Trash2, Save, Plus, ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function RecruiterSettingsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white italic">Suite Settings</h1>
        <p className="text-slate-400">Configure your company profile, team, and AI integrations.</p>
      </div>

      <Tabs defaultValue="company" className="space-y-8">
        <TabsList className="glass border-white/5 bg-white/5 p-1 gap-1 h-12">
          <TabsTrigger value="company" className="gap-2 px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
            <Building2 className="w-4 h-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2 px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
            <Users className="w-4 h-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2 px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
            <Key className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2 px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
            <CreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <SettingsSection 
            title="Company Profile" 
            description="Manage how your company appears to candidates during outreach."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Company Name</Label>
                <Input placeholder="e.g. Acme Corp" className="glass border-white/10" defaultValue="HireSight Tech" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Industry</Label>
                <Input placeholder="e.g. Technology" className="glass border-white/10" defaultValue="Recruiting Technology" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-300">Website URL</Label>
                <Input placeholder="https://" className="glass border-white/10" defaultValue="https://hiresight.ai" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-300">Company Bio</Label>
                <textarea 
                  className="w-full min-h-[100px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Tell candidates about your company mission..."
                />
              </div>
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <SettingsSection 
            title="Team Members" 
            description="Manage recruiter access and collaboration permissions."
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">JD</div>
                  <div>
                    <div className="text-sm font-bold text-white">John Doe (You)</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">Admin</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-500">Manage</Button>
              </div>
              <Button variant="outline" className="w-full border-dashed border-white/10 glass text-blue-400 hover:text-blue-300 hover:bg-blue-600/5">
                <Plus className="w-4 h-4 mr-2" />
                Invite Team Member
              </Button>
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <SettingsSection 
            title="AI & Messaging" 
            description="Configure API connections for analysis and outreach."
          >
            <div className="p-6 space-y-6">
              <IntegrationItem 
                name="Groq (Llama-3)" 
                description="Powering candidate screening and JD optimization." 
                active={true}
              />
              <IntegrationItem 
                name="Resend Email" 
                description="Automating personalized outreach campaigns." 
                active={false}
              />
              <IntegrationItem 
                name="LinkedIn API" 
                description="Syncing candidate profiles and messages." 
                active={true}
              />
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="glass border-white/5 p-8 flex items-center justify-between bg-gradient-to-br from-blue-600/10 to-transparent">
             <div>
               <h3 className="text-xl font-bold text-white mb-2 italic uppercase tracking-wider">Professional Suite</h3>
               <p className="text-slate-400 text-sm">Your trial ends in 12 days. Upgrade to maintain screening capacity.</p>
             </div>
             <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 shadow-lg shadow-blue-600/20">Upgrade Now</Button>
          </Card>
        </TabsContent>
        
        <div className="flex justify-end pt-6 border-t border-white/5">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white gap-2 px-8">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </Tabs>
    </div>
  );
}

function SettingsSection({ title, description, children }: any) {
  return (
    <Card className="glass border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-white/[0.02]">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
      {children}
    </Card>
  );
}

function IntegrationItem({ name, description, active }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? "bg-green-500/10 text-green-500" : "bg-slate-500/10 text-slate-500"}`}>
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">{name}</div>
          <div className="text-[10px] text-slate-500">{description}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant={active ? "default" : "secondary"} className={active ? "bg-green-500/20 text-green-500 border-green-500/20" : "bg-slate-500/10 text-slate-500"}>
          {active ? "Connected" : "Disconnected"}
        </Badge>
        <ChevronRight className="w-4 h-4 text-slate-700" />
      </div>
    </div>
  );
}
