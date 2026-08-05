import React, { useState } from 'react';
import { Material } from '../types/material';
import { saveQuoteRequest } from '../lib/storage';
import { X, Trash2, Plus, Minus, Send, CheckCircle2, MessageSquare, MapPin, User, Phone } from 'lucide-react';

interface QuoteBasketModalProps {
  quoteItems: { material: Material; quantity: number }[];
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearBasket: () => void;
  whatsappNumber?: string;
}

export const QuoteBasketModal: React.FC<QuoteBasketModalProps> = ({
  quoteItems,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearBasket,
  whatsappNumber = '919876543210'
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const totalEstimate = quoteItems.reduce((acc, item) => acc + (item.material.sellingPrice * item.quantity), 0);

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteItems.length === 0) return;

    // Save quote to storage/database
    saveQuoteRequest({
      customerName,
      customerPhone,
      siteLocation,
      notes,
      items: quoteItems.map(i => ({
        materialId: i.material.id,
        materialName: i.material.name,
        brand: i.material.brand,
        size: i.material.size,
        quantity: i.quantity,
        unit: i.material.unit,
        unitPrice: i.material.sellingPrice,
      })),
      totalEstimate,
    });

    // Generate WhatsApp Quote Message
    let msg = `⚡ *NEW MATERIAL QUOTE REQUEST*\n\n`;
    msg += `👤 *Customer Name:* ${customerName}\n`;
    msg += `📞 *Phone:* ${customerPhone}\n`;
    msg += `📍 *Site Location:* ${siteLocation}\n`;
    if (notes) msg += `📝 *Notes:* ${notes}\n`;
    msg += `\n📦 *Requested Items (${quoteItems.length}):*\n`;

    quoteItems.forEach((item, index) => {
      msg += `${index + 1}. *${item.material.name}*\n`;
      msg += `   Brand: ${item.material.brand} | Size: ${item.material.size}\n`;
      msg += `   Qty: ${item.quantity} ${item.material.unit} x ₹${item.material.sellingPrice} = ₹${(item.quantity * item.material.sellingPrice).toLocaleString('en-IN')}\n\n`;
    });

    msg += `💰 *Total Estimated Value:* ₹${totalEstimate.toLocaleString('en-IN')}\n\n`;
    msg += `Please review and provide best contractor discount quotation. Thank you!`;

    setSubmitted(true);

    // Open WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              📋 Electrical Material Quote Basket
            </h2>
            <p className="text-xs text-slate-400">
              Assemble required materials for your site and receive a formal price quotation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Quote Request Submitted!</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Your quote request has been recorded and sent to our electrical team via WhatsApp. We will reply with best trade discounts shortly!
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    onClearBasket();
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : quoteItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <X className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Your Quote Basket is Empty</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Browse our Materials Catalog and click "+ Quote" on any items you need for your site project.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm"
              >
                Browse Materials Catalog
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitQuote} className="space-y-6">
              
              {/* Material Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Selected Items ({quoteItems.length})
                  </h3>
                  <button
                    type="button"
                    onClick={onClearBasket}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                  {quoteItems.map(({ material, quantity }) => (
                    <div key={material.id} className="p-3 bg-white flex items-center gap-3">
                      <img
                        src={material.imageUrl}
                        alt={material.name}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{material.name}</h4>
                        <div className="text-[11px] text-slate-500">
                          {material.brand} • {material.size} • ₹{material.sellingPrice}/{material.unit}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(material.id, -1)}
                          className="p-1 hover:bg-slate-200 text-slate-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-900">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(material.id, 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-20">
                        <span className="text-xs font-bold text-slate-900 block">
                          ₹{(material.sellingPrice * quantity).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => onRemoveItem(material.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Estimate Summary Box */}
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase">Estimated Total Value</span>
                  <span className="text-xl font-black text-slate-900">₹{totalEstimate.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Customer Contact Information */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Contact & Project Site Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Your Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Site / Project Location *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sector 14, Commercial Building Site"
                      value={siteLocation}
                      onChange={e => setSiteLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Additional Requirements / Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Specify delivery timeline, custom wire colors, brand preferences..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" /> Send Material Quote Request via WhatsApp
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
