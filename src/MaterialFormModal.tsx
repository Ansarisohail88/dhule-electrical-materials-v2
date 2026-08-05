import React, { useState, useEffect } from 'react';
import { Material, Category, Brand } from '../types/material';
import { X, Save, Image as ImageIcon, QrCode, Sparkles, AlertCircle } from 'lucide-react';

interface MaterialFormModalProps {
  material: Partial<Material> | null;
  categories: Category[];
  brands: Brand[];
  onClose: () => void;
  onSave: (material: Material) => void;
  isDuplicate?: boolean;
}

export const MaterialFormModal: React.FC<MaterialFormModalProps> = ({
  material,
  categories,
  brands,
  onClose,
  onSave,
  isDuplicate = false
}) => {
  const [formData, setFormData] = useState<Partial<Material>>({
    name: '',
    category: categories[0]?.name || 'Wire & Cable',
    brand: brands[0]?.name || 'Polycab',
    model: '',
    size: '',
    specification: '',
    unit: 'Pcs',
    hsnCode: '8544',
    gstPercent: 18,
    purchasePrice: 0,
    sellingPrice: 0,
    mrp: 0,
    discountPercent: 0,
    stockQuantity: 10,
    minStockQuantity: 5,
    stockStatus: 'In Stock',
    warranty: '1 Year Warranty',
    supplierName: '',
    supplierPhone: '',
    description: '',
    notes: '',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    barcode: '',
    qrCode: '',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isOffer: false,
    isActive: true,
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'supplier' | 'media'>('basic');

  useEffect(() => {
    if (material) {
      setFormData({
        ...material,
        name: isDuplicate ? `${material.name || ''} (Copy)` : material.name || '',
        id: isDuplicate ? undefined : material.id,
      });
    }
  }, [material, isDuplicate]);

  // Auto calculate discount percentage when MRP or Selling Price changes
  const handlePriceChange = (field: 'purchasePrice' | 'sellingPrice' | 'mrp', value: number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      const mrp = updated.mrp || 0;
      const selling = updated.sellingPrice || 0;
      if (mrp > 0 && mrp >= selling) {
        updated.discountPercent = Math.round(((mrp - selling) / mrp) * 100);
      }
      return updated;
    });
  };

  const handleDiscountChange = (discount: number) => {
    setFormData(prev => {
      const mrp = prev.mrp || 0;
      const selling = mrp > 0 ? Math.round(mrp * (1 - discount / 100)) : prev.sellingPrice;
      return {
        ...prev,
        discountPercent: discount,
        sellingPrice: selling,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const now = new Date().toISOString();
    const qty = formData.stockQuantity || 0;
    const minQty = formData.minStockQuantity || 5;

    let stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    if (qty <= 0) stockStatus = 'Out of Stock';
    else if (qty <= minQty) stockStatus = 'Low Stock';

    const finalMaterial: Material = {
      id: formData.id || `mat-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category || 'Wire & Cable',
      brand: formData.brand || 'Polycab',
      model: formData.model || '',
      size: formData.size || '',
      specification: formData.specification || '',
      unit: formData.unit || 'Pcs',
      hsnCode: formData.hsnCode || '',
      gstPercent: Number(formData.gstPercent) || 18,
      purchasePrice: Number(formData.purchasePrice) || 0,
      sellingPrice: Number(formData.sellingPrice) || 0,
      mrp: Number(formData.mrp) || 0,
      discountPercent: Number(formData.discountPercent) || 0,
      stockQuantity: Number(formData.stockQuantity) || 0,
      minStockQuantity: Number(formData.minStockQuantity) || 5,
      stockStatus,
      warranty: formData.warranty || '1 Year Warranty',
      supplierName: formData.supplierName || '',
      supplierPhone: formData.supplierPhone || '',
      description: formData.description || '',
      notes: formData.notes || '',
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
      barcode: formData.barcode || `BC-${Date.now().toString().slice(-8)}`,
      qrCode: formData.qrCode || `QR-${Date.now().toString().slice(-8)}`,
      isFeatured: !!formData.isFeatured,
      isBestSeller: !!formData.isBestSeller,
      isNewArrival: !!formData.isNewArrival,
      isOffer: !!formData.isOffer,
      isActive: formData.isActive !== false,
      createdAt: formData.createdAt || now,
      updatedAt: now,
    };

    onSave(finalMaterial);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              {material?.id && !isDuplicate ? '✏️ Edit Material' : isDuplicate ? '📋 Duplicate Material' : '➕ Add New Electrical Material'}
            </h2>
            <p className="text-xs text-slate-400">
              Fill technical, pricing, inventory & supplier information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="px-6 pt-4 border-b border-slate-200 flex gap-2 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-colors ${
              activeTab === 'basic' ? 'border-amber-500 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Basic Specs & Category
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-colors ${
              activeTab === 'pricing' ? 'border-amber-500 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Pricing & Stock
          </button>
          <button
            onClick={() => setActiveTab('supplier')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-colors ${
              activeTab === 'supplier' ? 'border-amber-500 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Warranty & Supplier
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-colors ${
              activeTab === 'media' ? 'border-amber-500 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            4. Image, Badges & Codes
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* TAB 1: BASIC SPECS */}
          {activeTab === 'basic' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Material Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FR House Wire 1.5 sqmm Single Core"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white font-medium"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand *</label>
                  <select
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white font-medium"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Model / Series</label>
                  <input
                    type="text"
                    placeholder="e.g. Optima FR / Athena"
                    value={formData.model}
                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Size / Dimension</label>
                  <input
                    type="text"
                    placeholder="e.g. 1.5 sqmm (90m) / 16A"
                    value={formData.size}
                    onChange={e => setFormData({ ...formData, size: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit of Measurement</label>
                  <select
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    {['Meter', 'Coil', 'Pcs', 'Box', 'Set', 'Packet', 'Roll', 'Kg', 'Bundle'].map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Technical Specification</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 100% Electrolytic Copper Conductor, Flame Retardant PVC Insulation..."
                  value={formData.specification}
                  onChange={e => setFormData({ ...formData, specification: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="General summary for customer catalog view..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & STOCK */}
          {activeTab === 'pricing' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-slate-700">
                💡 Entering MRP and Selling Price automatically calculates discount %!
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.mrp}
                    onChange={e => handlePriceChange('mrp', parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.sellingPrice}
                    onChange={e => handlePriceChange('sellingPrice', parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-amber-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercent}
                    onChange={e => handleDiscountChange(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Purchase Price (Cost ₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.purchasePrice}
                    onChange={e => handlePriceChange('purchasePrice', parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">HSN Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 8544"
                    value={formData.hsnCode}
                    onChange={e => setFormData({ ...formData, hsnCode: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">GST Rate (%)</label>
                  <select
                    value={formData.gstPercent}
                    onChange={e => setFormData({ ...formData, gstPercent: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    {[0, 5, 12, 18, 28].map(g => (
                      <option key={g} value={g}>{g}% GST</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Current Stock Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={e => setFormData({ ...formData, stockQuantity: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Minimum Stock Level (Alert Threshold)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStockQuantity}
                    onChange={e => setFormData({ ...formData, minStockQuantity: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <span className="text-xs text-slate-500">
                    Stock status will automatically update to <strong>In Stock</strong>, <strong>Low Stock</strong>, or <strong>Out of Stock</strong> based on quantity.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUPPLIER & WARRANTY */}
          {activeTab === 'supplier' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Warranty Period</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Years Replacement Warranty"
                    value={formData.warranty}
                    onChange={e => setFormData({ ...formData, warranty: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Supplier / Agency Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Polycab Direct Agency"
                    value={formData.supplierName}
                    onChange={e => setFormData({ ...formData, supplierName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Supplier Contact Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.supplierPhone}
                  onChange={e => setFormData({ ...formData, supplierPhone: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Internal Admin Notes / Location</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Stored in Shelf B-3. Batch no: 2026-X..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA & BADGES */}
          {activeTab === 'media' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
                {formData.imageUrl && (
                  <div className="mt-2 w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Barcode</label>
                  <input
                    type="text"
                    placeholder="e.g. 890123456001"
                    value={formData.barcode}
                    onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">QR Code Key</label>
                  <input
                    type="text"
                    placeholder="e.g. MAT-WIRE-POLY-1.5"
                    value={formData.qrCode}
                    onChange={e => setFormData({ ...formData, qrCode: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Badges Toggles */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="font-bold text-slate-800 block">Catalog Badges & Highlights</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData.isFeatured}
                      onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded"
                    />
                    <span>⭐ Featured</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData.isBestSeller}
                      onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded"
                    />
                    <span>🔥 Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData.isNewArrival}
                      onChange={e => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded"
                    />
                    <span>✨ New Arrival</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData.isOffer}
                      onChange={e => setFormData({ ...formData, isOffer: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded"
                    />
                    <span>🏷️ Special Offer</span>
                  </label>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Material Active Status</span>
                  <span className="text-slate-500">When inactive, material will be hidden from customer catalog view</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive !== false}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-amber-500 rounded"
                />
              </div>
            </div>
          )}

          {/* Navigation / Save Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex gap-2 text-xs">
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'pricing') setActiveTab('basic');
                    if (activeTab === 'supplier') setActiveTab('pricing');
                    if (activeTab === 'media') setActiveTab('supplier');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-bold"
                >
                  Previous
                </button>
              )}
              {activeTab !== 'media' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'basic') setActiveTab('pricing');
                    if (activeTab === 'pricing') setActiveTab('supplier');
                    if (activeTab === 'supplier') setActiveTab('media');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold"
                >
                  Next Step →
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Save className="w-4 h-4" /> Save Material
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
