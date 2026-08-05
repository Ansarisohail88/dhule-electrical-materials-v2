import React from 'react';

export const GallerySection: React.FC = () => {
  const projects = [
    {
      title: '3-Phase Main Distribution Board Assembly',
      category: 'Commercial Wiring',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Architectural False Ceiling Profile LED Lighting',
      category: 'Residential Interior',
      image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Smart Home Touch Switch Panel & Automation',
      category: 'Smart Automation',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Concealed PVC Pipe Electrical Wiring Installation',
      category: 'Concealed Piping',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Industrial Heavy Duty Armoured Power Cable Laying',
      category: 'Industrial Power',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Rooftop Solar Inverter & ACDB Box Fitting',
      category: 'Solar Energy',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Completed Site Showcase
          </span>
          <h2 className="text-3xl font-black text-slate-900">Project Execution Gallery</h2>
          <p className="text-slate-600 text-sm">
            Take a look at our clean, neat, and code-compliant electrical work across homes, offices, and factories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group hover:shadow-md transition-all">
              <div className="aspect-16/10 bg-slate-100 relative overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 text-amber-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-md backdrop-blur">
                  {p.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 text-sm">{p.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
