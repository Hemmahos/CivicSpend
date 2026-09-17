'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="w-full relative mt-32">
      {/* Decorative Top Divider (Cityscape/Landscape vibe) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform -translate-y-[99%]">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[60px] md:h-[100px]"
          fill="#004d2e"
        >
          {/* Base rolling hills / terrain */}
          <path d="M0,120 C150,120 300,70 450,90 C600,110 750,50 900,80 C1050,110 1150,40 1200,70 L1200,120 L0,120 Z"></path>
          {/* Silhouettes of buildings/infrastructure to match the CivicSpend theme */}
          <rect x="80" y="80" width="30" height="40" rx="2" />
          <rect x="120" y="60" width="25" height="60" rx="2" />
          
          <rect x="350" y="75" width="40" height="45" rx="2" />
          <rect x="400" y="55" width="35" height="65" rx="2" />
          <rect x="445" y="40" width="20" height="80" rx="2" />
          
          <rect x="750" y="70" width="60" height="50" rx="3" />
          <circle cx="780" cy="70" r="15" />
          
          <rect x="1000" y="50" width="45" height="70" rx="2" />
          <rect x="1055" y="75" width="30" height="45" rx="2" />
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="bg-[#004d2e] text-white pt-12 pb-6 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">
          
          {/* Column 1: Links */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Logo size={24} />
              CivicSpend
            </h4>
            <Link href="/" className="text-gray-300 hover:text-white transition text-sm">Community Feed</Link>
            <Link href="/upload" className="text-gray-300 hover:text-white transition text-sm">Upload Evidence</Link>
            <Link href="/audit" className="text-gray-300 hover:text-white transition text-sm">Expert Audit</Link>
            <Link href="/how-it-works" className="text-gray-300 hover:text-white transition text-sm">How it Works</Link>
          </div>

          {/* Column 2: Center Text / Mission (Replacing Email Subscribe) */}
          <div className="flex flex-col items-center text-center max-w-sm mx-auto hidden md:flex md:border-x border-[#006b40] md:px-12">
            <h3 className="text-2xl font-serif font-medium mb-3">Empowering Citizens</h3>
            <p className="text-sm text-gray-300 italic">
              Verified infrastructure data from professionals across every state, local government, and ward. Curated daily by the community.
            </p>
          </div>

          {/* Column 3: Contact Info */}
          <div className="flex flex-col space-y-4 md:items-end md:text-right">
            <a href="mailto:Emmanueleniabiire@gmail.com" className="font-bold text-lg mb-2 flex items-center gap-2 hover:text-[#40AFD6] transition">
              Send Us A Message <ArrowRight size={18} />
            </a>
            <p className="text-gray-300 text-sm">
              (234) 800-CIVIC-SPEND
            </p>
            <p className="text-gray-300 text-sm">
              Plot 123, Infrastructure Way<br/>
              Abuja, FCT, Nigeria
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-[#006b40] flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 text-xs text-gray-400">
          <p className="md:w-1/3 text-center md:text-left">© {new Date().getFullYear()} CivicSpend. All Rights Reserved.</p>
          
          <p className="md:w-1/3 text-center">
            Crafted by <a href="https://emmanueleniabiire.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition font-medium">HemmaH_Os❤️✌️</a>
          </p>

          <div className="md:w-1/3 flex items-center justify-center md:justify-end gap-6">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
