'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldAlert, Fingerprint } from 'lucide-react';
import ExpertAuthModal from '@/components/ExpertAuthModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';

export default function AuditPage() {
  const { projects, expertAuth, expertWalletAddress, expertProfession, auditProject } = useAppStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // We are interested in projects that have passed community consensus but need expert audit
  const pendingAudits = projects.filter(p => p.status === 'community_verified' || p.status === 'pending');

  const handlePerformAudit = (projectId: string, budget: number) => {
    // In a real Web3 app, this would trigger a non-custodial wallet sign request
    // e.g. await privyWallet.signMessage("Approve audit for proj: " + projectId);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Generating cryptographic signature...',
        success: () => {
          auditProject(projectId, budget); // Simply verifying the exact claimed budget for this mockup
          return 'Audit cryptographically signed and submitted to the network!';
        },
        error: 'Failed to sign audit.'
      }
    );
  };

  const truncateWallet = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!expertAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-8 border border-primary/20">
          <Shield className="text-primary w-12 h-12" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Expert Oracle Access</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mb-12">
          Join the decentralized network of verified professionals. Audit public infrastructure projects using your cryptographic credentials to ensure accountability and transparency.
        </p>
        
        <Button 
          size="lg" 
          className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setIsAuthModalOpen(true)}
        >
          <Fingerprint className="mr-3 h-5 w-5" /> Authenticate Auditor Credentials
        </Button>

        <ExpertAuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </div>
    );
  }

  return (
    <div className="pb-12 pt-6 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Audits</h1>
          <p className="text-muted-foreground mt-1">Review community-verified infrastructure projects.</p>
        </div>
        
        <Badge variant="outline" className="px-4 py-2 flex items-center gap-2 bg-card border-border w-fit text-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="font-mono">{truncateWallet(expertWalletAddress || '')}</span>
          <span className="text-muted-foreground">|</span>
          <span className="font-medium text-primary">Verified {expertProfession}</span>
        </Badge>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        {pendingAudits.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <Shield className="w-12 h-12 mb-4 opacity-20" />
            <p>No projects are currently awaiting an expert audit.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Claimed Budget (NGN)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingAudits.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium max-w-[250px] truncate" title={project.project_name}>
                    {project.project_name}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate max-w-[200px]" title={project.location.specific_address}>
                    {project.location.specific_address}, {project.location.state_or_region}
                  </TableCell>
                  <TableCell className="font-mono">
                    ₦{project.financials.total_budget_claimed_local_currency.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {project.status === 'pending' ? (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-0">
                        Awaiting Consensus
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                        Ready for Audit
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      onClick={() => handlePerformAudit(project.id, project.financials.total_budget_claimed_local_currency)}
                      disabled={project.status !== 'community_verified'}
                    >
                      {project.status === 'community_verified' ? 'Perform Audit' : 'Not Ready'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
