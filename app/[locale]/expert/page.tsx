import React from 'react';
import ExpertDashboard from '@/components/ExpertDashboard';

export default function ExpertPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-[#E3E3E3]">Oracle Layer</h1>
        <p className="text-slate-500 dark:text-[#8E8E8E]">Expert verification and cryptographic discrepancy signing.</p>
      </div>
      <ExpertDashboard />
    </div>
  );
}
