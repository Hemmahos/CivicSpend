'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MapPin, Users, CheckCircle } from 'lucide-react';

export default function PetitionsPage() {
  const t = useTranslations('Petitions');
  const { projects, devicePetitions, signPetition } = useAppStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const availableProjects = projects.filter(p => !p.id.startsWith('ai_mock_') && p.project_name !== 'HIDDEN');

  const selectedProject = availableProjects.find(p => p.id === selectedProjectId);
  const hasSigned = selectedProjectId ? !!devicePetitions[selectedProjectId] : false;
  const signaturesCount = selectedProject?.petitionSignatures || 0;

  const handleSign = () => {
    if (selectedProjectId && !hasSigned) {
      signPetition(selectedProjectId);
      toast.success(t('sign_success'));
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 pt-8 md:pt-12">
      <div className="mb-8 text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{t('title')}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <Card className="border border-border bg-card/50 backdrop-blur-sm shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-muted/30 pb-6 border-b border-border/50">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users size={20} className="text-primary" /> {t('select_project')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          
          {availableProjects.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
              {t('no_projects')}
            </div>
          ) : (
            <div className="space-y-4">
              <Select value={selectedProjectId} onValueChange={(val) => setSelectedProjectId(val || '')}>
                <SelectTrigger className="w-full h-12 rounded-xl text-base">
                  <SelectValue placeholder={t('select_placeholder')} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {availableProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id} className="py-3">
                      {project.project_name} - {project.location.state_or_region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedProject && (
            <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">{selectedProject.project_name}</h3>
              <p className="text-muted-foreground flex items-center gap-2 text-sm mb-6">
                <MapPin size={14} /> {selectedProject.location.specific_address}, {selectedProject.location.state_or_region}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/30 rounded-xl border border-border/50">
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Signatures
                  </span>
                  <div className="text-3xl font-bold text-foreground flex items-center gap-2">
                    <Users size={24} className="text-primary" />
                    {t('signatures_count', { count: signaturesCount })}
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto rounded-full font-medium"
                  disabled={hasSigned}
                  onClick={handleSign}
                  variant={hasSigned ? "secondary" : "default"}
                >
                  {hasSigned ? (
                    <>
                      <CheckCircle className="mr-2" size={18} /> {t('signed_button')}
                    </>
                  ) : (
                    t('sign_button')
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
