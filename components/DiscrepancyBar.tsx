'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface DiscrepancyBarProps {
  claimedBudget: number;
  verifiedValue: number | null;
  currency?: string;
}

export default function DiscrepancyBar({ 
  claimedBudget, 
  verifiedValue, 
  currency = '₦' 
}: DiscrepancyBarProps) {
  const t = useTranslations('DiscrepancyBar');
  
  if (claimedBudget === 0) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);
  };

  const percentage = verifiedValue !== null 
    ? Math.min(100, Math.max(0, (verifiedValue / claimedBudget) * 100))
    : 0;
    
  const missingFunds = verifiedValue !== null ? claimedBudget - verifiedValue : 0;
  const isAudited = verifiedValue !== null;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">{t('claimed_budget')}</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-white">{formatCurrency(claimedBudget)}</div>
        </div>
        
        {isAudited && (
          <div className="text-right">
             <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">{t('verified_value')}</span>
             <div className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(verifiedValue)}</div>
          </div>
        )}
      </div>

      <div className="relative h-6 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
        {/* Base Bar (Claimed Budget Background) */}
        <div className="absolute inset-0 bg-red-500/10 dark:bg-red-500/20"></div>
        
        {/* Overlaid Bar (Verified Value) */}
        <motion.div 
          className="absolute top-0 left-0 bottom-0 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: isAudited ? `${percentage}%` : '0%' }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {isAudited && missingFunds > 0 && (
          <div className="absolute top-0 bottom-0 right-0 left-0 pointer-events-none flex items-center justify-end pr-3">
             <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/80 px-2 py-0.5 rounded-full z-10 opacity-90 border border-red-200 dark:border-red-900">
               {t('discrepancy')}: {formatCurrency(missingFunds)}
             </span>
          </div>
        )}
      </div>
      
      {!isAudited && (
         <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 italic flex items-center gap-1 font-medium">
           <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> 
           {t('awaiting_audit')}
         </p>
      )}
    </div>
  );
}
