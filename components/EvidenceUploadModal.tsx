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
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('EvidenceUpload');
  const [isVerifying, setIsVerifying] = useState(false);
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
        video: { 
          facingMode: 'environment',
          aspectRatio: { ideal: 1 }
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(t('camera_error'));
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
      
      // Calculate crop dimensions for 1:1 aspect ratio
      const videoSize = Math.min(video.videoWidth, video.videoHeight) || 640;
      
      // Maximum dimension for the saved image to save bandwidth (max 800px)
      const MAX_DIMENSION = 800;
      const targetSize = Math.min(videoSize, MAX_DIMENSION);
      
      canvas.width = targetSize;
      canvas.height = targetSize;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const sx = video.videoWidth > video.videoHeight ? (video.videoWidth - video.videoHeight) / 2 : 0;
        const sy = video.videoHeight > video.videoWidth ? (video.videoHeight - video.videoWidth) / 2 : 0;
        
        ctx.drawImage(video, sx, sy, videoSize, videoSize, 0, 0, targetSize, targetSize);
        // Heavily compress to 0.6 quality for low bandwidth mode
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
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
      toast.error(t('capture_first'));
      return;
    }

    setIsVerifying(true);

    const performUpload = (userLat: number, userLng: number) => {
      const distance = calculateDistance(userLat, userLng, project.location.lat, project.location.lng);
      
      // Upload allowed from anywhere as per new relaxed rules
      setTimeout(() => {
        const evidenceId = 'ev_' + Math.random().toString(36).substr(2, 9);
        addEvidence(project.id, {
          id: evidenceId,
          mediaUrl: capturedImage,
          notes: notes || t('no_notes'),
          submittedBy: isAnonymous ? t('anonymous') : (submitterName.trim() || t('anonymous')),
          timestamp: new Date().toISOString()
        });
        toast.success(t('success_toast', { distance: distance.toFixed(1) }));
        setIsVerifying(false);
        handleClose();
      }, 1000);
    };

    if (!navigator.geolocation) {
      toast.error(t('geo_unsupported'));
      setIsVerifying(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        performUpload(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        // Intentionally suppressing console log to prevent Next.js dev overlay popups
        toast.error(t('gps_error'));
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
            <Camera size={20}/> {t('title')}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-col items-center">
          {/* Camera Viewfinder */}
          <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden mb-6 flex flex-col items-center justify-center border-2 border-border">
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
                <RefreshCw size={16} /> {t('retake_photo')}
              </Button>
            )}
          </div>

          <div className="w-full mb-6 space-y-4">
            <div className="space-y-2">
              <Label>{t('notes_label')}</Label>
              <Textarea 
                placeholder={t('notes_placeholder')}
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
                  {t('submit_anon')}
                </Label>
              </div>
              
              {!isAnonymous && (
                <div className="space-y-2">
                  <Label>{t('your_name')}</Label>
                  <Input 
                    placeholder={t('enter_name')} 
                    value={submitterName}
                    onChange={(e) => setSubmitterName(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border w-full">
            <Button variant="outline" onClick={handleClose} disabled={isVerifying}>{t('cancel')}</Button>
            <Button 
              onClick={handleUpload}
              disabled={!capturedImage || isVerifying}
              className="flex items-center gap-2"
            >
              <MapPin size={16} /> {isVerifying ? t('verifying') : t('verify_submit')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
