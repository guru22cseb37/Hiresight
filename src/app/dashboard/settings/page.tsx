"use client";

import { 
  User, Shield, Bell, CreditCard, 
  Settings as SettingsIcon, Save, 
  MapPin, Briefcase, Mail, Power
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function SeekerSettingsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white italic">Settings</h1>
        <p className="text-slate-400">Manage your profile visibility, preferences, and account security.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="glass border-white/5 bg-white/5 p-1 gap-1 h-12">
          <TabsTrigger value="profile" className="gap-2 px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2 px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
            <Bell className="w-4 h-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2 px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
            <CreditCard className="w-4 h-4" />
            Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <SettingsSection 
            title="Personal Information" 
            description="Update your basic details for better AI matching accuracy."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Full Name</Label>
                <Input placeholder="Your name" className="glass border-white/10" defaultValue="Alex Johnson" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Target Role</Label>
                <Input placeholder="e.g. Senior Frontend Engineer" className="glass border-white/10" defaultValue="Senior Product Designer" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <Input placeholder="City, Country" className="pl-10 glass border-white/10" defaultValue="Remote / New York" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Years of Experience</Label>
                <Input type="number" className="glass border-white/10" defaultValue="6" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-300">Portfolio URL</Label>
                <Input placeholder="https://" className="glass border-white/10" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-300">Professional Bio</Label>
                <textarea 
                  className="w-full min-h-[100px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Tell recruiters about your unique impact..."
                />
              </div>
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <SettingsSection 
            title="Notification Preferences" 
            description="Choose how you want to be alerted about job matches and interview invites."
          >
            <div className="p-6 space-y-4">
              <PreferenceToggle title="Email Alerts" description="Daily digest of tailored job recommendations." active={true} />
              <PreferenceToggle title="Interview Reminders" description="SMS notifications for scheduled mock interviews." active={true} />
              <PreferenceToggle title="ATS Health Reports" description="Weekly analysis of your resume performance." active={false} />
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SettingsSection 
            title="Account Security" 
            description="Protect your intelligence data and session access."
          >
            <div className="grid grid-cols-1 gap-6 p-6">
              <div className="space-y-2 max-w-sm">
                <Label className="text-slate-300">Current Password</Label>
                <Input type="password" placeholder="••••••••" className="glass border-white/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <div className="space-y-2">
                  <Label className="text-slate-300">New Password</Label>
                  <Input type="password" placeholder="••••••••" className="glass border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Confirm Password</Label>
                  <Input type="password" placeholder="••••••••" className="glass border-white/10" />
                </div>
              </div>
              <div className="pt-4">
                <Button variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/5">
                  <Power className="w-4 h-4 mr-2" />
                  Sign Out of All Devices
                </Button>
              </div>
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="glass border-white/5 p-8 flex items-center justify-between bg-gradient-to-br from-violet-600/10 to-transparent">
             <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-3xl bg-violet-600/20 flex items-center justify-center text-violet-400">
                  <CreditCard className="w-8 h-8" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-white mb-2 italic uppercase tracking-wider">Premium Intelligence</h3>
                 <p className="text-slate-400 text-sm">Active Subscription: $19 / Month. Next billing date: May 20, 2026.</p>
               </div>
             </div>
             <Button variant="outline" className="glass border-white/10">Manage Subscription</Button>
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

function PreferenceToggle({ title, description, active }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
      <div>
        <div className="text-sm font-bold text-white">{title}</div>
        <div className="text-[10px] text-slate-500">{description}</div>
      </div>
      <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${active ? "bg-blue-600" : "bg-slate-800"}`}>
        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${active ? "left-6" : "left-1"}`} />
      </div>
    </div>
  );
}
