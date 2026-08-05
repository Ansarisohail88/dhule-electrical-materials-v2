import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MaterialsPage } from './components/MaterialsPage';
import { MaterialDetailModal } from './components/MaterialDetailModal';
import { QuoteBasketModal } from './components/QuoteBasketModal';
import { AdminPanel } from './components/AdminPanel';
import { MaterialFormModal } from './components/MaterialFormModal';
import { CategoryBrandModal } from './components/CategoryBrandModal';
import { BulkActionModal } from './components/BulkActionModal';
import { ServicesSection } from './components/ServicesSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { FaqSection } from './components/FaqSection';

import { Material, Category, Brand, QuoteRequest } from './types/material';
import { 
  getStoredMaterials, getStoredCategories, getStoredBrands, 
  getStoredQuotes, saveMaterial 
} from './lib/storage';

import { Zap, ShieldCheck, PhoneCall, Sparkles, Package, MessageSquare } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);

  // Quote Basket State
  const [quoteBasket, setQuoteBasket] = useState<{ material: Material; quantity: number }[]>([]);

  // Modals
  const [selectedMaterialForDetail, setSelectedMaterialForDetail] = useState<Material | null>(null);
  const [isQuoteBasketOpen, setIsQuoteBasketOpen] = useState(false);
  const [materialForForm, setMaterialForForm] = useState<Partial<Material> | null>(null);
  const [isFormDuplicate, setIsFormDuplicate] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryBrandModalOpen, setIsCategoryBrandModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedBulkIds, setSelectedBulkIds] = useState<string[]>([]);

  const [isAdminMode, setIsAdminMode] = useState(false);

  // Load state from store
  const refreshData = () => {
    setMaterials(getStoredMaterials());
    setCategories(getStoredCategories());
    setBrands(getStoredBrands());
    setQuoteRequests(getStoredQuotes());
  };

  useEffect(() => {
    refreshData();

    const handleMaterialsUpdated = () => setMaterials(getStoredMaterials());
    const handleCategoriesUpdated = () => setCategories(getStoredCategories());
    const handleBrandsUpdated = () => setBrands(getStoredBrands());
    const handleQuotesUpdated = () => setQuoteRequests(getStoredQuotes());

    window.addEventListener('materials-updated', handleMaterialsUpdated);
    window.addEventListener('categories-updated', handleCategoriesUpdated);
    window.addEventListener('brands-updated', handleBrandsUpdated);
    window.addEventListener('quotes-updated', handleQuotesUpdated);

    return () => {
      window.removeEventListener('materials-updated', handleMaterialsUpdated);
      window.removeEventListener('categories-updated', handleCategoriesUpdated);
      window.removeEventListener('brands-updated', handleBrandsUpdated);
      window.removeEventListener('quotes-updated', handleQuotesUpdated);
    };
  }, []);

  // Quote Basket Handlers
  const handleAddToQuote = (material: Material) => {
    setQuoteBasket(prev => {
      const existing = prev.find(item => item.material.id === material.id);
      if (existing) {
        return prev.map(item => 
          item.material.id === material.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { material, quantity: 1 }];
    });
  };

  const handleUpdateQuoteQuantity = (id: string, delta: number) => {
    setQuoteBasket(prev => {
      return prev.map(item => {
        if (item.material.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as { material: Material; quantity: number }[];
    });
  };

  const handleRemoveFromQuote = (id: string) => {
    setQuoteBasket(prev => prev.filter(item => item.material.id !== id));
  };

  const handleClearQuoteBasket = () => {
    setQuoteBasket([]);
  };

  // Form Save
  const handleSaveMaterial = (mat: Material) => {
    saveMaterial(mat);
    setIsFormOpen(false);
    setMaterialForForm(null);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col justify-between">
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'admin') setIsAdminMode(true);
            else setIsAdminMode(false);
          }}
          quoteCount={quoteBasket.length}
          onOpenQuoteBasket={() => setIsQuoteBasketOpen(true)}
          isAdminMode={isAdminMode}
          setIsAdminMode={(admin) => {
            setIsAdminMode(admin);
            if (admin) setActiveTab('admin');
            else if (activeTab === 'admin') setActiveTab('home');
          }}
        />

        {/* Main Content Sections */}
        <main>
          {isAdminMode || activeTab === 'admin' ? (
            <AdminPanel
              materials={materials}
              categories={categories}
              brands={brands}
              quoteRequests={quoteRequests}
              onOpenAddModal={() => {
                setMaterialForForm(null);
                setIsFormDuplicate(false);
                setIsFormOpen(true);
              }}
              onEditMaterial={(mat) => {
                setMaterialForForm(mat);
                setIsFormDuplicate(false);
                setIsFormOpen(true);
              }}
              onDuplicateMaterial={(mat) => {
                setMaterialForForm(mat);
                setIsFormDuplicate(true);
                setIsFormOpen(true);
              }}
              onOpenCategoryBrandModal={() => setIsCategoryBrandModalOpen(true)}
              onOpenBulkModal={(ids) => {
                setSelectedBulkIds(ids);
                setIsBulkModalOpen(true);
              }}
              onRefreshData={refreshData}
            />
          ) : (
            <>
              {/* HOME VIEW */}
              {activeTab === 'home' && (
                <div>
                  {/* Hero Section */}
                  <div className="relative bg-slate-950 text-white overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" /> Licensed Electricians & Supplies Depot
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                          Certified Electrical Services & Original Supplies
                        </h1>

                        <p className="text-slate-300 text-base leading-relaxed">
                          Your one-stop destination for complete house/commercial wiring, MCB distribution panel fitting, smart lighting, and 100% genuine electrical materials from Polycab, Havells, Schneider, Finolex & more.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            onClick={() => setActiveTab('materials')}
                            className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl transition-transform active:scale-95"
                          >
                            <Package className="w-4 h-4" /> Explore 📦 Materials Catalog
                          </button>

                          <button
                            onClick={() => setActiveTab('services')}
                            className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 shadow"
                          >
                            Book Electrician Services
                          </button>
                        </div>
                      </div>

                      {/* Right Hero Image Card */}
                      <div className="relative">
                        <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl aspect-4/3 relative bg-slate-900">
                          <img
                            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800"
                            alt="Electrician at work"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                          
                          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 backdrop-blur border border-slate-800 text-white flex items-center justify-between">
                            <div>
                              <span className="text-amber-400 font-bold text-xs uppercase block">Direct Site Delivery</span>
                              <span className="text-sm font-black text-white">Genuine Wires, Switches & MCBs</span>
                            </div>
                            <button
                              onClick={() => setActiveTab('materials')}
                              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                            >
                              Shop Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ServicesSection onBookService={() => setActiveTab('services')} />
                  <GallerySection />
                  <ReviewsSection />
                  <FaqSection />
                </div>
              )}

              {/* SERVICES VIEW */}
              {activeTab === 'services' && (
                <ServicesSection onBookService={() => alert('Electrician service booking request received! Our team will contact you within 15 minutes.')} />
              )}

              {/* MATERIALS CATALOG VIEW */}
              {activeTab === 'materials' && (
                <MaterialsPage
                  materials={materials}
                  categories={categories}
                  brands={brands}
                  onSelectMaterial={(mat) => setSelectedMaterialForDetail(mat)}
                  onAddToQuote={handleAddToQuote}
                  quoteMaterialIds={quoteBasket.map(i => i.material.id)}
                  onOpenQuoteBasket={() => setIsQuoteBasketOpen(true)}
                />
              )}

              {/* GALLERY VIEW */}
              {activeTab === 'gallery' && <GallerySection />}

              {/* REVIEWS VIEW */}
              {activeTab === 'reviews' && <ReviewsSection />}

              {/* FAQ VIEW */}
              {activeTab === 'faq' && <FaqSection />}
            </>
          )}
        </main>
      </div>

      <Footer setActiveTab={setActiveTab} />

      {/* MODALS */}
      {selectedMaterialForDetail && (
        <MaterialDetailModal
          material={selectedMaterialForDetail}
          onClose={() => setSelectedMaterialForDetail(null)}
          onAddToQuote={handleAddToQuote}
          isInQuoteBasket={quoteBasket.some(i => i.material.id === selectedMaterialForDetail.id)}
        />
      )}

      {isQuoteBasketOpen && (
        <QuoteBasketModal
          quoteItems={quoteBasket}
          onClose={() => setIsQuoteBasketOpen(false)}
          onUpdateQuantity={handleUpdateQuoteQuantity}
          onRemoveItem={handleRemoveFromQuote}
          onClearBasket={handleClearQuoteBasket}
        />
      )}

      {isFormOpen && (
        <MaterialFormModal
          material={materialForForm}
          categories={categories}
          brands={brands}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveMaterial}
          isDuplicate={isFormDuplicate}
        />
      )}

      {isCategoryBrandModalOpen && (
        <CategoryBrandModal
          categories={categories}
          brands={brands}
          onClose={() => setIsCategoryBrandModalOpen(false)}
          onRefresh={refreshData}
        />
      )}

      {isBulkModalOpen && (
        <BulkActionModal
          selectedIds={selectedBulkIds}
          materials={materials}
          categories={categories}
          brands={brands}
          onClose={() => setIsBulkModalOpen(false)}
          onRefresh={refreshData}
        />
      )}
    </div>
  );
    }
