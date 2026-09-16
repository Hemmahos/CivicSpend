'use client';

import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { useAppStore } from '@/store/useAppStore';
import { Camera, CheckCircle, Loader2, UploadCloud } from 'lucide-react';

interface ExpertAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExpertAuthModal({ isOpen, onClose }: ExpertAuthModalProps) {
  const [step, setStep] = useState<'form' | 'upload' | 'processing'>('form');
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idImage, setIdImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setExpertIdentity } = useAppStore();

  const handleNext = () => {
    if (!name || !profession || !idNumber) {
      toast.error('Please fill out all fields.');
      return;
    }
    setStep('upload');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!idImage) {
      toast.error('Please upload an ID image.');
      return;
    }
    
    setStep('processing');
    
    try {
      const response = await fetch('/api/verify-expert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          profession,
          idNumber,
          image: idImage
        })
      });
      
      const data = await response.json();
      
      if (data.is_match) {
        toast.success('Credentials verified successfully!');
        // Generate mock smart wallet address
        const randomHex = Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
        setExpertIdentity(`0x${randomHex}`, profession);
        handleClose();
      } else {
        toast.error('Verification failed. Information does not match ID.');
        setStep('form');
        setIdImage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error during verification. Please try again.');
      setStep('form');
    }
  };

  const handleClose = () => {
    setStep('form');
    setName('');
    setProfession('');
    setIdNumber('');
    setIdImage(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Authenticate Auditor Credentials</DialogTitle>
          <DialogDescription>
            {step === 'form' && "Enter your professional details to access the expert oracle network."}
            {step === 'upload' && "Upload a clear photo of your professional ID or license."}
            {step === 'processing' && "Verifying credentials with AI via public records..."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 'form' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  placeholder="e.g. Dr. Jane Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Profession</Label>
                <Select value={profession} onValueChange={setProfession}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Civil Engineer">Civil Engineer</SelectItem>
                    <SelectItem value="Structural Auditor">Structural Auditor</SelectItem>
                    <SelectItem value="Financial Auditor">Financial Auditor</SelectItem>
                    <SelectItem value="Urban Planner">Urban Planner</SelectItem>
                    <SelectItem value="Quantity Surveyor">Quantity Surveyor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>License / ID Number</Label>
                <Input 
                  placeholder="e.g. CE-99824" 
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 'upload' && (
            <div className="space-y-4">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {!idImage ? (
                <div 
                  className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/30 transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="text-muted-foreground mb-4" size={32} />
                  <p className="text-sm font-medium text-foreground">Click to upload ID photo</p>
                  <p className="text-xs text-muted-foreground mt-1">JPEG, PNG up to 5MB</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-border h-48 w-full bg-black/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={idImage} alt="ID Upload" className="w-full h-full object-contain" />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => setIdImage(null)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <Loader2 className="animate-spin text-primary" size={48} />
              <div className="text-center space-y-2">
                <p className="font-medium text-foreground">Analyzing Document</p>
                <p className="text-sm text-muted-foreground">Extracting identity and verifying against &apos;{profession}&apos; claims...</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex sm:justify-between items-center">
          {step === 'form' && (
            <Button className="w-full" onClick={handleNext}>Continue to ID Upload</Button>
          )}
          {step === 'upload' && (
            <div className="flex w-full gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('form')}>Back</Button>
              <Button className="flex-1" disabled={!idImage} onClick={handleSubmit}>Verify Credentials</Button>
            </div>
          )}
          {step === 'processing' && (
             <p className="text-xs text-muted-foreground text-center w-full">Creating zero-knowledge proof...</p>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
