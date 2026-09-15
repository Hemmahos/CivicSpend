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
  const { projects } = useAppStore();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);

  React.useEffect(() => {
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
      <div className="mb-8">
        <LiveProjectMap />
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 mt-4 px-2">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold dark:font-medium tracking-tight text-foreground">Community Feed</h2>
          <span className="bg-blue-100 text-blue-800 dark:bg-muted dark:text-foreground text-xs font-medium px-3 py-1 rounded-full">
            {projects.length} Active
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-card dark:hover:bg-muted dark:text-foreground px-4 py-2 dark:px-5 dark:py-2 rounded-xl dark:rounded-full text-sm font-medium transition border border-indigo-200 dark:border-border"
          >
            <Bot size={18} /> <span>AI Radar</span>
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-blue-300 dark:hover:bg-blue-200 dark:text-zinc-900 px-4 py-2 dark:px-5 dark:py-2 rounded-xl dark:rounded-full text-sm font-medium transition"
          >
            <PlusCircle size={18} /> <span>Add Project</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

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
