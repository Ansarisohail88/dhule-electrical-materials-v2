export interface Material {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  size: string;
  specification: string;
  unit: string; // e.g. "Meter", "Pcs", "Box", "Coil", "Set", "Packet", "Kg", "Roll"
  hsnCode: string;
  gstPercent: number; // e.g. 18
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  discountPercent: number;
  stockQuantity: number;
  minStockQuantity: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  warranty: string;
  supplierName: string;
  supplierPhone: string;
  description: string;
  notes: string;
  imageUrl: string;
  barcode: string;
  qrCode: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isOffer: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  itemCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface QuoteItem {
  material: Material;
  quantity: number;
}

export interface QuoteRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  siteLocation: string;
  notes?: string;
  items: {
    materialId: string;
    materialName: string;
    brand: string;
    size: string;
    quantity: number;
    unit: string;
    unitPrice: number;
  }[];
  totalEstimate: number;
  status: 'Pending' | 'Contacted' | 'Quoted' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface MaterialFilters {
  search: string;
  category: string;
  brand: string;
  stockStatus: string;
  minPrice: number;
  maxPrice: number;
  badge: 'all' | 'featured' | 'bestseller' | 'new' | 'offer';
  sortBy: 'name' | 'priceAsc' | 'priceDesc' | 'discount' | 'stock';
}
