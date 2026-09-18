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
import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Project } from '@/store/useAppStore';

export default function AuditPage() {
  const { projects, expertAuth, expertWalletAddress, expertProfession, auditProject } = useAppStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [verifiedValue, setVerifiedValue] = useState<string>('');
  const [auditorNote, setAuditorNote] = useState<string>('');
  const [isSigning, setIsSigning] = useState(false);
  
  const t = useTranslations('Audit');

  // We are interested in projects that have passed community consensus but need expert audit
  const pendingAudits = projects.filter(p => p.status === 'community_verified' || p.status === 'pending');

  const handleOpenAudit = (project: Project) => {
    setSelectedProject(project);
    setVerifiedValue('');
    setAuditorNote('');
    setIsAuditModalOpen(true);
  };

  const handleSignTransaction = () => {
    if (!selectedProject || !verifiedValue || !expertWalletAddress) return;
    setIsSigning(true);
    
    // In a real Web3 app, this would trigger a non-custodial wallet sign request
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: t('generating_signature'),
        success: () => {
          auditProject(selectedProject.id, parseFloat(verifiedValue), auditorNote, expertWalletAddress);
          setIsSigning(false);
          setIsAuditModalOpen(false);
          return t('signed_success');
        },
        error: () => {
          setIsSigning(false);
          return t('sign_failed');
        }
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
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t('title')}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mb-12">
          {t('subtitle')}
        </p>
        
        <Button 
          size="lg" 
          className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setIsAuthModalOpen(true)}
        >
          <Fingerprint className="mr-3 h-5 w-5" /> {t('auth_button')}
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
          <h1 className="text-3xl font-bold tracking-tight">{t('pending_audits')}</h1>
          <p className="text-muted-foreground mt-1">{t('review_desc')}</p>
        </div>
        
        <Badge variant="outline" className="px-4 py-2 flex items-center gap-2 bg-card border-border w-fit text-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="font-mono">{truncateWallet(expertWalletAddress || '')}</span>
          <span className="text-muted-foreground">|</span>
          <span className="font-medium text-primary">{t('verified')} {expertProfession}</span>
        </Badge>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        {pendingAudits.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <Shield className="w-12 h-12 mb-4 opacity-20" />
            <p>{t('no_projects')}</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>{t('table_name')}</TableHead>
                <TableHead>{t('table_location')}</TableHead>
                <TableHead>{t('table_budget')}</TableHead>
                <TableHead>{t('table_status')}</TableHead>
                <TableHead className="text-right">{t('table_action')}</TableHead>
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
                        {t('awaiting_consensus')}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                        {t('ready_for_audit')}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      onClick={() => handleOpenAudit(project)}
                      disabled={project.status !== 'community_verified'}
                    >
                      {project.status === 'community_verified' ? t('perform_audit') : t('not_ready')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={isAuditModalOpen} onOpenChange={(open) => !isSigning && setIsAuditModalOpen(open)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
               {t('audit_verification')}
            </DialogTitle>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-6 mt-4">
              <div className="bg-muted/50 p-4 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-1">{t('project_label')}</p>
                <p className="font-bold text-foreground">{selectedProject.project_name}</p>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-1">{t('claimed_budget_label')}</p>
                  <p className="text-xl font-mono text-foreground">
                    ₦ {selectedProject.financials.total_budget_claimed_local_currency.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('enter_value_label')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">₦</span>
                  <Input
                    type="number"
                    className="w-full h-12 text-lg rounded-lg pl-8"
                    placeholder="0"
                    value={verifiedValue}
                    onChange={(e) => setVerifiedValue(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t('enter_value_desc')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('note_label')}
                </label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t('note_placeholder')}
                  value={auditorNote}
                  onChange={(e) => setAuditorNote(e.target.value)}
                />
              </div>

              <Button
                size="lg"
                className="w-full h-14 rounded-xl text-lg font-medium shadow-md shadow-green-200/20 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
                disabled={!verifiedValue || isSigning}
                onClick={handleSignTransaction}
              >
                {isSigning ? t('signing') : t('sign_report')}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
