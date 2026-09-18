'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import ProjectCard from '@/components/ProjectCard';
import LiveProjectMap from '@/components/LiveProjectMap';
import AddProjectModal from '@/components/AddProjectModal';
import AIDiscoveryAgent from '@/components/AIDiscoveryAgent';
import { PlusCircle, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function Home() {
  const { projects, fetchProjects } = useAppStore();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(4);
  const t = useTranslations('Hero');

  React.useEffect(() => {
    // Load data from Supabase
    fetchProjects();

    // Check if daily scan has run today
    const runDailyScan = async () => {
      const today = new Date().toDateString();
      const lastScan = localStorage.getItem('lastAutoScanDate');

      if (lastScan !== today) {
        try {
          // Fetch user's country for localized scanning
          let userCountry = 'Nigeria'; // default fallback
          try {
            const ipRes = await fetch('https://ipapi.co/json/');
            if (ipRes.ok) {
              const ipData = await ipRes.json();
              if (ipData.country_name) {
                userCountry = ipData.country_name;
              }
            }
          } catch (e) {
            console.error("Could not fetch user country:", e);
          }

          const existingProjects = useAppStore.getState().projects.map(p => p.project_name);
          const res = await fetch('/api/ai-scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ existingProjects, country: userCountry })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.projects && data.projects.length > 0) {
              // Add only projects that aren't already in the store (addProjects handles this)
              useAppStore.getState().addProjects(data.projects);
              toast.success(`AI Discovery System found ${data.projects.length} new government projects today!`);
            }
            // Only set the flag if the API call was successful
            localStorage.setItem('lastAutoScanDate', today);
          } else {
            console.error("AI API returned an error:", await res.text());
          }
        } catch (error) {
          console.error("AI Auto Scan Failed:", error);
        }
      }
    };
    
    runDailyScan();
  }, []);

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <div 
        className="relative flex flex-col items-center justify-center text-center pb-32 md:pb-40 w-[100vw] left-[calc(-50vw+50%)] min-h-[90vh]"
        style={{ backgroundImage: 'url(/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Noise Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.35] mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>
        {/* Very subtle gradient just to ensure the white text pops, without darkening the whole image */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30 pointer-events-none"></div>

        <div className="relative z-10 px-4 max-w-4xl mx-auto -mt-16">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-2xl [text-shadow:_0_4px_20px_rgba(0,0,0,0.6)]">
            {t('title')}
          </h1>
          <p className="mt-8 text-lg md:text-xl text-white max-w-2xl mx-auto font-semibold drop-shadow-xl [text-shadow:_0_2px_10px_rgba(0,0,0,0.8)]">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="p-4 md:p-8 pt-0 max-w-7xl mx-auto w-full relative z-20 -mt-24 md:-mt-40">
        <div className="mb-10 shadow-2xl rounded-3xl">
          <LiveProjectMap />
        </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 mt-4 px-2">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold dark:font-medium tracking-tight text-foreground">Community Feed</h2>
          <span className="bg-green-100 text-green-800 dark:bg-muted dark:text-foreground text-xs font-medium px-3 py-1 rounded-full">
            {projects.length} Active
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 bg-[#40AFD6]/10 hover:bg-[#40AFD6]/20 text-[#40AFD6] dark:bg-[#40AFD6]/10 dark:hover:bg-[#40AFD6]/20 dark:text-[#40AFD6] px-4 py-2 dark:px-5 dark:py-2 rounded-xl dark:rounded-full text-sm font-medium transition border border-[#40AFD6]/30 dark:border-[#40AFD6]/30"
          >
            <Bot size={18} /> <span>AI Radar</span>
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-primary dark:hover:bg-primary/80 dark:text-primary-foreground px-4 py-2 dark:px-5 dark:py-2 rounded-xl dark:rounded-full text-sm font-medium transition"
          >
            <PlusCircle size={18} /> <span>Add Project</span>
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card/50 rounded-2xl border border-border border-dashed mb-10">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <Bot className="text-muted-foreground w-10 h-10 opacity-50" />
          </div>
          <h3 className="text-xl font-bold mb-2">No projects active in your feed</h3>
          <p className="text-muted-foreground max-w-md mb-8">
            There are currently no civic infrastructure projects tracked. Be the first to report a project manually, or use the AI Radar to automatically discover projects from government sources!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#40AFD6]/10 hover:bg-[#40AFD6]/20 text-[#40AFD6] dark:bg-[#40AFD6]/10 dark:hover:bg-[#40AFD6]/20 dark:text-[#40AFD6] px-6 py-3 rounded-full text-sm font-medium transition border border-[#40AFD6]/30 dark:border-[#40AFD6]/30"
            >
              <Bot size={18} /> <span>Scan with AI Radar</span>
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full text-sm font-medium transition"
            >
              <PlusCircle size={18} /> <span>Add Project Manually</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.slice(0, visibleCount).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {(projects.length > visibleCount || visibleCount > 4) && (
        <div className="flex justify-center mt-10 gap-4">
          {visibleCount > 4 && (
            <button
              onClick={() => setVisibleCount(4)}
              className="px-6 py-3 bg-card hover:bg-muted text-foreground font-medium rounded-full transition-colors flex items-center gap-2 border border-border"
            >
              Show less
            </button>
          )}
          {projects.length > visibleCount && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium rounded-full transition-colors flex items-center gap-2 border border-border"
            >
              Load more projects
            </button>
          )}
        </div>
      )}

      <AddProjectModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <AIDiscoveryAgent 
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
      </div>
    </div>
  );
}
