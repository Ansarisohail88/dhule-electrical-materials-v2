import React from 'react';
import { Zap, ShieldCheck, Wrench, Lightbulb, Smartphone, Sun, Camera, Home, PhoneCall } from 'lucide-react';

interface ServicesSectionProps {
  onBookService: (serviceName: string) => void;
  emergencyPhone?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onBookService,
  emergencyPhone = '+919876543210'
}) => {
  const services = [
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: 'Complete House & Office Wiring',
      description: 'Concealed PVC conduit wiring, FRLS copper cable installation, load balance and circuit earthing for new constructions and renovations.',
      price: 'Starting ₹15 / sq.ft'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      title: 'MCB & Distribution Board Fitting',
      description: '3-Phase & Single Phase DB installation with Schneider/Legrand MCB, RCCB shock protection, and isolator changeover switches.',
      price: 'Starting ₹850'
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-amber-500" />,
      title: 'Lighting & Chandelier Mounting',
      description: 'COB spotlights, false ceiling panel lights, profile LED strips, chandeliers, street lights, and garden accent illumination.',
      price: 'Starting ₹250 / point'
    },
    {
      icon: <Smartphone className="w-6 h-6 text-amber-500" />,
      title: 'Smart Home Automation',
      description: 'WiFi touch smart switches, motion sensor lighting, smartphone app control setup, and voice assistant integration.',
      price: 'Custom Quotation'
    },
    {
      icon: <Sun className="w-6 h-6 text-amber-500" />,
      title: 'Inverter & Battery Wiring',
      description: 'Pure sine wave inverter connection, tubular battery rack fitting, bypass switch installation, and solar hybrid setup.',
      price: 'Starting ₹600'
    },
    {
      icon: <Camera className="w-6 h-6 text-amber-500" />,
      title: 'CCTV Camera & Security Fitting',
      description: 'HD IP/Analog CCTV installation, DVR/NVR cabling, mobile remote view configuration, and smart video doorbells.',
      price: 'Starting ₹1,200'
    },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Licensed & Certified Electricians
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Professional Electrician Services
          </h2>
          <p className="text-slate-600 text-sm">
            Expert electrical installations, maintenance, emergency repairs, and safety audits with transparent pricing and warranty.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <div
              key={i}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {svc.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{svc.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{svc.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-black text-amber-600">{svc.price}</span>
                <button
                  onClick={() => onBookService(svc.title)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition-colors"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Call Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-black">24/7 Electrical Emergency Support</h3>
            <p className="text-sm font-medium text-slate-900 max-w-xl">
              Power breakdown, short circuit, fire hazard, or MCB tripping? Our emergency electricians reach your premises within 30 minutes.
            </p>
          </div>
          <a
            href={`tel:${emergencyPhone}`}
            className="px-6 py-3.5 rounded-2xl bg-slate-950 text-amber-400 font-black text-sm flex items-center gap-2 shadow-2xl hover:bg-slate-900 transition-transform active:scale-95 whitespace-nowrap"
          >
            <PhoneCall className="w-5 h-5 animate-bounce" /> Call Emergency: {emergencyPhone}
          </a>
        </div>
      </div>
    </div>
  );
};
