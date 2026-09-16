'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Camera, AlertCircle, RefreshCw, VideoOff } from 'lucide-react';
import { useAppStore, Project } from '@/store/useAppStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EvidenceUploadModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

// Haversine formula to calculate distance in km between two lat/lng coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;  
  const dLon = (lon2 - lon1) * Math.PI / 180; 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
};

export default function EvidenceUploadModal({ project, isOpen, onClose }: EvidenceUploadModalProps) {
  const { addEvidence } = useAppStore();
  const [isVerifying, setIsVerifying] = useState(false);
  const [mockLocation, setMockLocation] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Could not access camera. Please ensure permissions are granted.");
    }
  };

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setNotes('');
    setSubmitterName('');
    setIsAnonymous(false);
    onClose();
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleUpload = async () => {
    if (!capturedImage) {
      toast.error("Please capture a photo first.");
      return;
    }

    setIsVerifying(true);

    const performUpload = (userLat: number, userLng: number) => {
      const distance = calculateDistance(userLat, userLng, project.location.lat, project.location.lng);
      
      if (distance <= 1) { // 1 km radius
        // Success
        setTimeout(() => {
          const evidenceId = 'ev_' + Math.random().toString(36).substr(2, 9);
          addEvidence(project.id, {
            id: evidenceId,
            mediaUrl: capturedImage,
            notes: notes || 'No additional notes provided.',
            submittedBy: isAnonymous ? 'Anonymous' : (submitterName.trim() || 'Anonymous'),
            timestamp: new Date().toISOString()
          });
          toast.success(`Location verified (${(distance*1000).toFixed(0)}m away). Evidence securely attached!`);
          setIsVerifying(false);
          handleClose();
        }, 1000);
      } else {
        // Failed
        toast.error(`Verification Failed: You are ${distance.toFixed(1)}km away. You must be within 1km of the project site.`);
        setIsVerifying(false);
      }
    };

    if (mockLocation) {
      // Simulate being exactly at the project coordinates
      toast.info('Dev Mode: Mocking location to exact project coordinates...');
      setTimeout(() => {
        performUpload(project.location.lat, project.location.lng);
      }, 800);
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsVerifying(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        performUpload(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        // Intentionally suppressing console log to prevent Next.js dev overlay popups
        toast.error("Failed to acquire GPS coordinates. Please allow location access.");
        setIsVerifying(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-primary">
            <Camera size={20}/> On-Site Evidence Capture
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-col items-center">
          <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-xl mb-6 flex items-start gap-3 border border-green-100 dark:border-green-800 w-full">
            <AlertCircle size={24} className="shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong>Geo-Fence Active:</strong> You must be physically located within 
              <span className="font-bold"> 1 kilometer </span> 
              of the project coordinates (<span className="font-mono text-xs">{project.location.lat.toFixed(4)}, {project.location.lng.toFixed(4)}</span>) to capture evidence.
            </p>
          </div>

          {/* Camera Viewfinder */}
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-6 flex flex-col items-center justify-center border-2 border-border">
            {!capturedImage ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className="w-full h-full object-cover"
                />
                {cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 bg-black/80 p-4 text-center">
                    <VideoOff size={32} className="mb-2" />
                    <p>{cameraError}</p>
                  </div>
                )}
              </>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={capturedImage} alt="Captured preview" className="w-full h-full object-cover" />
            )}
            
            {/* Hidden canvas for capturing the frame */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Camera Controls */}
          <div className="flex w-full justify-center gap-4 mb-6">
            {!capturedImage ? (
              <Button 
                variant="outline"
                size="icon"
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700"
                onClick={capturePhoto}
                disabled={!!cameraError}
              >
                <div className="w-10 h-10 rounded-full border-2 border-black dark:border-white bg-transparent"></div>
              </Button>
            ) : (
              <Button 
                size="lg"
                variant="secondary"
                onClick={retakePhoto}
                className="rounded-full shadow-sm flex items-center gap-2"
              >
                <RefreshCw size={16} /> Retake Photo
              </Button>
            )}
          </div>

          <div className="w-full mb-6 space-y-4">
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea 
                placeholder="Any additional details about what you captured?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            <div className="pt-2 border-t border-border space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="modal-anonymous" 
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <Label htmlFor="modal-anonymous" className="font-normal cursor-pointer">
                  Submit Anonymously
                </Label>
              </div>
              
              {!isAnonymous && (
                <div className="space-y-2">
                  <Label>Your Name</Label>
                  <Input 
                    placeholder="Enter your name" 
                    value={submitterName}
                    onChange={(e) => setSubmitterName(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="w-full mb-6 text-left flex items-center gap-2">
            <Checkbox 
              id="mock-location"
              checked={mockLocation} 
              onCheckedChange={(checked) => setMockLocation(checked as boolean)}
            />
            <Label htmlFor="mock-location" className="text-muted-foreground text-sm font-normal cursor-pointer">
              Dev Mode: Mock GPS to project site (Bypass physical requirement for testing)
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border w-full">
            <Button variant="outline" onClick={handleClose} disabled={isVerifying}>Cancel</Button>
            <Button 
              onClick={handleUpload}
              disabled={!capturedImage || isVerifying}
              className="flex items-center gap-2"
            >
              <MapPin size={16} /> {isVerifying ? 'Verifying...' : 'Verify Location & Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
