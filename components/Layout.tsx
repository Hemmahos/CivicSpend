'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Sun, Moon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from 'next-themes';
import Footer from './Footer';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

import { seedProjects } from '@/lib/seedData';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { expertAuth, projects, addProjects } = useAppStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('Header');

  useEffect(() => {
    setMounted(true);
    
    // Seed initial mock projects if they don't exist
    if (projects.length > 0 && !projects.some(p => p.id === 'renewed_hope_1')) {
      addProjects(seedProjects);
    } else if (projects.length === 0) {
      addProjects(seedProjects);
    }
  }, [projects, addProjects]);

  const navItems = [
    { name: t('feed'), path: '/' },
    { name: t('petitions'), path: '/petitions' },
    { name: t('expert_audit'), path: '/audit' },
  ];

  // We check path without locale, or use logic depending on implementation
  const stripLocale = (path: string) => {
    const parts = path.split('/');
    if (parts.length > 1 && ['en', 'fr', 'pt', 'ar', 'sw', 'ha'].includes(parts[1])) {
      parts.splice(1, 1);
      return parts.join('/') || '/';
    }
    return path;
  };

  const currentPath = stripLocale(pathname);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full bg-background">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto max-w-7xl">
          
          {/* Logo - Left */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Logo size={28} />
              <span className="font-bold text-xl tracking-tight text-foreground hidden sm:inline-block">
                {t('logo')}
              </span>
            </Link>
          </div>

          {/* Navigation - Center */}
          <nav className="flex items-center gap-6 mx-auto absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path || (item.path === '/' && currentPath.startsWith('/project/'));
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions - Right */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {mounted && (resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />)}
            </button>
            
            {expertAuth ? (
              <div className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-medium text-xs flex items-center gap-1.5 border border-green-500/20">
                <ShieldCheck size={14} />
                <span className="hidden sm:inline">{t('oracle_verified')}</span>
              </div>
            ) : (
              <Link 
                href="/audit" 
                className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm hidden sm:block"
              >
                {t('join_oracle')}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col h-full relative">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
