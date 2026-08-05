import React from 'react';
import { Material } from '../types/material';
import { X, Check, ShoppingBag, MessageSquare, ShieldCheck, Tag, QrCode, Phone, Building } from 'lucide-react';

interface MaterialDetailModalProps {
  material: Material | null;
  onClose: () => void;
  onAddToQuote: (material: Material) => void;
  isInQuoteBasket: boolean;
  whatsappNumber?: string;
}

export const MaterialDetailModal: React.FC<MaterialDetailModalProps> = ({
  material,
  onClose,
  onAddToQuote,
  isInQuoteBasket,
  whatsappNumber = '919876543210'
}) => {
  if (!material) return null;

  const handleWhatsApp = () => {
    const message = `Hello! I would like to inquire about this electrical item:\n\n` +
      `📦 Material: ${material.name}\n` +
      `🏭 Brand: ${material.brand}\n` +
      `🏷️ Model: ${material.model}\n` +
      `📐 Size: ${material.size}\n` +
      `💰 Selling Price: ₹${material.sellingPrice.toLocaleString('en-IN')} / ${material.unit}\n` +
      `📊 HSN: ${material.hsnCode} (GST ${material.gstPercent}%)\n` +
      `🛡️ Warranty: ${material.warranty}\n\n` +
      `Please let me know availability and best volume price. Thanks!`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider">
              {material.category}
            </span>
            <span className="text-slate-400 text-xs font-mono">ID: {material.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Grid: Image & Key Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Image Box */}
            <div className="space-y-3">
              <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative">
                <img
                  src={material.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'}
                  alt={material.name}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className={`px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider ${
                    material.stockStatus === 'In Stock'
                      ? 'bg-emerald-500 text-white'
                      : material.stockStatus === 'Low Stock'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-red-500 text-white'
                  }`}>
                    {material.stockStatus} ({material.stockQuantity} {material.unit} left)
                  </span>
                </div>
              </div>

              {/* Barcode / QR display */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-slate-500" />
                  <span>Barcode: <strong>{material.barcode || 'N/A'}</strong></span>
                </div>
                <span className="font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded">HSN: {material.hsnCode}</span>
              </div>
            </div>

            {/* Price & Specs Overview */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">
                  {material.brand}
                </span>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {material.name}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Model: <strong className="text-slate-700">{material.model || 'Standard'}</strong> | Size: <strong className="text-slate-700">{material.size || 'N/A'}</strong>
                </p>
              </div>

              {/* Pricing Box */}
              <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-black text-slate-900">
                      ₹{material.sellingPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500 block">
                      Per {material.unit} (inclusive of {material.gstPercent}% GST)
                    </span>
                  </div>

                  {material.mrp > material.sellingPrice && (
                    <div className="text-right">
                      <span className="text-sm text-slate-400 line-through block">
                        MRP ₹{material.mrp.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                        {material.discountPercent}% OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {material.warranty || 'Standard Warranty'}
                </span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-200">
                  <Building className="w-3.5 h-3.5 text-amber-600" /> Genuine Brand
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> Inquire Price & Availability on WhatsApp
                </button>

                <button
                  onClick={() => onAddToQuote(material)}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    isInQuoteBasket
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow'
                  }`}
                >
                  {isInQuoteBasket ? (
                    <>
                      <Check className="w-4 h-4 text-amber-600" /> Item Added to Quote Basket
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Quote Basket
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Specs Table */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Technical Specifications & Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 block font-medium">Specification</span>
                <p className="font-semibold text-slate-800">{material.specification || 'N/A'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 block font-medium">Description</span>
                <p className="font-semibold text-slate-800">{material.description || 'No description available'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 block font-medium">Supplier Info</span>
                <p className="font-semibold text-slate-800">
                  {material.supplierName || 'Official Distributor'} {material.supplierPhone ? `(${material.supplierPhone})` : ''}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 block font-medium">Notes & Instructions</span>
                <p className="font-semibold text-slate-800">{material.notes || 'Handle with care.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
