'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import DiscrepancyBar from '@/components/DiscrepancyBar';
import { ArrowLeft, MapPin, CheckCircle, AlertTriangle, FileText, Link as LinkIcon, Bot, Users, Building, Camera, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import EvidenceUploadModal from '@/components/EvidenceUploadModal';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { projects } = useAppStore();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-foreground">Project not found</h2>
        <Button onClick={() => router.push('/')} className="mt-6">Back to Home</Button>
      </div>
    );
  }

  const isVerified = project.status === 'community_verified' || project.status === 'expert_audited';

  const getOriginTag = () => {
    switch (project.origin) {
      case 'ai_scan':
        return <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-900/50 dark:bg-purple-950/20 flex items-center gap-1"><Bot size={12}/> AI Discovered</Badge>;
      case 'community':
        return <Badge variant="outline" className="text-sky-600 border-sky-200 bg-sky-50 hover:bg-sky-50 dark:text-sky-400 dark:border-sky-900/50 dark:bg-sky-950/20 flex items-center gap-1"><Users size={12}/> Community Added</Badge>;
      case 'government':
        return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-900/50 dark:bg-orange-950/20 flex items-center gap-1"><Building size={12}/> Government</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="pb-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between pt-6">
        <Button 
          variant="outline"
          onClick={() => router.back()}
          className="rounded-full shadow-sm"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Feed
        </Button>
      </div>

      {/* Hero Section */}
      <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden mb-6">
        <div className="p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {project.status === 'pending' && <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1"><AlertTriangle size={12}/> Pending Consensus</Badge>}
            {project.status === 'community_verified' && <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">Awaiting Audit</Badge>}
            {project.status === 'expert_audited' && <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center gap-1"><CheckCircle size={12}/> Expert Audited</Badge>}
            {getOriginTag()}
            <Badge variant="secondary" className="flex items-center gap-1"><MapPin size={12}/>{project.location.state_or_region}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold dark:font-medium text-card-foreground leading-tight tracking-tight">{project.project_name}</h1>
          
          <div className="flex items-center gap-6 mt-6">
            <p className="text-muted-foreground flex items-center gap-2 font-medium">
              <MapPin size={16}/> {project.location.specific_address}
            </p>
          </div>
        </div>

        {/* Media Evidence */}
        {project.evidences && project.evidences.length > 0 ? (
          <div className="mt-6 border-t border-border pt-6 px-8 pb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-card-foreground flex items-center gap-2">
                <Camera className="text-primary" /> Evidence Gallery
              </h3>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Camera size={14} className="mr-2" /> Add Evidence
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.evidences.map((evidence) => (
                <div key={evidence.id} className="bg-muted/30 rounded-2xl border border-border p-3">
                  <div 
                    className="w-full h-48 relative rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedImage(evidence.mediaUrl)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={evidence.mediaUrl} alt="Evidence" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[10px] font-mono flex flex-col items-end gap-0.5 pointer-events-none">
                      <span>LAT: {project.location.lat.toFixed(5)}</span>
                      <span>LNG: {project.location.lng.toFixed(5)}</span>
                      <span className="text-green-400 flex items-center gap-1"><CheckCircle size={10} /> EXIF Verified</span>
                    </div>
                  </div>
                  <div className="pt-4 px-1 pb-1">
                    <p className="text-sm text-foreground mb-4 font-medium">{evidence.notes}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                      <span className="flex items-center gap-1.5"><Users size={12}/> {evidence.submittedBy}</span>
                      <span>{new Date(evidence.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full bg-muted/50 p-8 border-t border-border flex flex-col items-center justify-center text-center mt-6 rounded-b-3xl">
            <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
              <Camera size={28} />
            </div>
            <h3 className="text-lg font-bold text-card-foreground mb-2">Awaiting Community Evidence</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              This project needs photographic evidence. If you are near the site, capture a geo-tagged photo to earn community reputation.
            </p>
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md flex items-center gap-2"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <MapPin size={16} /> Verify Location & Capture Evidence
            </Button>
          </div>
        )}
      </div>

      <EvidenceUploadModal 
        project={project} 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />

      {/* Fullscreen Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl bg-transparent border-none shadow-none p-0 flex justify-center items-center">
          {selectedImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selectedImage} alt="Evidence Fullscreen" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
          )}
        </DialogContent>
      </Dialog>

      {/* AI Parsed Budget Data (Discrepancy Bar) */}
      <div className="bg-card rounded-3xl shadow-sm border border-border p-8 mb-6">
        <h3 className="text-xl font-bold text-card-foreground mb-6 flex items-center gap-2">
          <FileText className="text-primary"/> AI Budget Analysis
        </h3>
        <DiscrepancyBar 
          claimedBudget={project.financials.total_budget_claimed_local_currency} 
          verifiedValue={project.financials.expert_verified_value}
        />
        
        {project.deliverables.length > 0 && (
          <div className="mt-6 border-t border-border pt-6">
             <h4 className="font-semibold text-muted-foreground mb-4 text-sm uppercase tracking-wider">Required Deliverables</h4>
             <ul className="space-y-3">
               {project.deliverables.map((item, idx) => (
                 <li key={idx} className="flex items-start gap-3 text-foreground text-sm font-medium">
                   <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18}/>
                   <span>{item}</span>
                 </li>
               ))}
             </ul>
          </div>
        )}
      </div>

      {/* Sources Section */}
      {project.sources && project.sources.length > 0 && (
        <div className="bg-card rounded-3xl shadow-sm border border-border p-8 mb-6">
          <h3 className="text-xl font-bold text-card-foreground mb-6 flex items-center gap-2">
            <LinkIcon className="text-primary"/> Attached Sources
          </h3>
          <ul className="space-y-3">
            {project.sources.map((source, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-primary hover:text-primary/80">
                <a href={source} target="_blank" rel="noopener noreferrer" className="break-all underline decoration-primary/30 underline-offset-4">
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 3-Tier Validation Timeline */}
      <div className="bg-card rounded-3xl shadow-sm border border-border p-8">
        <h3 className="text-xl font-bold text-card-foreground mb-8">Verification Trail</h3>
        
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex gap-4 relative">
            <div className="absolute left-4 top-8 bottom-[-32px] w-0.5 -ml-[1px] bg-green-500" />
            <div className="relative z-10 flex shrink-0 items-center justify-center w-8 h-8 rounded-full border-2 border-green-500 bg-background text-green-500">
              <Check size={14} strokeWidth={3} />
            </div>
            <div>
              <p className="font-bold text-card-foreground">Citizen Upload</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Media & EXIF data anchored</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 relative">
            <div className={`absolute left-4 top-8 bottom-[-32px] w-0.5 -ml-[1px] ${project.status === 'expert_audited' ? 'bg-green-500' : 'bg-border'}`} />
            <div className={`relative z-10 flex shrink-0 items-center justify-center w-8 h-8 rounded-full border-2 ${
              isVerified ? 'border-green-500 bg-background text-green-500' : 'border-primary bg-background text-primary'
            }`}>
              {isVerified ? <Check size={14} strokeWidth={3} /> : <span className="w-2 h-2 rounded-full bg-primary"></span>}
            </div>
            <div>
              <p className="font-bold text-card-foreground">Community Consensus</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {project.upvotes} Upvotes / {project.downvotes} Downvotes
              </p>
              {!isVerified && <p className="text-xs text-primary mt-2 animate-pulse font-bold">Gathering votes...</p>}
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 relative">
            <div className={`relative z-10 flex shrink-0 items-center justify-center w-8 h-8 rounded-full border-2 ${
              project.status === 'expert_audited' ? 'border-green-500 bg-background text-green-500' : isVerified ? 'border-primary bg-background text-primary' : 'border-border bg-background text-muted-foreground'
            }`}>
               {project.status === 'expert_audited' ? <Check size={14} strokeWidth={3} /> : project.status === 'community_verified' ? <AlertTriangle size={14} /> : <span className="w-2 h-2 rounded-full bg-border"></span>}
            </div>
            <div>
              <p className={`font-bold ${project.status === 'expert_audited' ? 'text-card-foreground' : 'text-muted-foreground'}`}>Oracle Audit</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {project.status === 'expert_audited' ? 'Expert cryptographic signature verified' : 'Awaiting expert assignment'}
              </p>
              {project.status === 'expert_audited' && project.financials.expert_auditor_wallet && (
                <div className="mt-3 p-3 bg-muted/40 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2 text-xs font-mono text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Signed by: {project.financials.expert_auditor_wallet.substring(0, 6)}...{project.financials.expert_auditor_wallet.substring(36)}
                  </div>
                  {project.financials.expert_auditor_note && (
                    <p className="text-sm text-foreground italic border-l-2 border-primary pl-2">
                      &quot;{project.financials.expert_auditor_note}&quot;
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
