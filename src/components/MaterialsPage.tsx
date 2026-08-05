import React, { useState, useMemo } from 'react';
import { Material, Category, Brand, MaterialFilters } from '../types/material';
import { 
  Search, Filter, ShoppingBag, MessageSquare, Check, X, 
  Sparkles, SlidersHorizontal, Tag, ArrowUpDown, ChevronRight, Info
} from 'lucide-react';

interface MaterialsPageProps {
  materials: Material[];
  categories: Category[];
  brands: Brand[];
  onSelectMaterial: (material: Material) => void;
  onAddToQuote: (material: Material) => void;
  quoteMaterialIds: string[];
  onOpenQuoteBasket: () => void;
  whatsappNumber?: string;
}

export const MaterialsPage: React.FC<MaterialsPageProps> = ({
  materials,
  categories,
  brands,
  onSelectMaterial,
  onAddToQuote,
  quoteMaterialIds,
  onOpenQuoteBasket,
  whatsappNumber = '919876543210'
}) => {
  // Filters State
  const [filters, setFilters] = useState<MaterialFilters>({
    search: '',
    category: 'all',
    brand: 'all',
    stockStatus: 'all',
    minPrice: 0,
    maxPrice: 50000,
    badge: 'all',
    sortBy: 'name'
  });

  const [selectedBadge, setSelectedBadge] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    return materials.filter(item => {
      if (!item.isActive) return false;

      // Search filter
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchBrand = item.brand.toLowerCase().includes(query);
        const matchCat = item.category.toLowerCase().includes(query);
        const matchCode = (item.hsnCode || '').toLowerCase().includes(query);
        const matchSpec = (item.specification || '').toLowerCase().includes(query);
        if (!matchName && !matchBrand && !matchCat && !matchCode && !matchSpec) return false;
      }

      // Category filter
      if (filters.category !== 'all' && item.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }

      // Brand filter
      if (filters.brand !== 'all' && item.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }

      // Stock status filter
      if (filters.stockStatus !== 'all' && item.stockStatus.toLowerCase() !== filters.stockStatus.toLowerCase()) {
        return false;
      }

      // Price range
      if (item.sellingPrice < filters.minPrice || item.sellingPrice > filters.maxPrice) {
        return false;
      }

      // Badge filter
      if (selectedBadge === 'featured' && !item.isFeatured) return false;
      if (selectedBadge === 'bestseller' && !item.isBestSeller) return false;
      if (selectedBadge === 'new' && !item.isNewArrival) return false;
      if (selectedBadge === 'offer' && !item.isOffer) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'priceAsc') return a.sellingPrice - b.sellingPrice;
      if (filters.sortBy === 'priceDesc') return b.sellingPrice - a.sellingPrice;
      if (filters.sortBy === 'discount') return b.discountPercent - a.discountPercent;
      if (filters.sortBy === 'stock') return b.stockQuantity - a.stockQuantity;
      return a.name.localeCompare(b.name);
    });
  }, [materials, filters, selectedBadge]);

  // Handle direct WhatsApp inquiry for an item
  const handleWhatsAppInquiry = (material: Material) => {
    const message = `Hello! I am inquiring about electrical material on your website:\n\n` +
      `📦 Item: ${material.name}\n` +
      `🏷️ Brand: ${material.brand}\n` +
      `📏 Size/Model: ${material.size} (${material.model})\n` +
      `💰 Selling Price: ₹${material.sellingPrice.toLocaleString('en-IN')}\n` +
      `📊 Unit: ${material.unit}\n` +
      `📌 Stock Status: ${material.stockStatus}\n\n` +
      `Please let me know price discount for bulk quantity and availability. Thank you!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Direct Site Supply & Trade Wholesale
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Electrical Materials & Supplies Catalog
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore 100% original wires, switches, MCBs, conduit pipes, lighting & power equipment from leading brands (Polycab, Havells, Schneider, Finolex, Philips & more). Instant WhatsApp quote requests & volume trade discounts available!
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button 
                onClick={onOpenQuoteBasket}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                View Quote Basket ({quoteMaterialIds.length})
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi%20VoltPro!%20I%20would%20like%20to%20request%20a%20bulk%20material%20quote%20for%20my%20project.`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Direct WhatsApp Inquiry
              </a>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-10 translate-y-10 hidden md:block">
            <div className="w-96 h-96 rounded-full bg-amber-500 blur-3xl"></div>
          </div>
        </div>

        {/* Quick Filter Chips (Badges) */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Highlights:
          </span>
          {[
            { id: 'all', label: 'All Materials' },
            { id: 'featured', label: '⭐ Featured' },
            { id: 'bestseller', label: '🔥 Best Sellers' },
            { id: 'offer', label: '🏷️ Special Offers' },
            { id: 'new', label: '✨ New Arrivals' },
          ].map(badge => (
            <button
              key={badge.id}
              onClick={() => setSelectedBadge(badge.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedBadge === badge.id
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {badge.label}
            </button>
          ))}
        </div>

        {/* Search & Main Filter Controls */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search material, brand, size, HSN..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters({ ...filters, search: '' })}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div>
              <select
                value={filters.category}
                onChange={e => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-700 font-medium bg-white"
              >
                <option value="all">📁 All Categories ({categories.length})</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Dropdown */}
            <div>
              <select
                value={filters.brand}
                onChange={e => setFilters({ ...filters, brand: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-700 font-medium bg-white"
              >
                <option value="all">🏭 All Brands ({brands.length})</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort & Stock Status */}
            <div className="flex gap-2">
              <select
                value={filters.sortBy}
                onChange={e => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-700 font-medium bg-white"
              >
                <option value="name">Sort: Name (A-Z)</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="discount">Highest Savings %</option>
              </select>
            </div>
          </div>

          {/* Active Filter Clear Row */}
          {(filters.search || filters.category !== 'all' || filters.brand !== 'all' || selectedBadge !== 'all') && (
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-slate-500">
                Found <strong className="text-slate-900">{filteredMaterials.length}</strong> matching materials
              </span>
              <button
                onClick={() => {
                  setFilters({
                    search: '',
                    category: 'all',
                    brand: 'all',
                    stockStatus: 'all',
                    minPrice: 0,
                    maxPrice: 50000,
                    badge: 'all',
                    sortBy: 'name'
                  });
                  setSelectedBadge('all');
                }}
                className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Materials List / Grid Display */}
        {filteredMaterials.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
              <Info className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Electrical Materials Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              No items match your current filter selection. Try clearing search keywords or selecting a different category/brand.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMaterials.map(item => {
              const inQuoteBasket = quoteMaterialIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group hover:border-amber-400/80"
                >
                  {/* Top Image Box */}
                  <div 
                    onClick={() => onSelectMaterial(item)}
                    className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Stock status badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow ${
                        item.stockStatus === 'In Stock' 
                          ? 'bg-emerald-500 text-white' 
                          : item.stockStatus === 'Low Stock' 
                          ? 'bg-amber-500 text-slate-950' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {item.stockStatus}
                      </span>
                      {item.isOffer && (
                        <span className="bg-rose-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                          {item.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Brand Badge */}
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white px-2.5 py-1 rounded-md text-xs font-bold border border-slate-700/50">
                      {item.brand}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                        {item.category}
                      </div>

                      <h3 
                        onClick={() => onSelectMaterial(item)}
                        className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-amber-600 cursor-pointer transition-colors leading-snug"
                      >
                        {item.name}
                      </h3>

                      <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
                        <span>Size: <strong className="text-slate-700">{item.size || 'Standard'}</strong></span>
                        <span>Model: <strong className="text-slate-700">{item.model || 'N/A'}</strong></span>
                      </div>
                    </div>

                    {/* Pricing Row */}
                    <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-slate-900">
                            ₹{item.sellingPrice.toLocaleString('en-IN')}
                          </span>
                          {item.mrp > item.sellingPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{item.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          Per {item.unit} (incl. {item.gstPercent}% GST)
                        </span>
                      </div>

                      {item.discountPercent > 0 && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Save ₹{(item.mrp - item.sellingPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleWhatsAppInquiry(item)}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-colors"
                        title="Inquire Price & Availability on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                      </button>

                      <button
                        onClick={() => onAddToQuote(item)}
                        className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                          inQuoteBasket
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                        }`}
                      >
                        {inQuoteBasket ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-amber-600" /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" /> + Quote
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
