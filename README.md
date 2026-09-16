# CivicSpend

**CivicSpend** is a decentralized, community-driven platform built to track, report, and audit public infrastructure projects in Africa (specifically targeting Nigeria). 

By connecting everyday citizens with verified engineering professionals (Oracles), CivicSpend aims to hold government spending accountable through transparency, crowdsourced evidence, and cryptographic audits.

## 🌟 Key Features

1. **AI Radar (Project Discovery)**
   - Automatically scans government databases, news sources, and procurement portals using Google's **Gemini 3.6 Flash** model to discover ongoing infrastructure projects and their claimed budgets.

2. **Frictionless Citizen Reporting**
   - Citizens can upload photographic evidence and field notes directly from the construction site. 
   - **No account required**: The platform uses secure device fingerprinting to prevent duplicate voting and spam, ensuring maximum accessibility for everyone on the ground.

3. **Community Consensus**
   - The community upvotes or downvotes the validity of the uploaded evidence. Once a project reaches a consensus threshold (e.g., 50 upvotes), it becomes "Community Verified".

4. **Expert Oracle Audits**
   - Verified professionals (e.g., Civil Engineers, Quantity Surveyors) authenticate via the Expert Dashboard. 
   - They review the community evidence and cryptographically sign a discrepancy report, securely locking the **Verified Physical Value** into a Supabase PostgreSQL database.
   - The UI automatically calculates and displays the missing funds (Discrepancy) to the public.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **AI/LLM**: Google GenAI SDK (`gemini-3.6-flash`)
- **Maps**: [Mapbox GL JS](https://www.mapbox.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)

---

## 🚀 Getting Started

Follow these instructions to run the CivicSpend platform locally.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/CivicSpend.git
cd CivicSpend/frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the `frontend` directory and add the following keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Mapbox Configuration (for Live Project Map)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token

# Google Gemini API (for AI Radar discovery)
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Setup Supabase Database

Run the provided SQL script (`schema.sql` if you exported it) in your Supabase SQL Editor to create the `projects` table and enable Row Level Security (RLS). Alternatively, the application relies on a single `projects` table containing JSONB structures for location, financials, deliverables, sources, and evidences.

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🏗 Project Structure

- `app/`: Next.js App Router pages (`/audit`, `/privacy`, `/terms`, `/how-it-works`).
- `components/`: Reusable React components (`LiveProjectMap`, `ProjectCard`, `ExpertDashboard`, etc.).
- `store/useAppStore.ts`: Zustand global state and Supabase syncing logic.
- `app/api/ai-scan/`: Next.js backend API route powering the AI Radar Gemini extraction.
- `lib/supabase.ts`: Supabase client initialization.

---

## ❤️ Crafted by

**CivicSpend** was crafted by [HemmaH_Os](https://emmanueleniabiire.com/). 
Built for accountability. Built for the people. ✌️
