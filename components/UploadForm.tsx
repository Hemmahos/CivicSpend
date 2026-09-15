'use client';

import React, { useState } from 'react';
import { Upload, Camera, MapPin, CheckCircle, Info, Loader2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const router = useRouter();
  const { uploadStatus, setUploadStatus, addProject } = useAppStore();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSimulatedUpload = () => {
    setUploadStatus('uploading');
    setStep(1);

    // Simulate upload delay
    setTimeout(() => {
      setUploadStatus('parsing');
      setStep(2);
      
      // Simulate AI Parsing
      setTimeout(() => {
        setUploadStatus('success');
        setStep(3);
        
        // Add mocked project
        const newProjId = 'proj_' + Math.random().toString(36).substr(2, 9);
        addProject({
          id: newProjId,
          project_name: 'Unidentified Construction', // To be updated by AI later
          location: {
            country: 'Nigeria',
            state_or_region: 'Local Region',
            specific_address: 'GPS: 6.5244° N, 3.3792° E', // Extracted EXIF
            lat: 6.5244,
            lng: 3.3792
          },
          financials: {
            total_budget_claimed_local_currency: 0,
            expert_verified_value: null
          },
          deliverables: [],
          sources: [],
          origin: 'community',
          status: 'pending',
          upvotes: 1,
          downvotes: 0,
          mediaUrl: 'https://images.unsplash.com/photo-1541888087405-d91d915ba8eb?q=80&w=600&auto=format&fit=crop',
          evidences: [
            {
              id: 'ev_' + Math.random().toString(36).substr(2, 9),
              mediaUrl: 'https://images.unsplash.com/photo-1541888087405-d91d915ba8eb?q=80&w=600&auto=format&fit=crop',
              notes: notes || 'Initial report submitted via app.',
              submittedBy: isAnonymous ? 'Anonymous' : (submitterName.trim() || 'Anonymous'),
              timestamp: new Date().toISOString()
            }
          ]
        });
        
        // Redirect after success
        setTimeout(() => {
          setUploadStatus('idle');
          router.push(`/project/${newProjId}`);
        }, 1500);

      }, 2000);
    }, 1500);
  };

  const steps = [
    { title: 'Uploading Media', description: 'Securing file with EXIF metadata' },
    { title: 'Extracting Location', description: 'Verifying GPS coordinates' },
    { title: 'AI Matching', description: 'Scanning public budget databases' },
    { title: 'Success', description: 'Report sent to consensus layer' },
  ];

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6 max-w-md w-full mx-auto">
      <h2 className="text-xl font-bold text-card-foreground mb-6 flex items-center gap-2">
        <Camera className="text-primary" /> Report Infrastructure
      </h2>

      {uploadStatus === 'idle' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-muted/50 cursor-pointer hover:bg-muted transition relative">
            <input 
              type="file" 
              accept="image/*,video/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]);
                }
              }}
            />
            {file ? (
              <div className="text-center z-10 pointer-events-none">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{file.name}</p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground z-10 pointer-events-none">
                <Upload className="w-10 h-10 mx-auto mb-3 opacity-80" />
                <p className="font-medium text-foreground">Tap to Upload Photo/Video</p>
                <p className="text-xs mt-1">Geo-tags will be extracted automatically</p>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 p-3 rounded-xl text-sm flex items-start gap-2 border border-blue-100 dark:border-blue-900/30">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <p><strong>Note:</strong> For accurate geo-location verification, please capture and upload evidence within a <strong>1 km radius</strong> of the construction site.</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-foreground">
              <MapPin size={16}/> Notes / Cross streets
            </Label>
            <Textarea 
              rows={3} 
              placeholder="E.g. The bridge construction near the main market has stopped for 3 weeks."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="space-y-4 pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="anonymous" 
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              />
              <label
                htmlFor="anonymous"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Submit Anonymously
              </label>
            </div>
            
            {!isAnonymous && (
              <div className="space-y-2">
                <Label htmlFor="submitterName">Your Name</Label>
                <Input 
                  id="submitterName" 
                  placeholder="Enter your name" 
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                />
              </div>
            )}
          </div>

          <Button 
            size="lg" 
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            disabled={!file}
            onClick={handleSimulatedUpload}
          >
            Submit Report
          </Button>
        </motion.div>
      )}

      {uploadStatus !== 'idle' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-8 px-4">
          <div className="space-y-6">
            {steps.map((s, index) => {
              const isCompleted = step > index;
              const isCurrent = step === index;
              const isPending = step < index;
              
              return (
                <div key={index} className="flex gap-4 relative">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={`absolute left-4 top-8 bottom-[-24px] w-0.5 -ml-[1px] ${
                      isCompleted ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                  
                  {/* Icon */}
                  <div className={`relative z-10 flex shrink-0 items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : isCurrent 
                        ? 'border-primary bg-background text-primary'
                        : 'border-border bg-background text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <Check size={14} strokeWidth={3} />
                    ) : isCurrent ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <span className="text-xs font-semibold">{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="pb-4">
                    <h4 className={`text-sm font-semibold ${
                      isCurrent || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {s.title}
                    </h4>
                    <p className={`text-sm ${
                      isCurrent ? 'text-muted-foreground' : 'text-muted-foreground/70'
                    }`}>
                      {s.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
