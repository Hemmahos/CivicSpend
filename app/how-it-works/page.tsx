'use client';

import React from 'react';
import { Search, ShieldCheck, MapPin, Calculator, Users, ArrowRight, Camera, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HowItWorks() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <div className="relative max-w-5xl mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <motion.div 
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
            <ShieldCheck size={16} /> Transparent. Verifiable. Immutable.
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-balance">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#40AFD6]">CivicSpend</span> Works
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A decentralized ecosystem connecting everyday citizens with verified professionals to hold public infrastructure spending accountable.
          </motion.p>
        </motion.div>
      </div>
      
      {/* Steps Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-32">
        {/* Step 1 */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center"
        >
          <div className="w-full md:w-1/2">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
              <Search size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">1. AI Discovery & Manual Reporting</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              CivicSpend automatically scans government databases, procurement portals, and news sources daily using our <strong className="text-foreground">Gemini AI Radar</strong> to find new infrastructure projects and their claimed budgets. Citizens can also manually report projects ongoing in their local communities.
            </p>
          </div>
          <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 rounded-[2rem] p-8 md:p-12 aspect-[4/3] flex items-center justify-center border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-xl">
             {/* Decorative UI elements */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
             
             <div className="bg-background/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-border flex items-center gap-4 w-full max-w-sm relative z-10 transform transition-transform hover:scale-105">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center animate-pulse shrink-0 shadow-inner">
                <Search size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-sm text-foreground">AI Radar Scanning...</p>
                  <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-blue-500 w-2/3 animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">Found: Lagos-Ibadan Expressway Phase 2</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step 2 */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row-reverse gap-12 lg:gap-20 items-center"
        >
          <div className="w-full md:w-1/2">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-orange-200 dark:border-orange-800/50">
              <Camera size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">2. Citizen Evidence Gathering</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Once a project is listed, citizens on the ground take photos and submit field notes of the actual construction progress. You don't even need an account to participate—our system uses <strong className="text-foreground">secure device caching</strong> to allow frictionless voting and evidence uploading while preventing spam.
            </p>
          </div>
          <div className="w-full md:w-1/2 bg-gradient-to-br from-orange-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 rounded-[2rem] p-8 md:p-12 aspect-[4/3] flex items-center justify-center border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-xl">
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

            <div className="bg-background/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-border flex flex-col gap-4 w-full max-w-sm relative z-10 transform transition-transform hover:scale-105">
              <div className="w-full h-40 bg-muted rounded-xl overflow-hidden relative group border border-border/50">
                <img src="https://images.unsplash.com/photo-1541888087405-d91d915ba8eb?q=80&w=800&auto=format&fit=crop" alt="Construction site" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                  <MapPin size={10} className="text-primary" /> Verified GPS
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Users size={14} />
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium mb-1">"Only the foundation has been laid. No active workers on site since Tuesday."</p>
                  <p className="text-xs text-muted-foreground">Uploaded 2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step 3 */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center"
        >
          <div className="w-full md:w-1/2">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary/30">
              <Users size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">3. Community Consensus</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The community reviews the uploaded evidence and votes on its accuracy. When a project receives enough upvotes (reaching the <strong className="text-foreground">Community Verified</strong> status), it is escalated to our network of professional oracles.
            </p>
          </div>
          <div className="w-full md:w-1/2 bg-gradient-to-br from-green-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 rounded-[2rem] p-8 md:p-12 aspect-[4/3] flex items-center justify-center border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-xl">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

            <div className="flex gap-6 z-10">
              <div className="flex flex-col items-center justify-center w-28 h-32 bg-background/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-500/30 transform transition-transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 w-full h-1 bg-green-500"></div>
                <span className="text-4xl font-black text-green-500 mb-1">52</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Upvotes</span>
              </div>
              <div className="flex flex-col items-center justify-center w-28 h-32 bg-background/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border transform transition-transform hover:-translate-y-2 opacity-70">
                <div className="absolute top-0 w-full h-1 bg-red-500/50"></div>
                <span className="text-4xl font-black text-red-500/80 mb-1">3</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Downvotes</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step 4 */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row-reverse gap-12 lg:gap-20 items-center"
        >
          <div className="w-full md:w-1/2">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-purple-200 dark:border-purple-800/50">
              <FileCheck size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">4. Expert Oracle Audit</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Verified professionals (like Civil Engineers or Quantity Surveyors) authenticate via the Expert Dashboard. They review the citizen evidence and <strong className="text-foreground">cryptographically sign a discrepancy report</strong>, permanently locking the Verified Physical Value into our Supabase database.
            </p>
          </div>
          <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 rounded-[2rem] p-8 md:p-12 aspect-[4/3] flex items-center justify-center border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-xl">
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mb-20"></div>

             <div className="bg-background/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-purple-500/30 flex flex-col gap-5 w-full max-w-sm relative z-10 transform transition-transform hover:scale-105">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={18} className="text-purple-500" />
                  <span className="text-sm font-bold text-foreground">Oracle Audit Report</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-border/50 pb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Claimed Budget</span>
                    <span className="font-mono text-sm text-foreground">₦450,000,000</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-border/50 pb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Oracle Value</span>
                    <span className="font-mono text-sm text-green-500">₦120,000,000</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-sm font-bold text-foreground">Discrepancy</span>
                    <span className="font-mono text-lg font-black text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-md">₦330,000,000</span>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
      
      {/* CTA Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="max-w-4xl mx-auto px-4 py-24 mb-16"
      >
        <div className="text-center bg-gradient-to-br from-primary/10 via-background to-primary/5 dark:from-primary/20 dark:via-background dark:to-primary/10 rounded-[3rem] p-12 md:p-16 border border-primary/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight">Ready to hold power accountable?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Start by browsing the community feed, uploading evidence to an ongoing project, or using the AI Radar to discover new ones.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-full hover:bg-primary/90 transition shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1"
          >
            Go to Community Feed <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
