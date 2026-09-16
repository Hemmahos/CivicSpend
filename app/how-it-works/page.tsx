import React from 'react';
import { Search, ShieldCheck, MapPin, Calculator, Users } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">How CivicSpend Works</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A decentralized ecosystem connecting everyday citizens with verified professionals to hold public infrastructure spending accountable.
        </p>
      </div>
      
      <div className="space-y-24">
        {/* Step 1 */}
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <Search size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-4">1. AI Discovery & Manual Reporting</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              CivicSpend automatically scans government databases, procurement portals, and news sources daily using our <strong>AI Radar</strong> to find new infrastructure projects and their claimed budgets. Citizens can also manually report projects ongoing in their local communities.
            </p>
          </div>
          <div className="w-full md:w-1/2 bg-muted rounded-3xl p-8 aspect-video flex items-center justify-center border border-border shadow-sm">
            <div className="bg-card p-6 rounded-2xl shadow-lg border border-border flex items-center gap-4 w-full max-w-md">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                <Search />
              </div>
              <div>
                <p className="font-semibold text-foreground">AI Radar Scanning...</p>
                <p className="text-sm text-muted-foreground">Found: Abuja Light Rail Refurbishment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
          <div className="w-full md:w-1/2">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-6">
              <MapPin size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-4">2. Citizen Evidence Gathering</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Once a project is listed, citizens on the ground take photos and submit field notes of the actual construction progress. You don't even need an account to participate—our system uses secure device caching to allow frictionless voting and evidence uploading.
            </p>
          </div>
          <div className="w-full md:w-1/2 bg-muted rounded-3xl p-8 aspect-video flex items-center justify-center border border-border shadow-sm">
            <div className="bg-card p-6 rounded-2xl shadow-lg border border-border flex flex-col gap-4 w-full max-w-md relative">
              <div className="w-full h-32 bg-muted-foreground/20 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
                  [Citizen Photo]
                </div>
              </div>
              <p className="text-sm font-medium">"Only the foundation has been laid. No active workers on site."</p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-6">
              <Users size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-4">3. Community Consensus</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The community reviews the uploaded evidence and votes on its accuracy. When a project receives enough upvotes (reaching the <strong>Community Verified</strong> status), it is escalated to our network of professional oracles.
            </p>
          </div>
          <div className="w-full md:w-1/2 bg-muted rounded-3xl p-8 aspect-video flex items-center justify-center border border-border shadow-sm">
            <div className="flex gap-4">
              <div className="flex flex-col items-center justify-center w-24 h-24 bg-card rounded-2xl shadow-lg border border-border">
                <span className="text-2xl font-bold text-green-500">↑ 52</span>
                <span className="text-xs text-muted-foreground mt-1">Upvotes</span>
              </div>
              <div className="flex flex-col items-center justify-center w-24 h-24 bg-card rounded-2xl shadow-lg border border-border">
                <span className="text-2xl font-bold text-red-500">↓ 3</span>
                <span className="text-xs text-muted-foreground mt-1">Downvotes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
          <div className="w-full md:w-1/2">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-4">4. Expert Oracle Audit</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Verified professionals (like Civil Engineers or Quantity Surveyors) authenticate via the Expert Dashboard. They review the citizen evidence and cryptographically sign a discrepancy report, detailing the <strong>Actual Verified Physical Value</strong> versus the <strong>Claimed Budget</strong>.
            </p>
          </div>
          <div className="w-full md:w-1/2 bg-muted rounded-3xl p-8 aspect-video flex items-center justify-center border border-border shadow-sm">
             <div className="bg-card p-6 rounded-2xl shadow-lg border border-border flex flex-col gap-4 w-full max-w-md">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-sm font-semibold">Claimed:</span>
                  <span className="font-mono text-red-500">₦450,000,000</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-sm font-semibold">Verified:</span>
                  <span className="font-mono text-green-500">₦120,000,000</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span>Discrepancy:</span>
                  <span className="font-mono text-red-600">₦330,000,000</span>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <div className="mt-24 text-center bg-primary/10 dark:bg-primary/5 rounded-3xl p-12 border border-primary/20">
        <h2 className="text-3xl font-bold mb-4">Ready to hold power accountable?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Start by browsing the community feed, uploading evidence to an ongoing project, or using the AI Radar to find new ones.
        </p>
        <a href="/" className="inline-block bg-primary text-primary-foreground font-medium px-8 py-4 rounded-full hover:bg-primary/90 transition shadow-lg shadow-primary/20">
          Go to Community Feed
        </a>
      </div>
    </div>
  );
}
