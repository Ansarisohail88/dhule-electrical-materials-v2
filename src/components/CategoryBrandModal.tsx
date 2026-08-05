import React, { useState } from 'react';
import { Category, Brand } from '../types/material';
import { saveCategory, deleteCategory, saveBrand, deleteBrand } from '../lib/storage';
import { X, Plus, Trash2, FolderPlus, Building2 } from 'lucide-react';

interface CategoryBrandModalProps {
  categories: Category[];
  brands: Brand[];
  onClose: () => void;
  onRefresh: () => void;
}

export const CategoryBrandModal: React.FC<CategoryBrandModalProps> = ({
  categories,
  brands,
  onClose,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'category' | 'brand'>('category');
  const [newCatName, setNewCatName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    saveCategory(newCatName.trim());
    setNewCatName('');
    onRefresh();
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    saveBrand(newBrandName.trim());
    setNewBrandName('');
    onRefresh();
  };

  const handleDeleteCat = (id: string) => {
    if (confirm('Delete this category? Associated materials will remain.')) {
      deleteCategory(id);
      onRefresh();
    }
  };

  const handleDeleteBrand = (id: string) => {
    if (confirm('Delete this brand? Associated materials will remain.')) {
      deleteBrand(id);
      onRefresh();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              🏷️ Manage Categories & Brands
            </h2>
            <p className="text-xs text-slate-400">
              Create unlimited custom material categories and manufacturer brands
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="px-6 pt-4 border-b border-slate-200 flex gap-2 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('category')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'category' ? 'border-amber-500 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderPlus className="w-4 h-4" /> Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('brand')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'brand' ? 'border-amber-500 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" /> Brands ({brands.length})
          </button>
        </div>

        <div className="p-6 space-y-6">
          {activeTab === 'category' ? (
            <div className="space-y-4">
              {/* Add New Category Form */}
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter new category name (e.g. Smart Automation, Solar Panels...)"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="flex-1 p-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </form>

              {/* Category List */}
              <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 max-h-80 overflow-y-auto bg-slate-50">
                {categories.map((cat, i) => (
                  <div key={cat.id} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="font-bold text-slate-900">{cat.name}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteCat(cat.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Add New Brand Form */}
              <form onSubmit={handleAddBrand} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter new brand name (e.g. Havells, Polycab, Siemens...)"
                  value={newBrandName}
                  onChange={e => setNewBrandName(e.target.value)}
                  className="flex-1 p-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow"
                >
                  <Plus className="w-4 h-4" /> Add Brand
                </button>
              </form>

              {/* Brand List */}
              <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 max-h-80 overflow-y-auto bg-slate-50">
                {brands.map((brand, i) => (
                  <div key={brand.id} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="font-bold text-slate-900">{brand.name}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteBrand(brand.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Brand"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
