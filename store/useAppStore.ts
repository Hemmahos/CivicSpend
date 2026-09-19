import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export type ProjectStatus = 'pending' | 'community_verified' | 'expert_audited' | 'disputed' | 'ai_staged';

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

export interface ProjectTimeline {
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  isOngoing?: boolean;
}

export interface Project {
  id: string;
  project_name: string;
  timeline?: ProjectTimeline;
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
  petitionFor?: number;
  petitionAgainst?: number;
  ministry?: string;
  completion_progress?: number;
  description?: string;
  key_objectives?: string[];
  beneficiaries?: string;
  expected_impact?: string;
}

export interface OfflineAction {
  id: string;
  table: string;
  action: 'insert' | 'update';
  payload: any;
  matchKey?: string;
  matchValue?: any;
}

interface AppState {
  projects: Project[];
  activeProjectId: string | null;
  uploadStatus: 'idle' | 'uploading' | 'parsing' | 'success';
  expertAuth: boolean;
  expertWalletAddress: string | null;
  expertProfession: string | null;
  expertAuthTimestamp: number | null;
  deviceVotes: Record<string, 'up' | 'down'>;
  devicePetitions: Record<string, 'for' | 'against'>;
  offlineQueue: OfflineAction[];
  // Actions
  setProjects: (projects: Project[]) => void;
  setActiveProject: (id: string | null) => void;
  setUploadStatus: (status: 'idle' | 'uploading' | 'parsing' | 'success') => void;
  setExpertAuth: (status: boolean) => void;
  setExpertIdentity: (wallet: string, profession: string) => void;
  logoutExpert: () => void;
  addProject: (project: Project) => void;
  addProjects: (projects: Project[]) => void;
  voteProject: (id: string, type: 'up' | 'down') => void;
  auditProject: (id: string, verifiedValue: number, note: string, walletId: string) => void;
  addEvidence: (id: string, evidence: Evidence) => void;
  fetchProjects: () => Promise<void>;
  addToQueue: (action: OfflineAction) => void;
  removeFromQueue: (id: string) => void;
  flushOfflineQueue: () => Promise<void>;
  addStagedProjects: (projects: Project[]) => void;
  publishStagedProject: (id: string) => Promise<void>;
  signPetition: (id: string, stance: 'for' | 'against') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,
      uploadStatus: 'idle',
      expertAuth: false,
      expertWalletAddress: null,
      expertProfession: null,
      expertAuthTimestamp: null,
      deviceVotes: {},
      devicePetitions: {},
      offlineQueue: [],

      addToQueue: (action) => set((state) => ({ offlineQueue: [...state.offlineQueue, action] })),
      removeFromQueue: (id) => set((state) => ({ offlineQueue: state.offlineQueue.filter(a => a.id !== id) })),
      flushOfflineQueue: async () => {
        const queue = useAppStore.getState().offlineQueue;
        if (queue.length === 0) return;
        
        for (const action of queue) {
          try {
            if (action.action === 'insert') {
              await supabase.from(action.table).insert(action.payload);
            } else if (action.action === 'update' && action.matchKey) {
              await supabase.from(action.table).update(action.payload).eq(action.matchKey, action.matchValue);
            }
            useAppStore.getState().removeFromQueue(action.id);
          } catch (error) {
            console.error("Failed to sync offline action:", error);
          }
        }
      },

      setProjects: (projects) => set({ projects }),
      setActiveProject: (id) => set({ activeProjectId: id }),
      setUploadStatus: (status) => set({ uploadStatus: status }),
      setExpertAuth: (status) => set({ expertAuth: status }),
      setExpertIdentity: (wallet, profession) => set({ 
        expertWalletAddress: wallet, 
        expertProfession: profession, 
        expertAuth: true,
        expertAuthTimestamp: Date.now()
      }),
      logoutExpert: () => set({
        expertAuth: false,
        expertWalletAddress: null,
        expertProfession: null,
        expertAuthTimestamp: null
      }),
      
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
        if (typeof window !== 'undefined' && !window.navigator.onLine) {
          get().addToQueue({
            id: Math.random().toString(),
            table: 'projects',
            action: 'insert',
            payload: project
          });
        } else {
          try {
            await supabase.from('projects').insert(project);
          } catch (error) {
            console.error("Error saving to Supabase:", error);
          }
        }
      },
      addProjects: async (newProjects) => {
        let uniqueNewProjects: Project[] = [];
        set((state) => {
          const existingNames = new Set(state.projects.map(p => p.project_name.toLowerCase()));
          uniqueNewProjects = newProjects.filter(p => !existingNames.has(p.project_name.toLowerCase()));
          return { projects: [...uniqueNewProjects, ...state.projects] };
        });

        if (uniqueNewProjects.length > 0) {
          if (typeof window !== 'undefined' && !window.navigator.onLine) {
            uniqueNewProjects.forEach(proj => {
              get().addToQueue({
                id: Math.random().toString(),
                table: 'projects',
                action: 'insert',
                payload: proj
              });
            });
          } else {
            try {
              await supabase.from('projects').insert(uniqueNewProjects);
            } catch (error) {
              console.error("Error saving multiple projects to Supabase:", error);
            }
          }
        }
      },
      
      addStagedProjects: (newProjects) => {
        let uniqueNewProjects: Project[] = [];
        set((state) => {
          const existingNames = new Set(state.projects.map(p => p.project_name.toLowerCase()));
          uniqueNewProjects = newProjects.filter(p => !existingNames.has(p.project_name.toLowerCase()));
          return { projects: [...uniqueNewProjects, ...state.projects] };
        });
      },

      publishStagedProject: async (id: string) => {
        set((state) => {
          const newProjects = state.projects.map(p => {
            if (p.id === id) {
              return { ...p, status: 'pending' as const };
            }
            return p;
          });
          return { projects: newProjects };
        });

        const publishedProj = get().projects.find(p => p.id === id);
        if (publishedProj) {
          if (typeof window !== 'undefined' && !window.navigator.onLine) {
            get().addToQueue({
              id: Math.random().toString(),
              table: 'projects',
              action: 'insert',
              payload: publishedProj
            });
          } else {
            try {
              await supabase.from('projects').insert(publishedProj);
            } catch (error) {
              console.error("Error saving published project to Supabase:", error);
            }
          }
        }
      },

      voteProject: (id, type) => {
        set((state) => {
          const currentVote = state.deviceVotes[id];
          
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
            return { deviceVotes: newDeviceVotes, projects: newProjects };
          }

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
          
          return { deviceVotes: { ...state.deviceVotes, [id]: type }, projects: newProjects };
        });

        // Sync with Supabase or offline queue
        const updatedProj = get().projects.find(p => p.id === id);
        if (updatedProj) {
          if (typeof window !== 'undefined' && !window.navigator.onLine) {
            get().addToQueue({
              id: Math.random().toString(),
              table: 'projects',
              action: 'update',
              payload: { upvotes: updatedProj.upvotes, downvotes: updatedProj.downvotes, status: updatedProj.status },
              matchKey: 'id',
              matchValue: id
            });
          } else {
            supabase.from('projects').update({ upvotes: updatedProj.upvotes, downvotes: updatedProj.downvotes, status: updatedProj.status }).eq('id', id).then();
          }
        }
      },

      signPetition: (id, stance) => {
        set((state) => {
          if (state.devicePetitions[id]) return state; // Already signed
          
          const newProjects = state.projects.map(p => {
            if (p.id === id) {
              return {
                ...p,
                petitionFor: stance === 'for' ? (p.petitionFor || 0) + 1 : p.petitionFor,
                petitionAgainst: stance === 'against' ? (p.petitionAgainst || 0) + 1 : p.petitionAgainst,
              };
            }
            return p;
          });
          
          return { 
            devicePetitions: { ...state.devicePetitions, [id]: stance }, 
            projects: newProjects 
          };
        });

        const updatedProj = get().projects.find(p => p.id === id);
        if (updatedProj) {
          if (typeof window !== 'undefined' && !window.navigator.onLine) {
            get().addToQueue({
              id: Math.random().toString(),
              table: 'projects',
              action: 'update',
              payload: { petitionFor: updatedProj.petitionFor, petitionAgainst: updatedProj.petitionAgainst },
              matchKey: 'id',
              matchValue: id
            });
          } else {
            supabase.from('projects').update({ petitionFor: updatedProj.petitionFor, petitionAgainst: updatedProj.petitionAgainst }).eq('id', id).then();
          }
        }
      },

      auditProject: (id, verifiedValue, note, walletId) => {
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
          return { projects: newProjects };
        });
        
        const updatedProj = get().projects.find(p => p.id === id);
        if (updatedProj) {
          if (typeof window !== 'undefined' && !window.navigator.onLine) {
            get().addToQueue({
              id: Math.random().toString(),
              table: 'projects',
              action: 'update',
              payload: { financials: updatedProj.financials, status: updatedProj.status },
              matchKey: 'id',
              matchValue: id
            });
          } else {
            supabase.from('projects').update({ financials: updatedProj.financials, status: updatedProj.status }).eq('id', id).then();
          }
        }
      },

      addEvidence: (id, evidence) => {
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
          return { projects: newProjects };
        });

        const updatedProj = get().projects.find(p => p.id === id);
        if (updatedProj) {
          if (typeof window !== 'undefined' && !window.navigator.onLine) {
            get().addToQueue({
              id: Math.random().toString(),
              table: 'projects',
              action: 'update',
              payload: { evidences: updatedProj.evidences, status: updatedProj.status },
              matchKey: 'id',
              matchValue: id
            });
          } else {
            supabase.from('projects').update({ evidences: updatedProj.evidences, status: updatedProj.status }).eq('id', id).then();
          }
        }
      }
    }),
    {
      name: 'civic-spend-storage',
      // We only persist the projects array, deviceVotes, auth, and offlineQueue
      partialize: (state) => ({ 
        projects: state.projects, 
        deviceVotes: state.deviceVotes,
        devicePetitions: state.devicePetitions,
        expertAuth: state.expertAuth,
        expertWalletAddress: state.expertWalletAddress,
        expertProfession: state.expertProfession,
        expertAuthTimestamp: state.expertAuthTimestamp,
        offlineQueue: state.offlineQueue
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.expertAuthTimestamp) {
          const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
          if (Date.now() - state.expertAuthTimestamp > thirtyDaysMs) {
            setTimeout(() => state.logoutExpert(), 0);
          }
        }
      },
    }
  )
);
