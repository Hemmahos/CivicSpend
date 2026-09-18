'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Radar, Bot, Search, FileText, CheckCircle2, ChevronRight, Link as LinkIcon, DollarSign, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AIDiscoveryAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

export const mockDiscoveredProjects = [
  {
    id: 'ai_proj_1',
    project_name: 'Kaduna State Rural Electrification Phase 2',
    location: {
      state_or_region: 'Kaduna',
      specific_address: 'Zaria Environs',
      lat: 11.0855,
      lng: 7.7199
    },
    financials: {
      total_budget_claimed_local_currency: 850000000,
      expert_verified_value: null
    },
    deliverables: ['Solar Mini-grids installation', 'Grid extension to 5 villages'],
    sources: ['https://kadunastate.gov.ng/budget-2026', 'https://dailytrust.com/kaduna-power-project'],
    origin: 'ai_scan' as const,
  },
  {
    id: 'ai_proj_2',
    project_name: 'Federal Medical Centre Annex Construction',
    location: {
      state_or_region: 'Edo State',
      specific_address: 'Benin City By-pass',
      lat: 6.3350,
      lng: 5.6275
    },
    financials: {
      total_budget_claimed_local_currency: 2100000000,
      expert_verified_value: null
    },
    deliverables: ['100-bed hospital wing', 'Diagnostic laboratory'],
    sources: ['https://health.gov.ng/projects/fmc-annex', 'https://vanguardngr.com/fmc-benin-expansion'],
    origin: 'ai_scan' as const,
  }
];

export default function AIDiscoveryAgent({ isOpen, onClose }: AIDiscoveryAgentProps) {
  const { addProject, projects } = useAppStore();
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'parsing' | 'done'>('idle');
  const [selectedProjects, setSelectedProjects] = useState<string[]>(mockDiscoveredProjects.map(p => p.id));
  const [isPublishing, setIsPublishing] = useState(false);

  const [discoveredProjects, setDiscoveredProjects] = useState<any[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setScanStatus('idle');
      setSelectedProjects([]);
      setDiscoveredProjects([]);
    }
  }, [isOpen]);

  const startScan = async () => {
    setScanStatus('scanning');
    try {
      const country = 'Nigeria'; // Hardcoded per user request
      const existingProjects = projects.map(p => p.project_name);

      setScanStatus('parsing');
      
      const res = await fetch('/api/ai-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, existingProjects })
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("AI Oracle Raw Response:", data.debug);
        console.log("AI Oracle Parsed Projects:", data.projects);
        
        setDiscoveredProjects(data.projects || []);
        setSelectedProjects((data.projects || []).map((p: any) => p.id));
      } else {
        console.error("AI Oracle Error:", await res.text());
        toast.error("Failed to connect to AI Oracle.");
      }
    } catch (error) {
      console.error("Scan error:", error);
      toast.error("Network error during AI scan.");
    } finally {
      setScanStatus('done');
    }
  };

  const handlePublish = () => {
    setIsPublishing(true);
    
    // Simulate network delay
    setTimeout(() => {
      const projectsToAdd = discoveredProjects.filter(p => selectedProjects.includes(p.id));
      
      projectsToAdd.forEach(p => {
        addProject({
          ...p,
          id: 'proj_' + Math.random().toString(36).substr(2, 9), // generate new unique ID
          status: 'pending',
          upvotes: 0,
          downvotes: 0,
        });
      });

      toast.success(`${projectsToAdd.length} AI-discovered project(s) added to ledger.`);
      setIsPublishing(false);
      onClose();
    }, 1000);
  };

  const toggleSelection = (id: string) => {
    setSelectedProjects(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#40AFD6]">
            <Bot size={20}/> AI Project Discovery
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 min-h-[300px]">
          {/* State: IDLE */}
          {scanStatus === 'idle' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-[#40AFD6]/10 dark:bg-[#40AFD6]/20 rounded-full flex items-center justify-center mb-6">
                <Radar size={40} className="text-[#40AFD6]" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Deploy AI Scraper</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Our AI Oracle can scan recent government press releases, federal budgets, and verified news outlets to discover newly announced public infrastructure projects in your region.
              </p>
              <Button size="lg" onClick={startScan} className="bg-[#40AFD6] hover:bg-[#40AFD6]/90 text-white px-8 flex items-center gap-2">
                <Search size={18} /> Initiate Scan
              </Button>
            </div>
          )}

          {/* State: SCANNING / PARSING */}
          {(scanStatus === 'scanning' || scanStatus === 'parsing') && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-[#40AFD6]/20 dark:border-[#40AFD6]/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#40AFD6] rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {scanStatus === 'scanning' ? <Search size={28} className="text-[#40AFD6] animate-pulse"/> : <FileText size={28} className="text-[#40AFD6] animate-bounce"/>}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {scanStatus === 'scanning' ? 'Scanning News & Databases...' : 'Parsing Financial Data & Cross-referencing...'}
              </h3>
              <div className="text-sm text-muted-foreground font-mono flex flex-col items-center gap-1">
                <span className={scanStatus === 'scanning' ? 'text-[#40AFD6]' : 'text-muted-foreground'}>&gt; ping gov.ng/budgets ... 200 OK</span>
                {scanStatus === 'parsing' && <span className="text-[#40AFD6]">&gt; extracting entity [Infrastructure] ... Success</span>}
              </div>
            </div>
          )}

          {/* State: DONE */}
          {scanStatus === 'done' && (
            <div className="py-2 flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-4 border-b border-border pb-4 shrink-0">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="text-green-500"/> Found {discoveredProjects.length} Projects
                </h3>
                <p className="text-sm text-muted-foreground">Select projects to add to the public ledger</p>
              </div>

              <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="space-y-4 pb-4">
                  {discoveredProjects.length > 0 ? (
                    discoveredProjects.map((proj) => (
                      <div 
                        key={proj.id} 
                        className={`border rounded-xl p-4 transition-all cursor-pointer ${
                          selectedProjects.includes(proj.id) ? 'border-[#40AFD6] bg-[#40AFD6]/10' : 'border-border hover:border-[#40AFD6]/50'
                        }`}
                        onClick={() => toggleSelection(proj.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <Checkbox checked={selectedProjects.includes(proj.id)} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-foreground">{proj.project_name}</h4>
                            
                            <div className="grid grid-cols-2 gap-2 mt-3 mb-3">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin size={14} className="text-muted-foreground/70"/>
                                {proj.location.specific_address}, {proj.location.state_or_region}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <DollarSign size={14} className="text-muted-foreground/70"/>
                                ₦{proj.financials.total_budget_claimed_local_currency.toLocaleString()}
                              </div>
                            </div>

                            <div className="bg-background rounded border border-border p-2">
                              <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                                <LinkIcon size={12}/> AI Extracted Sources
                              </p>
                              <ul className="space-y-1">
                                {proj.sources.map((src: string, i: number) => (
                                  <li key={i} className="text-xs text-[#40AFD6] truncate max-w-md">{src}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-2xl bg-muted/10">
                      <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={32} className="text-muted-foreground" />
                      </div>
                      <h4 className="text-lg font-bold text-foreground mb-2">You're all caught up!</h4>
                      <p className="text-sm text-muted-foreground max-w-sm px-4">
                        Our AI didn't find any new public infrastructure announcements in your region today. All recently announced projects are already being tracked on the CivicSpend ledger.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border shrink-0">
                <Button variant="outline" onClick={onClose} disabled={isPublishing}>Discard</Button>
                <Button 
                  onClick={handlePublish} 
                  disabled={selectedProjects.length === 0 || isPublishing}
                  className="bg-[#40AFD6] hover:bg-[#40AFD6]/90 text-white flex items-center gap-2"
                >
                  {isPublishing ? 'Publishing...' : `Publish ${selectedProjects.length} to Ledger`} <ChevronRight size={16}/>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
