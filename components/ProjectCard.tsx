'use client';

import React from 'react';
import { Project } from '@/store/useAppStore';
import { useAppStore } from '@/store/useAppStore';
import { ThumbsUp, ThumbsDown, MapPin, CheckCircle, AlertTriangle, Link as LinkIcon, Bot, Users, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ProjectCard({ project }: { project: Project }) {
  const { voteProject } = useAppStore();

  const getStatusTag = () => {
    switch(project.status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1"><AlertTriangle size={12}/> Pending Consensus</Badge>;
      case 'community_verified':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">Awaiting Audit</Badge>;
      case 'expert_audited':
        return <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center gap-1"><CheckCircle size={12}/> Expert Audited</Badge>;
      case 'disputed':
        return <Badge variant="destructive">Disputed</Badge>;
      default:
        return null;
    }
  };

  const getOriginTag = () => {
    switch (project.origin) {
      case 'ai_scan':
        return <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-900/50 dark:bg-purple-950/20 flex items-center gap-1"><Bot size={12}/> AI Discovered</Badge>;
      case 'community':
        return <Badge variant="outline" className="text-sky-600 border-sky-200 bg-sky-50 hover:bg-sky-50 dark:text-sky-400 dark:border-sky-900/50 dark:bg-sky-950/20 flex items-center gap-1"><Users size={12}/> Community Added</Badge>;
      case 'government':
        return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-900/50 dark:bg-orange-950/20 flex items-center gap-1"><Building size={12}/> Government</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden mb-4 flex flex-col transition-colors border border-border hover:border-muted-foreground/30">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {getStatusTag()}
          {getOriginTag()}
        </div>
        <Link href={`/project/${project.id}`}>
          <h3 className="font-bold text-lg text-card-foreground hover:text-primary transition-colors line-clamp-2">
            {project.project_name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1 font-medium">
          <MapPin size={14} /> {project.location.specific_address}, {project.location.state_or_region}
        </p>
        <p className="text-xs font-medium text-muted-foreground/70 mt-2 flex items-center gap-1">
          <LinkIcon size={12} /> {project.sources?.length || 0} Source{project.sources?.length !== 1 ? 's' : ''} attached
        </p>

        <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-4 text-muted-foreground">
              <button 
                onClick={() => voteProject(project.id, 'up')}
                className="flex items-center gap-1 hover:text-primary transition"
              >
                <ThumbsUp size={18} /> <span className="font-medium text-sm">{project.upvotes}</span>
              </button>
              <button 
                onClick={() => voteProject(project.id, 'down')}
                className="flex items-center gap-1 hover:text-destructive transition"
              >
                <ThumbsDown size={18} /> <span className="font-medium text-sm">{project.downvotes}</span>
              </button>
            </div>
            
            <Link href={`/project/${project.id}`}>
              <Button variant="ghost" className="text-primary font-bold hover:text-primary/80 hover:bg-primary/10">View Details</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
