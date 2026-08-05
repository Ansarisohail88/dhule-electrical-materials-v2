import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are all electrical materials sold on this website 100% genuine?',
      a: 'Yes, 100%! We source all wires, cables, switches, MCBs, and lighting direct from authorized manufacturer agencies (Polycab, Havells, Schneider, Finolex, Philips, Luminous, etc.) with original warranty.'
    },
    {
      q: 'How does the Material Quote Request system work?',
      a: 'Simply browse our Materials Catalog, add the required items and quantities to your Quote Basket, fill in your name and site location, and click "Send Quote Request". Our team receives your complete bill of materials and sends you a formal discounted quote via WhatsApp or Email.'
    },
    {
      q: 'Do you offer site delivery for bulk material orders?',
      a: 'Yes, we provide same-day or next-day direct site delivery for electrical contractors, builders, and homeowners across the region.'
    },
    {
      q: 'Do you provide electrician installation along with material supply?',
      a: 'Yes! We are full-service certified electricians. You can buy materials from our catalog and also book our licensed electricians for installation.'
    },
    {
      q: 'What is your warranty policy on electrical items?',
      a: 'All materials carry standard manufacturer warranties ranging from 1 to 5 years (and up to 10 years on switches and PVC conduits). Defective items are promptly replaced.'
    }
  ];

  return (
    <div className="py-12 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Help & Information
          </span>
          <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-slate-900 text-sm flex items-center justify-between gap-3 hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  {faq.q}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
              </button>

              {openIdx === idx && (
                <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
