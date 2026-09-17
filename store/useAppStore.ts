import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export type ProjectStatus = 'pending' | 'community_verified' | 'expert_audited' | 'disputed';

export interface ProjectLocation {
  country?: string;
  state_or_region: string;
  specific_address: string; // or city
  lat: number;
  lng: number;
}

export interface Financials {
  total_budget_claimed_local_currency: number;
  expert_verified_value: number | null;
  expert_auditor_note?: string;
  expert_auditor_wallet?: string;
}

export interface Evidence {
  id: string;
  mediaUrl: string;
  notes: string;
  submittedBy: string;
  timestamp: string;
}

export interface Project {
  id: string;
  project_name: string;
  location: ProjectLocation;
  financials: Financials;
  deliverables: string[];
  status: ProjectStatus;
  mediaUrl?: string;
  evidences: Evidence[];
  sources: string[];
  origin?: 'ai_scan' | 'community' | 'government';
  upvotes: number;
  downvotes: number;
}

interface AppState {
  projects: Project[];
  activeProjectId: string | null;
  uploadStatus: 'idle' | 'uploading' | 'parsing' | 'success';
  expertAuth: boolean;
  expertWalletAddress: string | null;
  expertProfession: string | null;
  deviceVotes: Record<string, 'up' | 'down'>;
  // Actions
  setProjects: (projects: Project[]) => void;
  setActiveProject: (id: string | null) => void;
  setUploadStatus: (status: 'idle' | 'uploading' | 'parsing' | 'success') => void;
  setExpertAuth: (status: boolean) => void;
  setExpertIdentity: (wallet: string, profession: string) => void;
  addProject: (project: Project) => void;
  addProjects: (projects: Project[]) => void;
  voteProject: (id: string, type: 'up' | 'down') => void;
  auditProject: (id: string, verifiedValue: number, note: string, walletId: string) => void;
  addEvidence: (id: string, evidence: Evidence) => void;
  fetchProjects: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      projects: [],
      activeProjectId: null,
      uploadStatus: 'idle',
      expertAuth: false,
      expertWalletAddress: null,
      expertProfession: null,
      deviceVotes: {},

      setProjects: (projects) => set({ projects }),
      setActiveProject: (id) => set({ activeProjectId: id }),
      setUploadStatus: (status) => set({ uploadStatus: status }),
      setExpertAuth: (status) => set({ expertAuth: status }),
      setExpertIdentity: (wallet, profession) => set({ expertWalletAddress: wallet, expertProfession: profession, expertAuth: true }),
      
      fetchProjects: async () => {
        try {
          const { data, error } = await supabase.from('projects').select('*');
          if (error) throw error;
          if (data) {
            const validProjects = (data as Project[]).filter(p => !p.id.startsWith('ai_mock_') && p.project_name !== 'HIDDEN');
            set({ projects: validProjects });
          }
        } catch (error) {
          console.error("Error fetching projects from Supabase:", error);
        }
      },

      addProject: async (project) => {
        set((state) => ({ projects: [project, ...state.projects] }));
        try {
          await supabase.from('projects').insert(project);
        } catch (error) {
          console.error("Error saving to Supabase:", error);
        }
      },
      addProjects: async (newProjects) => {
        let uniqueNewProjects: Project[] = [];
        set((state) => {
          // Filter out existing projects to avoid duplicates based on project_name or id
          const existingNames = new Set(state.projects.map(p => p.project_name.toLowerCase()));
          uniqueNewProjects = newProjects.filter(p => !existingNames.has(p.project_name.toLowerCase()));
          return { projects: [...uniqueNewProjects, ...state.projects] };
        });

        if (uniqueNewProjects.length > 0) {
          try {
            await supabase.from('projects').insert(uniqueNewProjects);
          } catch (error) {
            console.error("Error saving multiple projects to Supabase:", error);
          }
        }
      },
      
      voteProject: (id, type) => set((state) => {
        const currentVote = state.deviceVotes[id];
        
        // If clicking the same vote again, toggle it off
        if (currentVote === type) {
          const newDeviceVotes = { ...state.deviceVotes };
          delete newDeviceVotes[id];
          
          const newProjects = state.projects.map(p => {
            if (p.id === id) {
              return {
                ...p,
                upvotes: type === 'up' ? Math.max(0, p.upvotes - 1) : p.upvotes,
                downvotes: type === 'down' ? Math.max(0, p.downvotes - 1) : p.downvotes,
              };
            }
            return p;
          });
            
          // Sync with Supabase (fire and forget)
          const updatedProj = newProjects.find(p => p.id === id);
          if (updatedProj) {
            supabase.from('projects').update({ upvotes: updatedProj.upvotes, downvotes: updatedProj.downvotes }).eq('id', id).then();
          }
          
          return {
            deviceVotes: newDeviceVotes,
            projects: newProjects
          };
        }

        // Otherwise, setting a new vote or switching vote
        const newProjects = state.projects.map(p => {
          if (p.id === id) {
            let newUpvotes = p.upvotes;
            let newDownvotes = p.downvotes;
            
            if (currentVote === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
            if (currentVote === 'down') newDownvotes = Math.max(0, newDownvotes - 1);
            
            if (type === 'up') newUpvotes += 1;
            if (type === 'down') newDownvotes += 1;
            
            return {
              ...p,
              upvotes: newUpvotes,
              downvotes: newDownvotes,
              status: (type === 'up' && newUpvotes >= 50) ? 'community_verified' : p.status
            };
          }
          return p;
        });
        
        // Sync with Supabase (fire and forget)
        const updatedProj = newProjects.find(p => p.id === id);
        if (updatedProj) {
          supabase.from('projects').update({ upvotes: updatedProj.upvotes, downvotes: updatedProj.downvotes, status: updatedProj.status }).eq('id', id).then();
        }

        return {
          deviceVotes: { ...state.deviceVotes, [id]: type },
          projects: newProjects
        };
      }),

      auditProject: (id, verifiedValue, note, walletId) => {
        let updatedProj: Project | undefined;
        set((state) => {
          const newProjects = state.projects.map(p => {
            if (p.id === id) {
              return {
                ...p,
                financials: { 
                  ...p.financials, 
                  expert_verified_value: verifiedValue,
                  expert_auditor_note: note,
                  expert_auditor_wallet: walletId 
                },
                status: 'expert_audited' as any
              };
            }
            return p;
          });
          updatedProj = newProjects.find(p => p.id === id);
          return { projects: newProjects };
        });
        
        if (updatedProj) {
          supabase.from('projects')
            .update({ 
              financials: updatedProj.financials, 
              status: updatedProj.status
            })
            .eq('id', id).then();
        }
      },

      addEvidence: (id, evidence) => {
        let updatedProj: Project | undefined;
        set((state) => {
          const newProjects = state.projects.map(p => {
            if (p.id === id) {
              return {
                ...p,
                evidences: [evidence, ...(p.evidences || [])],
                status: p.status === 'pending' ? 'community_verified' : p.status
              };
            }
            return p;
          });
          updatedProj = newProjects.find(p => p.id === id);
          return { projects: newProjects };
        });

        if (updatedProj) {
          supabase.from('projects').update({ evidences: updatedProj.evidences, status: updatedProj.status }).eq('id', id).then();
        }
      }
    }),
    {
      name: 'civic-spend-storage',
      // We only persist the projects array and deviceVotes, not UI states like modals/uploadStatus
      partialize: (state) => ({ projects: state.projects, deviceVotes: state.deviceVotes }),
    }
  )
);
