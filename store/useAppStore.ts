import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  mediaUrl?: string; // fallback photo/video
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
  // Actions
  setProjects: (projects: Project[]) => void;
  setActiveProject: (id: string | null) => void;
  setUploadStatus: (status: 'idle' | 'uploading' | 'parsing' | 'success') => void;
  setExpertAuth: (status: boolean) => void;
  setExpertIdentity: (wallet: string, profession: string) => void;
  addProject: (project: Project) => void;
  addProjects: (projects: Project[]) => void;
  voteProject: (id: string, type: 'up' | 'down') => void;
  auditProject: (id: string, verifiedValue: number) => void;
  addEvidence: (id: string, evidence: Evidence) => void;
}

const initialProjects: Project[] = [
  {
    id: 'proj_1',
    project_name: 'Abuja Light Rail Refurbishment',
    location: {
      state_or_region: 'Abuja, FCT',
      specific_address: 'Central Business District Station',
      lat: 9.05785,
      lng: 7.49508
    },
    financials: {
      total_budget_claimed_local_currency: 150000000,
      expert_verified_value: null
    },
    deliverables: ['Station repainting', 'New ticketing machines', 'Platform seating'],
    status: 'pending',
    sources: ['https://bpp.gov.ng/abuja-rail-contract', 'https://punchng.com/abuja-rail-rehab'],
    origin: 'government',
    upvotes: 42,
    downvotes: 3,
    mediaUrl: 'https://images.unsplash.com/photo-1541888087405-d91d915ba8eb?q=80&w=1600&auto=format&fit=crop',
    evidences: [
      {
        id: 'ev_1',
        mediaUrl: 'https://images.unsplash.com/photo-1541888087405-d91d915ba8eb?q=80&w=1600&auto=format&fit=crop',
        notes: 'Initial construction phase reported.',
        submittedBy: 'Government Official',
        timestamp: new Date().toISOString()
      }
    ]
  },
  {
    id: 'proj_2',
    project_name: 'Lagos Water Works Expansion',
    location: {
      state_or_region: 'Lagos State',
      specific_address: 'Ikeja Water Plant',
      lat: 6.5965,
      lng: 3.3421
    },
    financials: {
      total_budget_claimed_local_currency: 450000000,
      expert_verified_value: 300000000
    },
    deliverables: ['2 new reservoirs', 'Main pipe replacement'],
    status: 'expert_audited',
    sources: ['https://lagoswater.gov.ng/projects/ikeja-expansion'],
    origin: 'government',
    upvotes: 120,
    downvotes: 5,
    mediaUrl: 'https://images.unsplash.com/photo-1590502120019-335b80eeec51?q=80&w=1600&auto=format&fit=crop',
    evidences: [
      {
        id: 'ev_2',
        mediaUrl: 'https://images.unsplash.com/photo-1590502120019-335b80eeec51?q=80&w=1600&auto=format&fit=crop',
        notes: 'Water pipe laying in progress.',
        submittedBy: 'Anonymous',
        timestamp: new Date().toISOString()
      }
    ]
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      projects: initialProjects,
      activeProjectId: null,
      uploadStatus: 'idle',
      expertAuth: false,
      expertWalletAddress: null,
      expertProfession: null,

      setProjects: (projects) => set({ projects }),
      setActiveProject: (id) => set({ activeProjectId: id }),
      setUploadStatus: (status) => set({ uploadStatus: status }),
      setExpertAuth: (status) => set({ expertAuth: status }),
      setExpertIdentity: (wallet, profession) => set({ expertWalletAddress: wallet, expertProfession: profession, expertAuth: true }),
      
      addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
      addProjects: (newProjects) => set((state) => {
        // Filter out existing projects to avoid duplicates based on project_name or id
        const existingNames = new Set(state.projects.map(p => p.project_name.toLowerCase()));
        const uniqueNewProjects = newProjects.filter(p => !existingNames.has(p.project_name.toLowerCase()));
        return { projects: [...uniqueNewProjects, ...state.projects] };
      }),
      
      voteProject: (id, type) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id === id) {
            return {
              ...p,
              upvotes: type === 'up' ? p.upvotes + 1 : p.upvotes,
              downvotes: type === 'down' ? p.downvotes + 1 : p.downvotes,
              status: (type === 'up' && p.upvotes + 1 >= 50) ? 'community_verified' : p.status
            };
          }
          return p;
        })
      })),

      auditProject: (id, verifiedValue) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id === id) {
            return {
              ...p,
              financials: { ...p.financials, expert_verified_value: verifiedValue },
              status: 'expert_audited'
            };
          }
          return p;
        })
      })),

      addEvidence: (id, evidence) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id === id) {
            return {
              ...p,
              evidences: [evidence, ...(p.evidences || [])],
              // Optionally boost upvotes or status if community provides valid geo-fenced evidence
              upvotes: p.upvotes + 10,
              status: p.status === 'pending' ? 'community_verified' : p.status
            };
          }
          return p;
        })
      }))
    }),
    {
      name: 'civic-spend-storage',
      // We only persist the projects array, not UI states like modals/uploadStatus
      partialize: (state) => ({ projects: state.projects }),
    }
  )
);
