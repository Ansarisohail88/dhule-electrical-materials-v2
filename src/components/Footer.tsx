import React from 'react';
import { Zap, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  emergencyPhone?: string;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  emergencyPhone = '+919876543210'
}) => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950">
                <Zap className="w-5 h-5 fill-slate-950 stroke-slate-950" />
              </div>
              <span className="text-base font-black tracking-tight text-white">
                VOLT<span className="text-amber-400">PRO</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Licensed electrician services and electrical materials supplier. Supplying 100% genuine wires, switches, MCBs, lighting, and power equipment direct to site.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-amber-400">Home</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-amber-400">Services</button></li>
              <li><button onClick={() => setActiveTab('materials')} className="hover:text-amber-400 font-bold text-amber-300">📦 Materials Catalog</button></li>
              <li><button onClick={() => setActiveTab('gallery')} className="hover:text-amber-400">Project Gallery</button></li>
              <li><button onClick={() => setActiveTab('reviews')} className="hover:text-amber-400">Reviews & Ratings</button></li>
              <li><button onClick={() => setActiveTab('faq')} className="hover:text-amber-400">FAQ</button></li>
            </ul>
          </div>

          {/* Col 3: Material Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Top Material Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Wire & Cable (Polycab, Finolex, RR)</li>
              <li>Switches & Sockets (Havells, GM, Anchor)</li>
              <li>MCB & Protection (Schneider, Legrand)</li>
              <li>PVC Pipe & Conduit (Supreme, Astral)</li>
              <li>Lighting & LED Panel (Philips, Wipro)</li>
              <li>Inverters & Batteries (Luminous, Exide)</li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">24/7 Helpline</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <a href={`tel:${emergencyPhone}`} className="flex items-center gap-2 hover:text-amber-400">
                <Phone className="w-4 h-4 text-amber-500" /> {emergencyPhone}
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-amber-500" /> support@voltproelectric.com
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-amber-500" /> Electrical Market Hub, Main Road
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <span>© {new Date().getFullYear()} VoltPro Electricians & Materials Management. All rights reserved.</span>
          <div className="flex items-center gap-2 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Guaranteed Genuine Trade Supplies
          </div>
        </div>
      </div>
    </footer>
  );
};
