import React from 'react';
import { Zap, PhoneCall, ShoppingBag, ShieldCheck, Package } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  quoteCount: number;
  onOpenQuoteBasket: () => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  emergencyPhone?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  quoteCount,
  onOpenQuoteBasket,
  isAdminMode,
  setIsAdminMode,
  emergencyPhone = '+919876543210'
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg border-b border-slate-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 px-4 py-1.5 text-xs font-semibold flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">24/7 Emergency</span>
          <span>Fast Licensed Electrician Services & Original Electrical Supplies Direct to Site</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <a href={`tel:${emergencyPhone}`} className="hover:underline flex items-center gap-1">
            <PhoneCall className="w-3.5 h-3.5" /> Call: {emergencyPhone}
          </a>
          <span className="opacity-40">|</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Guaranteed Genuine Brands
          </span>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 fill-slate-950 stroke-slate-950" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white block leading-tight">
              VOLT<span className="text-amber-400">PRO</span> ELECTRICIANS
            </span>
            <span className="text-[10px] text-slate-400 tracking-widest uppercase font-medium">
              Services & Materials Hub
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'home' 
                ? 'bg-slate-800 text-amber-400 font-semibold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'services' 
                ? 'bg-slate-800 text-amber-400 font-semibold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'materials' 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                : 'text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
            }`}
          >
            <Package className="w-4 h-4" />
            📦 Materials Catalog
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'gallery' 
                ? 'bg-slate-800 text-amber-400 font-semibold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'reviews' 
                ? 'bg-slate-800 text-amber-400 font-semibold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'faq' 
                ? 'bg-slate-800 text-amber-400 font-semibold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            FAQ
          </button>
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          {/* Quote Basket Button */}
          <button
            onClick={onOpenQuoteBasket}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors flex items-center gap-2 text-sm font-medium"
            title="Material Quote Basket"
          >
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span className="hidden sm:inline text-xs text-slate-200">Quote Basket</span>
            {quoteCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center animate-pulse">
                {quoteCount}
              </span>
            )}
          </button>

          {/* Admin Switch */}
          <button
            onClick={() => {
              if (!isAdminMode) {
                setActiveTab('admin');
              }
              setIsAdminMode(!isAdminMode);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isAdminMode 
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md' 
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isAdminMode ? '⚙️ Admin Panel Active' : '🔒 Admin Portal'}
          </button>
        </div>
      </div>
    </header>
  );
};
