import React, { useState } from 'react';
import { Material, Category, Brand, QuoteRequest } from '../types/material';
import { 
  exportMaterialsToCSV, parseCSVToMaterials, printMaterialPDFReport 
} from '../lib/exportUtils';
import { deleteMaterial, duplicateMaterial, saveMaterial } from '../lib/storage';
import { 
  Package, Plus, Search, Filter, Download, Upload, Printer, 
  Trash2, Copy, Edit, Sparkles, AlertTriangle, XCircle, CheckCircle, 
  Layers, Tags, DollarSign, FileText, Settings, Shield, RefreshCw
} from 'lucide-react';

interface AdminPanelProps {
  materials: Material[];
  categories: Category[];
  brands: Brand[];
  quoteRequests: QuoteRequest[];
  onOpenAddModal: () => void;
  onEditMaterial: (material: Material) => void;
  onDuplicateMaterial: (material: Material) => void;
  onOpenCategoryBrandModal: () => void;
  onOpenBulkModal: (selectedIds: string[]) => void;
  onRefreshData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  materials,
  categories,
  brands,
  quoteRequests,
  onOpenAddModal,
  onEditMaterial,
  onDuplicateMaterial,
  onOpenCategoryBrandModal,
  onOpenBulkModal,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'quotes' | 'alerts'>('materials');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);

  // Statistics
  const totalItems = materials.length;
  const activeCount = materials.filter(m => m.isActive).length;
  const lowStockCount = materials.filter(m => m.stockStatus === 'Low Stock').length;
  const outOfStockCount = materials.filter(m => m.stockStatus === 'Out of Stock').length;
  const totalStockValuation = materials.reduce((acc, m) => acc + (m.sellingPrice * m.stockQuantity), 0);

  // Filtered List
  const filteredMaterials = materials.filter(m => {
    if (search) {
      const q = search.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchBrand = m.brand.toLowerCase().includes(q);
      const matchCat = m.category.toLowerCase().includes(q);
      const matchModel = (m.model || '').toLowerCase().includes(q);
      const matchHsn = (m.hsnCode || '').toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCat && !matchModel && !matchHsn) return false;
    }

    if (categoryFilter !== 'all' && m.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (brandFilter !== 'all' && m.brand.toLowerCase() !== brandFilter.toLowerCase()) return false;
    if (stockFilter !== 'all' && m.stockStatus.toLowerCase() !== stockFilter.toLowerCase()) return false;

    return true;
  });

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredMaterials.map(m => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Quick Active Toggle
  const handleToggleActive = (material: Material) => {
    saveMaterial({ ...material, isActive: !material.isActive });
    onRefreshData();
  };

  // Quick Delete
  const handleDelete = (id: string) => {
    if (confirm('Delete this material from inventory?')) {
      deleteMaterial(id);
      setSelectedIds(prev => prev.filter(i => i !== id));
      onRefreshData();
    }
  };

  // CSV Import handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = parseCSVToMaterials(text);
        if (parsed.length > 0) {
          parsed.forEach(m => saveMaterial(m as Material));
          alert(`Successfully imported ${parsed.length} materials from CSV!`);
          onRefreshData();
        } else {
          alert('Could not parse materials from file. Please check CSV format.');
        }
      } catch (err) {
        alert('Error parsing CSV file.');
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" /> Full Stack Admin Module
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">⚡ Electrical Materials Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage electrical stock inventory, categories, brands, price lists, and customer quote inquiries
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenCategoryBrandModal}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 border border-slate-700 shadow"
            >
              <Tags className="w-4 h-4" /> Categories & Brands
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Material
            </button>
          </div>
        </div>

        {/* Stats Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Items</span>
            <div className="text-2xl font-black text-slate-900">{totalItems}</div>
            <span className="text-[10px] text-emerald-600 font-bold block">{activeCount} Active in Catalog</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Valuation</span>
            <div className="text-2xl font-black text-amber-600">₹{(totalStockValuation / 1000).toFixed(1)}k</div>
            <span className="text-[10px] text-slate-500 block">Total Selling Price</span>
          </div>

          <div 
            onClick={() => { setActiveTab('materials'); setStockFilter('low stock'); }}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1 cursor-pointer hover:border-amber-400 transition-colors"
          >
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Low Stock
            </span>
            <div className="text-2xl font-black text-amber-600">{lowStockCount}</div>
            <span className="text-[10px] text-slate-500 block">Below min threshold</span>
          </div>

          <div 
            onClick={() => { setActiveTab('materials'); setStockFilter('out of stock'); }}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1 cursor-pointer hover:border-rose-400 transition-colors"
          >
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Out of Stock
            </span>
            <div className="text-2xl font-black text-rose-600">{outOfStockCount}</div>
            <span className="text-[10px] text-slate-500 block">Needs replenishment</span>
          </div>

          <div 
            onClick={() => setActiveTab('quotes')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1 cursor-pointer hover:border-slate-400 transition-colors col-span-2 sm:col-span-1"
          >
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quote Requests</span>
            <div className="text-2xl font-black text-slate-900">{quoteRequests.length}</div>
            <span className="text-[10px] text-slate-500 block">Customer Site Quotes</span>
          </div>
        </div>

        {/* Tab Selection Bar */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-bold shadow-sm">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'materials' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              📦 Materials Inventory ({materials.length})
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'quotes' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              📋 Quote Requests ({quoteRequests.length})
            </button>
          </div>

          {/* Action Toolbar for Materials */}
          {activeTab === 'materials' && (
            <div className="flex flex-wrap items-center gap-2">
              <label className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1 border border-slate-200">
                <Upload className="w-3.5 h-3.5 text-amber-600" />
                {importing ? 'Importing...' : 'Import Excel/CSV'}
                <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                onClick={() => exportMaterialsToCSV(filteredMaterials)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 border border-slate-200"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" /> Export CSV
              </button>

              <button
                onClick={() => printMaterialPDFReport(filteredMaterials)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 border border-slate-200"
              >
                <Printer className="w-3.5 h-3.5 text-slate-700" /> Export PDF / Print
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: MATERIALS MANAGEMENT TABLE */}
        {activeTab === 'materials' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
            
            {/* Filter controls row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter by name, brand, model, HSN..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl bg-white font-medium"
              >
                <option value="all">📁 All Categories ({categories.length})</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              <select
                value={brandFilter}
                onChange={e => setBrandFilter(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl bg-white font-medium"
              >
                <option value="all">🏭 All Brands ({brands.length})</option>
                {brands.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>

              <select
                value={stockFilter}
                onChange={e => setStockFilter(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl bg-white font-medium"
              >
                <option value="all">📊 All Stock Statuses</option>
                <option value="in stock">In Stock</option>
                <option value="low stock">Low Stock Alert</option>
                <option value="out of stock">Out of Stock</option>
              </select>
            </div>

            {/* Bulk Action Trigger Bar */}
            {selectedIds.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs animate-fadeIn">
                <span className="font-bold text-amber-900">
                  ⚡ {selectedIds.length} materials selected
                </span>
                <button
                  onClick={() => onOpenBulkModal(selectedIds)}
                  className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl shadow hover:bg-amber-400"
                >
                  Apply Bulk Edit / Operation
                </button>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedIds.length === filteredMaterials.length && filteredMaterials.length > 0}
                        className="rounded text-amber-500"
                      />
                    </th>
                    <th className="p-3">Material Name & Spec</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Brand</th>
                    <th className="p-3 text-right">Selling / MRP</th>
                    <th className="p-3 text-center">Stock</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Active</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredMaterials.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(m.id)}
                          onChange={() => handleToggleSelect(m.id)}
                          className="rounded text-amber-500"
                        />
                      </td>

                      <td className="p-3 min-w-56">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={m.imageUrl}
                            alt={m.name}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 bg-slate-100"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">{m.name}</span>
                            <span className="text-[10px] text-slate-400">
                              Size: {m.size || 'N/A'} | HSN: {m.hsnCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {m.category}
                        </span>
                      </td>

                      <td className="p-3 whitespace-nowrap font-bold text-slate-800">
                        {m.brand}
                      </td>

                      <td className="p-3 text-right whitespace-nowrap">
                        <span className="font-bold text-slate-900 block">₹{m.sellingPrice.toLocaleString()}</span>
                        {m.mrp > m.sellingPrice && (
                          <span className="text-[10px] text-slate-400 line-through block">₹{m.mrp.toLocaleString()}</span>
                        )}
                      </td>

                      <td className="p-3 text-center whitespace-nowrap font-bold">
                        {m.stockQuantity} {m.unit}
                      </td>

                      <td className="p-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          m.stockStatus === 'In Stock' ? 'bg-emerald-100 text-emerald-800' :
                          m.stockStatus === 'Low Stock' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {m.stockStatus}
                        </span>
                      </td>

                      <td className="p-3 text-center whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={m.isActive}
                          onChange={() => handleToggleActive(m)}
                          className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                        />
                      </td>

                      <td className="p-3 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => onEditMaterial(m)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="Edit Material"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDuplicateMaterial(m)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-amber-700"
                          title="Duplicate Material"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-rose-600"
                          title="Delete Material"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: QUOTE REQUESTS */}
        {activeTab === 'quotes' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Submitted Material Quote Requests</h2>

            {quoteRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No quote requests submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {quoteRequests.map(q => (
                  <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-200 pb-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{q.customerName}</h3>
                        <div className="text-xs text-slate-500">Phone: {q.customerPhone} | Site: {q.siteLocation}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-amber-600 block">₹{q.totalEstimate.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400">{new Date(q.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <span className="font-bold text-slate-700 block">Requested Items:</span>
                      {q.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-slate-600">
                          <span>{item.materialName} ({item.brand})</span>
                          <span>{item.quantity} {item.unit} x ₹{item.unitPrice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
