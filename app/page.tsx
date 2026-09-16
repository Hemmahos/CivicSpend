'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import ProjectCard from '@/components/ProjectCard';
import LiveProjectMap from '@/components/LiveProjectMap';
import AddProjectModal from '@/components/AddProjectModal';
import AIDiscoveryAgent from '@/components/AIDiscoveryAgent';
import { PlusCircle, Bot } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const { projects, fetchProjects } = useAppStore();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(4);

  React.useEffect(() => {
    // Load data from Supabase
    fetchProjects();

    // Check if daily scan has run today
    const runDailyScan = async () => {
      const today = new Date().toDateString();
      const lastScan = localStorage.getItem('lastAutoScanDate');

      if (lastScan !== today) {
        try {
          const res = await fetch('/api/ai-scan');
          if (res.ok) {
            const data = await res.json();
            if (data.projects && data.projects.length > 0) {
              // Add only projects that aren't already in the store (addProjects handles this)
              useAppStore.getState().addProjects(data.projects);
              toast.success(`AI Discovery System found ${data.projects.length} new government projects today!`);
            }
          }
          localStorage.setItem('lastAutoScanDate', today);
        } catch (error) {
          console.error("AI Auto Scan Failed:", error);
        }
      }
    };
    
    runDailyScan();
  }, []);

  return (
    <div className="p-4 md:p-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-12 md:py-20 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          Know what project is ongoing<br className="hidden md:block" />
          <span className="bg-[#40AFD6] text-black px-4 py-1 mt-2 inline-block rounded-xl md:mt-3 shadow-sm transform -rotate-1">
            in your neighbourhood.
          </span>
        </h1>
        <p className="mt-8 text-lg text-muted-foreground max-w-2xl">
          Verified infrastructure data from citizens and professionals across every state, local government, and ward. Curated daily.
        </p>
      </div>

      <div className="mb-10">
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

      {projects.length > visibleCount && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium rounded-full transition-colors flex items-center gap-2 border border-border"
          >
            Load more projects
          </button>
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
  );
}
