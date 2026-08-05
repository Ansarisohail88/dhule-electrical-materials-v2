import React, { useState } from 'react';
import { Material, Category, Brand } from '../types/material';
import { bulkUpdatePricesPercent, bulkUpdateMaterials, bulkDeleteMaterials } from '../lib/storage';
import { X, Percent, Edit3, Trash2, Tag, CheckCircle2 } from 'lucide-react';

interface BulkActionModalProps {
  selectedIds: string[];
  materials: Material[];
  categories: Category[];
  brands: Brand[];
  onClose: () => void;
  onRefresh: () => void;
}

export const BulkActionModal: React.FC<BulkActionModalProps> = ({
  selectedIds,
  materials,
  categories,
  brands,
  onClose,
  onRefresh,
}) => {
  const [actionType, setActionType] = useState<'price' | 'discount' | 'category' | 'brand' | 'delete'>('price');
  const [pricePercent, setPricePercent] = useState<number>(5);
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.name || 'Wire & Cable');
  const [selectedBrand, setSelectedBrand] = useState<string>(brands[0]?.name || 'Polycab');

  const handleApply = () => {
    if (actionType === 'price') {
      bulkUpdatePricesPercent(selectedIds, pricePercent, false);
    } else if (actionType === 'discount') {
      bulkUpdatePricesPercent(selectedIds, discountPercent, true);
    } else if (actionType === 'category') {
      bulkUpdateMaterials(selectedIds, { category: selectedCategory });
    } else if (actionType === 'brand') {
      bulkUpdateMaterials(selectedIds, { brand: selectedBrand });
    } else if (actionType === 'delete') {
      if (confirm(`Are you sure you want to permanently bulk delete ${selectedIds.length} materials?`)) {
        bulkDeleteMaterials(selectedIds);
      } else {
        return;
      }
    }

    onRefresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              ⚡ Bulk Edit & Operations ({selectedIds.length} items selected)
            </h2>
            <p className="text-xs text-slate-400">
              Apply bulk price increases, discounts, category changes or deletions
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Action Selector */}
          <div className="grid grid-cols-3 gap-2 text-xs font-bold">
            <button
              onClick={() => setActionType('price')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                actionType === 'price' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              📈 Price % Change
            </button>
            <button
              onClick={() => setActionType('discount')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                actionType === 'discount' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              🏷️ Set Discount %
            </button>
            <button
              onClick={() => setActionType('category')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                actionType === 'category' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              📁 Set Category
            </button>
            <button
              onClick={() => setActionType('brand')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                actionType === 'brand' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              🏭 Set Brand
            </button>
            <button
              onClick={() => setActionType('delete')}
              className={`col-span-2 p-2.5 rounded-xl border text-center transition-all ${
                actionType === 'delete' ? 'bg-rose-600 text-white border-rose-600 shadow' : 'bg-slate-50 border-slate-200 text-rose-700'
              }`}
            >
              🗑️ Bulk Delete Selected
            </button>
          </div>

          {/* Action Config Form */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
            {actionType === 'price' && (
              <div>
                <label className="font-bold text-slate-800 block mb-1">Price Change Percentage (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={pricePercent}
                    onChange={e => setPricePercent(parseFloat(e.target.value) || 0)}
                    className="p-2.5 border border-slate-200 rounded-xl bg-white w-32 font-bold"
                  />
                  <span className="text-slate-500">
                    {pricePercent >= 0 ? `+${pricePercent}% price increase` : `${pricePercent}% price reduction`}
                  </span>
                </div>
              </div>
            )}

            {actionType === 'discount' && (
              <div>
                <label className="font-bold text-slate-800 block mb-1">New Discount Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  className="p-2.5 border border-slate-200 rounded-xl bg-white w-32 font-bold text-emerald-600"
                />
              </div>
            )}

            {actionType === 'category' && (
              <div>
                <label className="font-bold text-slate-800 block mb-1">Select New Category</label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-medium"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {actionType === 'brand' && (
              <div>
                <label className="font-bold text-slate-800 block mb-1">Select New Brand</label>
                <select
                  value={selectedBrand}
                  onChange={e => setSelectedBrand(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-medium"
                >
                  {brands.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
            )}

            {actionType === 'delete' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
                ⚠️ Warning: This will permanently delete <strong>{selectedIds.length}</strong> selected materials from database.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow ${
                actionType === 'delete' ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" /> Apply Bulk Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
