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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const { addProject } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOngoing, setIsOngoing] = useState(false);
  const t = useTranslations('AddProjectModal');
  
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
      
    // Parse timeline values
    let startMonth = '', startYear = '', endMonth = '', endYear = '';
    if (values.startPeriod) {
      const [y, m] = values.startPeriod.split('-');
      if (y && m) { startYear = y; startMonth = m; }
    }
    if (!isOngoing && values.endPeriod) {
      const [y, m] = values.endPeriod.split('-');
      if (y && m) { endYear = y; endMonth = m; }
    }

    addProject({
      id: newProjId,
      project_name: values.project_name,
      timeline: {
        startMonth,
        startYear,
        endMonth,
        endYear,
        isOngoing
      },
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
      ministry: values.ministry,
      completion_progress: parseInt(values.completion_progress) || 0,
      description: values.description,
      key_objectives: values.key_objectives ? values.key_objectives.split(',').map((o: string) => o.trim()).filter(Boolean) : [],
      beneficiaries: values.beneficiaries,
      expected_impact: values.expected_impact,
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
            <PlusCircle className="text-primary" size={20}/> {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="project_name">{t('name_label')}</Label>
            <Input 
              id="project_name" 
              name="project_name" 
              placeholder={t('name_placeholder')} 
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
              <Label className="flex items-center gap-1"><MapPin size={14} /> {t('state_label')}</Label>
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
              <Label htmlFor="address">{t('address_label')}</Label>
              <Input id="address" name="address" placeholder="E.g. Toll Gate, Lagos" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="flex items-center gap-1"><DollarSign size={14} /> {t('budget_label')}</Label>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startPeriod">{t('start_period')}</Label>
              <Input id="startPeriod" name="startPeriod" type="month" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endPeriod">{t('end_period')}</Label>
              <Input 
                id="endPeriod" 
                name="endPeriod" 
                type="month" 
                disabled={isOngoing}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="isOngoing" name="isOngoing" checked={isOngoing} onCheckedChange={(c) => setIsOngoing(c as boolean)} />
            <Label htmlFor="isOngoing">{t('is_ongoing')}</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ministry">{t('ministry_label')}</Label>
              <Input id="ministry" name="ministry" placeholder={t('ministry_placeholder')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="completion_progress">{t('progress_label')}</Label>
              <Input id="completion_progress" name="completion_progress" type="number" min="0" max="100" placeholder="0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('description_label')}</Label>
            <Textarea id="description" name="description" rows={3} placeholder={t('description_placeholder')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key_objectives">{t('objectives_label')}</Label>
            <Input id="key_objectives" name="key_objectives" placeholder={t('objectives_placeholder')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="beneficiaries">{t('beneficiaries_label')}</Label>
              <Input id="beneficiaries" name="beneficiaries" placeholder="E.g. Local residents, Commuters" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expected_impact">{t('impact_label')}</Label>
              <Input id="expected_impact" name="expected_impact" placeholder="E.g. 50% travel time reduction" />
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>{t('cancel')}</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('submitting') : t('submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
