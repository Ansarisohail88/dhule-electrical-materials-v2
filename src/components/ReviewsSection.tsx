import React from 'react';
import { Star, Quote } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Vikramaditya Sharma',
      role: 'Villa Owner, Sector 45',
      rating: 5,
      comment: 'Extremely professional team! They completed concealed PVC wiring and 3-phase MCB box fitting for my new 3-story house using 100% genuine Polycab wire supplied from their own catalog.',
      date: '2 weeks ago'
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Boutique Store Manager',
      rating: 5,
      comment: 'Their materials store had all Philips COB panel lights and GM smart touch switches in stock at trade discount prices. Delivered straight to our retail shop site!',
      date: '1 month ago'
    },
    {
      name: 'Rajesh Contractor',
      role: 'Building Contractor',
      rating: 5,
      comment: 'The Materials Management feature on their website makes submitting site quote requests effortless. Transparent HSN, GST, and wholesale prices.',
      date: '1 month ago'
    }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Verified Customer Ratings
          </span>
          <h2 className="text-3xl font-black text-slate-900">What Our Clients Say</h2>
          <p className="text-slate-600 text-sm">
            Over 1,200+ residential and commercial electrical projects completed safely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative">
              <Quote className="w-8 h-8 text-amber-500/20 absolute top-4 right-4" />
              <div className="flex gap-1 text-amber-500">
                {[...Array(r.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-slate-700 text-xs leading-relaxed italic">"{r.comment}"</p>
              <div className="pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900 text-sm block">{r.name}</span>
                <span className="text-[11px] text-slate-500 block">{r.role} • {r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
