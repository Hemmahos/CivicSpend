'use client';

import React, { useState } from 'react';
import { useAppStore, Project } from '@/store/useAppStore';
import { ShieldCheck, Wallet, Calculator, FileSignature } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

export default function ExpertDashboard() {
  const { projects, expertAuth, setExpertAuth, auditProject, expertWalletAddress } = useAppStore();
  const t = useTranslations('ExpertDashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [verifiedValue, setVerifiedValue] = useState<string>('');
  const [auditorNote, setAuditorNote] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const pendingAudits = projects.filter(p => p.status === 'community_verified' || p.status === 'pending');

  const handleConnectWallet = () => {
    // Mock Wagmi connection
    setTimeout(() => {
      setExpertAuth(true);
    }, 1000);
  };

  const handleOpenAudit = (record: Project) => {
    setSelectedProject(record);
    setVerifiedValue('');
    setAuditorNote('');
    setIsModalOpen(true);
  };

  const handleSignTransaction = () => {
    if (!selectedProject || !verifiedValue || !expertWalletAddress) return;
    setIsSigning(true);
    
    // Mock Blockchain transaction signing
    setTimeout(() => {
      auditProject(selectedProject.id, parseFloat(verifiedValue), auditorNote, expertWalletAddress);
      setIsSigning(false);
      setIsModalOpen(false);
    }, 2000);
  };

  if (!expertAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-card rounded-2xl border border-border p-8 shadow-sm">
        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck size={40} className="text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-card-foreground mb-2">{t('oracle_access')}</h2>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          {t('oracle_desc')}
        </p>
        <Button 
          size="lg" 
          onClick={handleConnectWallet}
          className="bg-primary hover:bg-primary/90 h-12 px-8 text-base rounded-xl flex items-center gap-2 text-white"
        >
          <Wallet size={18} />
          {t('authenticate')}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/30 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-card-foreground">{t('pending_audits')}</h2>
          <p className="text-sm text-muted-foreground">{t('review_sign')}</p>
        </div>
        <div className="px-4 py-2 bg-background rounded-lg border border-border text-sm font-mono flex items-center gap-2 shadow-sm text-card-foreground">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          0x7A2...F91E ({t('verified_engineer')})
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('project_name')}</TableHead>
            <TableHead>{t('location')}</TableHead>
            <TableHead>{t('claimed_budget')}</TableHead>
            <TableHead>{t('community_status')}</TableHead>
            <TableHead>{t('action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingAudits.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.project_name}</TableCell>
              <TableCell>{record.location.state_or_region}</TableCell>
              <TableCell>₦ {record.financials.total_budget_claimed_local_currency.toLocaleString()}</TableCell>
              <TableCell>
                {record.status === 'community_verified' ? (
                  <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">
                    {t('ready_for_audit')}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100">
                    {t('awaiting_consensus')}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Button 
                  size="sm"
                  disabled={record.status !== 'community_verified'}
                  onClick={() => handleOpenAudit(record)}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {t('perform_audit')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {pendingAudits.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                {t('no_pending')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={(open) => !isSigning && setIsModalOpen(open)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="text-primary"/> {t('audit_verification')}
            </DialogTitle>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-6 mt-4">
              <div className="bg-muted/50 p-4 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-1">{t('project_lbl')}</p>
                <p className="font-bold text-foreground">{selectedProject.project_name}</p>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-1">{t('claimed_gov_budget')}</p>
                  <p className="text-xl font-mono text-foreground">
                    ₦ {selectedProject.financials.total_budget_claimed_local_currency.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('enter_verified_value')}
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
                  {t('based_on_evidence')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('audit_note')}
                </label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t('explain_findings')}
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
                <FileSignature size={20}/> 
                {isSigning ? t('signing') : t('sign_report')}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
