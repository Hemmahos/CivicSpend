import { Project } from '@/store/useAppStore';

export const seedProjects: Project[] = [
  {
    id: 'renewed_hope_1',
    project_name: 'Kano-Maradi Standard Gauge Rail Line Project',
    ministry: 'Ministry of Transportation',
    completion_progress: 45,
    description: 'Construction of a standard gauge rail line connecting Kano in Nigeria to Maradi in Niger Republic, designed to boost regional trade and economic integration.',
    key_objectives: [
      'Facilitate seamless transportation of goods and passengers',
      'Boost regional trade between Nigeria and Niger',
      'Create employment opportunities during construction and operation'
    ],
    beneficiaries: 'Citizens of Kano, Katsina, and Jigawa states, and cross-border traders',
    expected_impact: 'Significant reduction in transportation costs and time, stimulating economic growth in the region.',
    location: {
      state_or_region: 'Kano/Katsina/Jigawa',
      specific_address: 'Kano to Maradi Route',
      lat: 12.0022,
      lng: 8.5920
    },
    financials: {
      total_budget_claimed_local_currency: 1500000000000, // 1.5 Trillion NGN
      expert_verified_value: null
    },
    timeline: {
      startMonth: '02',
      startYear: '2021',
      isOngoing: true
    },
    status: 'community_verified',
    deliverables: ['Rail Tracks', 'Stations', 'Maintenance Depots'],
    evidences: [],
    sources: ['https://renewedhopeprojects.lovable.app/projects'],
    origin: 'government',
    upvotes: 124,
    downvotes: 12,
    petitionSignatures: 0
  },
  {
    id: 'renewed_hope_2',
    project_name: 'Bauchi State Federal Medical Centre Upgrade and Expansion',
    ministry: 'Ministry of Health',
    completion_progress: 70,
    description: 'Comprehensive upgrade of the Federal Medical Centre in Bauchi to provide world-class healthcare facilities and services to the region.',
    key_objectives: [
      'Modernize existing medical infrastructure',
      'Install state-of-the-art diagnostic equipment',
      'Expand bed capacity by 300 beds'
    ],
    beneficiaries: 'Residents of Bauchi State and neighboring North-East states',
    expected_impact: 'Improved healthcare outcomes, reduced maternal mortality, and better emergency response capabilities.',
    location: {
      state_or_region: 'Bauchi',
      specific_address: 'Federal Medical Centre, Bauchi',
      lat: 10.3158,
      lng: 9.8442
    },
    financials: {
      total_budget_claimed_local_currency: 45000000000, // 45 Billion NGN
      expert_verified_value: null
    },
    timeline: {
      startMonth: '06',
      startYear: '2022',
      isOngoing: true
    },
    status: 'pending',
    deliverables: ['New Wards', 'Diagnostic Center', 'Intensive Care Unit'],
    evidences: [],
    sources: ['https://renewedhopeprojects.lovable.app/projects'],
    origin: 'government',
    upvotes: 89,
    downvotes: 4,
    petitionSignatures: 0
  },
  {
    id: 'renewed_hope_3',
    project_name: 'Sokoto Rima River Basin Irrigation and Water Supply (Phase 3)',
    ministry: 'Ministry of Water Resources',
    completion_progress: 25,
    description: 'Phase 3 of the Sokoto Rima River Basin project aimed at expanding irrigation farming and providing clean water supply to rural communities.',
    key_objectives: [
      'Construct new irrigation canals',
      'Provide potable water to 50 rural communities',
      'Support dry-season farming for food security'
    ],
    beneficiaries: 'Farmers and rural communities in Sokoto State',
    expected_impact: 'Increased agricultural yield, improved food security, and access to clean drinking water.',
    location: {
      state_or_region: 'Sokoto',
      specific_address: 'Sokoto Rima River Basin',
      lat: 13.0059,
      lng: 5.2476
    },
    financials: {
      total_budget_claimed_local_currency: 85000000000, // 85 Billion NGN
      expert_verified_value: null
    },
    timeline: {
      startMonth: '01',
      startYear: '2023',
      isOngoing: true
    },
    status: 'community_verified',
    deliverables: ['Irrigation Canals', 'Water Treatment Plant', 'Pumping Stations'],
    evidences: [],
    sources: ['https://renewedhopeprojects.lovable.app/projects'],
    origin: 'government',
    upvotes: 210,
    downvotes: 18,
    petitionSignatures: 0
  }
];
