'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MapPin, Users, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function PetitionsPage() {
  const t = useTranslations('Petitions');
  const { projects, devicePetitions, signPetition } = useAppStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const availableProjects = projects.filter(p => !p.id.startsWith('ai_mock_') && p.project_name !== 'HIDDEN');

  const selectedProject = availableProjects.find(p => p.id === selectedProjectId);
  const hasSigned = selectedProjectId ? !!devicePetitions[selectedProjectId] : false;
  const userStance = selectedProjectId ? devicePetitions[selectedProjectId] : null;
  const signaturesFor = selectedProject?.petitionFor || 0;
  const signaturesAgainst = selectedProject?.petitionAgainst || 0;

  const handleSign = (stance: 'for' | 'against') => {
    if (selectedProjectId && !hasSigned) {
      signPetition(selectedProjectId, stance);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {/* IN FAVOUR CARD */}
                <div className="flex flex-col items-center justify-center p-6 bg-green-50/50 dark:bg-green-950/10 border border-green-200 dark:border-green-900/50 rounded-2xl">
                  <div className="text-sm font-medium text-green-700 dark:text-green-400 uppercase tracking-wider mb-2">
                    In Favour
                  </div>
                  <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-6 flex items-center gap-2">
                    <ThumbsUp size={24} />
                    {t('in_favour_count', { count: signaturesFor })}
                  </div>
                  <Button 
                    size="lg" 
                    className={`w-full rounded-full font-bold ${
                      userStance === 'for' 
                        ? 'bg-green-700 text-white hover:bg-green-700' 
                        : hasSigned 
                          ? 'bg-muted text-muted-foreground' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    disabled={hasSigned}
                    onClick={() => handleSign('for')}
                  >
                    {userStance === 'for' ? (
                      <><CheckCircle className="mr-2" size={18} /> {t('signed_in_favour')}</>
                    ) : (
                      <><ThumbsUp className="mr-2" size={18} /> {t('sign_in_favour')}</>
                    )}
                  </Button>
                </div>

                {/* AGAINST CARD */}
                <div className="flex flex-col items-center justify-center p-6 bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/50 rounded-2xl">
                  <div className="text-sm font-medium text-red-700 dark:text-red-400 uppercase tracking-wider mb-2">
                    Against
                  </div>
                  <div className="text-3xl font-bold text-red-700 dark:text-red-400 mb-6 flex items-center gap-2">
                    <ThumbsDown size={24} />
                    {t('against_count', { count: signaturesAgainst })}
                  </div>
                  <Button 
                    size="lg" 
                    className={`w-full rounded-full font-bold ${
                      userStance === 'against' 
                        ? 'bg-red-700 text-white hover:bg-red-700' 
                        : hasSigned 
                          ? 'bg-muted text-muted-foreground' 
                          : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    disabled={hasSigned}
                    onClick={() => handleSign('against')}
                  >
                    {userStance === 'against' ? (
                      <><CheckCircle className="mr-2" size={18} /> {t('signed_against')}</>
                    ) : (
                      <><ThumbsDown className="mr-2" size={18} /> {t('sign_against')}</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
