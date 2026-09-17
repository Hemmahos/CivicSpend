'use client';

import React, { useState } from 'react';
import { Country, State } from 'country-state-city';
import { useAppStore } from '@/store/useAppStore';
import { PlusCircle, MapPin, Link as LinkIcon, DollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const { addProject } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  
  // List of African ISO country codes
  const africanCountryCodes = new Set([
    'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CD', 'CG', 'CI', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'UG', 'EH', 'ZM', 'ZW'
  ]);
  
  const countries = Country.getAllCountries().filter(c => africanCountryCodes.has(c.isoCode));
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries()) as any;
    
    const countryName = Country.getCountryByCode(selectedCountry)?.name;
    const stateName = State.getStateByCodeAndCountry(values.region, selectedCountry)?.name || values.region;
    const searchQuery = `${values.address}, ${stateName}, ${countryName}`;

    let lat = 9.0765 + (Math.random() - 0.5) * 2;
    let lng = 7.3986 + (Math.random() - 0.5) * 2;
    
    const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    try {
      if (MAPBOX_TOKEN && MAPBOX_TOKEN !== "YOUR_MAPBOX_TOKEN_HERE") {
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}`);
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          lng = data.features[0].center[0];
          lat = data.features[0].center[1];
        }
      }
    } catch (error) {
      console.error("Geocoding failed", error);
    }

    const newProjId = 'proj_' + Math.random().toString(36).substr(2, 9);
    
    const sourceList = values.sources 
      ? values.sources.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
      : [];

    addProject({
      id: newProjId,
      project_name: values.project_name,
      evidences: [],
      location: {
        country: countryName,
        state_or_region: stateName,
        specific_address: values.address,
        lat,
        lng
      },
      financials: {
        total_budget_claimed_local_currency: parseFloat(values.budget) || 0,
        expert_verified_value: null
      },
      deliverables: [],
      status: 'pending',
      sources: sourceList,
      origin: 'community',
      upvotes: 0,
      downvotes: 0,
    });

    toast.success('Project added successfully to the community ledger.');
    setIsSubmitting(false);
    setSelectedCountry('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <PlusCircle className="text-primary" size={20}/> Register Civic Project
          </DialogTitle>
          <DialogDescription>
            Manually register a government or civic project from budget documents or news sources to track its progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="project_name">Project Name</Label>
            <Input 
              id="project_name" 
              name="project_name" 
              placeholder="E.g. Lagos-Ibadan Expressway Expansion" 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1"><MapPin size={14} /> Country</Label>
              <Select 
                name="country" 
                onValueChange={(val) => setSelectedCountry(val as string)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(c => (
                    <SelectItem key={c.isoCode} value={c.isoCode}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1"><MapPin size={14} /> State / Region</Label>
              <Select 
                name="region" 
                disabled={!selectedCountry}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map(s => (
                    <SelectItem key={s.isoCode} value={s.isoCode}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">City / Address</Label>
              <Input id="address" name="address" placeholder="E.g. Toll Gate, Lagos" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="flex items-center gap-1"><DollarSign size={14} /> Claimed Budget (Local Currency)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
              <Input 
                id="budget" 
                name="budget" 
                type="number"
                placeholder="E.g. 50000000" 
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sources" className="flex items-center gap-1"><LinkIcon size={14} /> Source URLs (comma-separated)</Label>
            <Textarea 
              id="sources" 
              name="sources" 
              rows={3} 
              placeholder="https://news-source.com/article, https://budget-document.pdf" 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
