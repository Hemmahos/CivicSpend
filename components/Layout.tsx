'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Upload, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from 'next-themes';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { expertAuth } = useAppStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: 'Feed', path: '/', icon: <Home size={24} /> },
    { name: 'Upload', path: '/upload', icon: <Upload size={24} /> },
    { name: 'Audit', path: '/expert', icon: <ShieldCheck size={24} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB] dark:bg-[#131314] text-slate-900 dark:text-[#E3E3E3] pb-16 md:pb-0 md:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#F9FAFB] dark:bg-[#131314] fixed h-full z-10 border-r border-transparent dark:border-transparent">
        <div className="p-6">
          <h1 className="text-2xl font-bold dark:font-medium tracking-tight text-blue-700 dark:text-[#E3E3E3] flex items-center gap-2">
            CivicSpend
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-[#8E8E8E] font-medium tracking-widest uppercase mt-1">Decentralized Tracker</p>
        </div>
        <nav className="flex-1 px-3 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                href={item.path} 
                key={item.name}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-full transition-all text-[14px] font-medium ${
                  isActive ? 'bg-blue-50 text-blue-700 dark:bg-[#282A2C] dark:text-[#E3E3E3]' : 'text-slate-600 hover:bg-slate-100 dark:text-[#C4C7C5] dark:hover:bg-[#1E1F20]'
                }`}
              >
                {React.cloneElement(item.icon as any, { size: 20 })}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="px-3 mb-4">
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-full transition-all text-[14px] font-medium text-slate-600 hover:bg-slate-100 dark:text-[#C4C7C5] dark:hover:bg-[#1E1F20]"
          >
            {mounted && (resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />)}
            <span>{mounted ? (resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode') : 'Theme'}</span>
          </button>
        </div>

        {expertAuth && (
          <div className="p-3 m-3 rounded-2xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 font-medium text-[13px] flex items-center gap-2 border border-green-100 dark:border-green-900/30">
            <ShieldCheck size={16} />
            Oracle Verified
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full md:pl-64 flex flex-col h-screen overflow-hidden">
        {/* Top Header for Mobile */}
        <header className="md:hidden bg-[#F9FAFB] dark:bg-[#131314] px-4 py-4 sticky top-0 z-10 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight text-blue-700 dark:text-[#E3E3E3]">CivicSpend</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="text-slate-500 dark:text-[#C4C7C5]"
            >
              {mounted && (resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />)}
            </button>
            {expertAuth && <ShieldCheck size={20} className="text-green-600 dark:text-green-500" />}
          </div>
        </header>

        {/* Studio-like central panel */}
        <div className="flex-1 overflow-y-auto w-full h-full md:p-4">
          <div className="h-full w-full max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-[#1E1F20] border-t border-slate-200 dark:border-[#282A2C] flex justify-around items-center h-16 z-20 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              href={item.path} 
              key={item.name}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-blue-700 dark:text-[#E3E3E3]' : 'text-slate-500 dark:text-[#8E8E8E]'
              }`}
            >
              {React.cloneElement(item.icon as any, { size: 20 })}
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
