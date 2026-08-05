import { Material, Category, Brand, QuoteRequest } from '../types/material';
import { DEFAULT_MATERIALS, DEFAULT_CATEGORIES, DEFAULT_BRANDS } from '../data/defaultMaterials';

const KEYS = {
  MATERIALS: 'eletrician_materials_v1',
  CATEGORIES: 'eletrician_categories_v1',
  BRANDS: 'eletrician_brands_v1',
  QUOTES: 'eletrician_quotes_v1',
};

// Dispatch custom event to notify components across the app
const notifyChange = (eventName: string) => {
  window.dispatchEvent(new Event(eventName));
};

export const getStoredMaterials = (): Material[] => {
  try {
    const data = localStorage.getItem(KEYS.MATERIALS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading materials from localStorage', e);
  }
  // Initialize default seed
  localStorage.setItem(KEYS.MATERIALS, JSON.stringify(DEFAULT_MATERIALS));
  return DEFAULT_MATERIALS;
};

export const saveMaterial = (material: Material): Material => {
  const list = getStoredMaterials();
  const index = list.findIndex(m => m.id === material.id);
  const now = new Date().toISOString();
  
  // Recalculate stock status automatically based on quantity vs min quantity
  let stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = material.stockStatus;
  if (material.stockQuantity <= 0) {
    stockStatus = 'Out of Stock';
  } else if (material.stockQuantity <= material.minStockQuantity) {
    stockStatus = 'Low Stock';
  } else {
    stockStatus = 'In Stock';
  }

  const updatedMaterial: Material = {
    ...material,
    stockStatus,
    updatedAt: now,
  };

  if (index >= 0) {
    list[index] = updatedMaterial;
  } else {
    list.unshift(updatedMaterial);
  }

  localStorage.setItem(KEYS.MATERIALS, JSON.stringify(list));
  notifyChange('materials-updated');
  return updatedMaterial;
};

export const deleteMaterial = (id: string): void => {
  const list = getStoredMaterials().filter(m => m.id !== id);
  localStorage.setItem(KEYS.MATERIALS, JSON.stringify(list));
  notifyChange('materials-updated');
};

export const duplicateMaterial = (id: string): Material | null => {
  const list = getStoredMaterials();
  const source = list.find(m => m.id === id);
  if (!source) return null;

  const now = new Date().toISOString();
  const newMaterial: Material = {
    ...source,
    id: `mat-${Date.now()}`,
    name: `${source.name} (Copy)`,
    barcode: `${source.barcode ? source.barcode + '-COPY' : ''}`,
    createdAt: now,
    updatedAt: now,
  };

  list.unshift(newMaterial);
  localStorage.setItem(KEYS.MATERIALS, JSON.stringify(list));
  notifyChange('materials-updated');
  return newMaterial;
};

export const bulkDeleteMaterials = (ids: string[]): void => {
  const list = getStoredMaterials().filter(m => !ids.includes(m.id));
  localStorage.setItem(KEYS.MATERIALS, JSON.stringify(list));
  notifyChange('materials-updated');
};

export const bulkUpdateMaterials = (ids: string[], updates: Partial<Material>): void => {
  const list = getStoredMaterials().map(item => {
    if (ids.includes(item.id)) {
      const merged = { ...item, ...updates, updatedAt: new Date().toISOString() };
      if (typeof merged.stockQuantity === 'number' && typeof merged.minStockQuantity === 'number') {
        if (merged.stockQuantity <= 0) merged.stockStatus = 'Out of Stock';
        else if (merged.stockQuantity <= merged.minStockQuantity) merged.stockStatus = 'Low Stock';
        else merged.stockStatus = 'In Stock';
      }
      return merged;
    }
    return item;
  });
  localStorage.setItem(KEYS.MATERIALS, JSON.stringify(list));
  notifyChange('materials-updated');
};

export const bulkUpdatePricesPercent = (ids: string[], percentChange: number, isDiscountUpdate = false): void => {
  const list = getStoredMaterials().map(item => {
    if (ids.includes(item.id)) {
      if (isDiscountUpdate) {
        const newDiscount = Math.max(0, Math.min(100, percentChange));
        const newSelling = Math.round(item.mrp * (1 - newDiscount / 100));
        return {
          ...item,
          discountPercent: newDiscount,
          sellingPrice: newSelling,
          updatedAt: new Date().toISOString(),
        };
      } else {
        const multiplier = 1 + percentChange / 100;
        const newSelling = Math.round(item.sellingPrice * multiplier);
        const newMrp = Math.round(item.mrp * multiplier);
        const newPurchase = Math.round(item.purchasePrice * multiplier);
        return {
          ...item,
          sellingPrice: newSelling,
          mrp: newMrp,
          purchasePrice: newPurchase,
          updatedAt: new Date().toISOString(),
        };
      }
    }
    return item;
  });
  localStorage.setItem(KEYS.MATERIALS, JSON.stringify(list));
  notifyChange('materials-updated');
};

// --- CATEGORIES ---
export const getStoredCategories = (): Category[] => {
  try {
    const data = localStorage.getItem(KEYS.CATEGORIES);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading categories from localStorage', e);
  }
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  return DEFAULT_CATEGORIES;
};

export const saveCategory = (name: string): Category => {
  const list = getStoredCategories();
  const existing = list.find(c => c.name.toLowerCase() === name.trim().toLowerCase());
  if (existing) return existing;

  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: name.trim(),
    icon: 'Package',
  };
  list.push(newCat);
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(list));
  notifyChange('categories-updated');
  return newCat;
};

export const deleteCategory = (id: string): void => {
  const list = getStoredCategories().filter(c => c.id !== id);
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(list));
  notifyChange('categories-updated');
};

// --- BRANDS ---
export const getStoredBrands = (): Brand[] => {
  try {
    const data = localStorage.getItem(KEYS.BRANDS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading brands from localStorage', e);
  }
  localStorage.setItem(KEYS.BRANDS, JSON.stringify(DEFAULT_BRANDS));
  return DEFAULT_BRANDS;
};

export const saveBrand = (name: string): Brand => {
  const list = getStoredBrands();
  const existing = list.find(b => b.name.toLowerCase() === name.trim().toLowerCase());
  if (existing) return existing;

  const newBrand: Brand = {
    id: `brand-${Date.now()}`,
    name: name.trim(),
  };
  list.push(newBrand);
  localStorage.setItem(KEYS.BRANDS, JSON.stringify(list));
  notifyChange('brands-updated');
  return newBrand;
};

export const deleteBrand = (id: string): void => {
  const list = getStoredBrands().filter(b => b.id !== id);
  localStorage.setItem(KEYS.BRANDS, JSON.stringify(list));
  notifyChange('brands-updated');
};

// --- QUOTE REQUESTS ---
export const getStoredQuotes = (): QuoteRequest[] => {
  try {
    const data = localStorage.getItem(KEYS.QUOTES);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Error reading quotes', e);
  }
  return [];
};

export const saveQuoteRequest = (quote: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>): QuoteRequest => {
  const quotes = getStoredQuotes();
  const newQuote: QuoteRequest = {
    ...quote,
    id: `quote-${Date.now()}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  quotes.unshift(newQuote);
  localStorage.setItem(KEYS.QUOTES, JSON.stringify(quotes));
  notifyChange('quotes-updated');
  return newQuote;
};

export const updateQuoteStatus = (id: string, status: QuoteRequest['status']): void => {
  const quotes = getStoredQuotes().map(q => q.id === id ? { ...q, status } : q);
  localStorage.setItem(KEYS.QUOTES, JSON.stringify(quotes));
  notifyChange('quotes-updated');
};
