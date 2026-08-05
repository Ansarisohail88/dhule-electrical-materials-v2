/**
 * VoltPro Electrical Materials Management System - Standalone Engine (materials.js)
 * Fully compatible with plain HTML, CSS, Vanilla JS, Firebase Firestore & Storage.
 */

// Global App State
let materials = [];
let categories = [];
let brands = [];
let quoteRequests = [];
let quoteBasket = [];
let selectedMaterialIds = [];

// Default Shop WhatsApp Number for customer inquiries & quotes
let SHOP_WHATSAPP_NUMBER = "919876543210"; 

// Initial Seed Categories
const SEED_CATEGORIES = [
  { id: 'cat-1', name: 'Wires & Cables' },
  { id: 'cat-2', name: 'Switches & Sockets' },
  { id: 'cat-3', name: 'MCBs & Protection' },
  { id: 'cat-4', name: 'Lighting & LEDs' },
  { id: 'cat-5', name: 'PVC Pipes & Conduits' },
  { id: 'cat-6', name: 'Distribution Boards' },
  { id: 'cat-7', name: 'Fans & Ventilation' },
  { id: 'cat-8', name: 'Inverters & Batteries' }
];

// Initial Seed Brands
const SEED_BRANDS = [
  { id: 'br-1', name: 'Polycab' },
  { id: 'br-2', name: 'Havells' },
  { id: 'br-3', name: 'Schneider Electric' },
  { id: 'br-4', name: 'Finolex' },
  { id: 'br-5', name: 'Philips' },
  { id: 'br-6', name: 'GM Modular' },
  { id: 'br-7', name: 'Legrand' },
  { id: 'br-8', name: 'Supreme' },
  { id: 'br-9', name: 'Luminous' },
  { id: 'br-10', name: 'Anchor Panasonic' }
];

// Initial Seed Products
const SEED_PRODUCTS = [
  {
    id: 'mat-101',
    name: '1.5 sq mm Flame Retardant (FR) Copper Wire - 90m Red',
    brand: 'Polycab',
    category: 'Wires & Cables',
    model: 'Optima FR',
    hsnCode: '8544',
    unit: 'Coil',
    costPrice: 1450,
    mrp: 2150,
    sellingPrice: 1720,
    discountPercent: 20,
    gstPercent: 18,
    stockQuantity: 45,
    minStockThreshold: 10,
    barcode: '8901234567891',
    warranty: '10 Years Replacement',
    description: 'High-purity electrolytic grade multi-strand copper wire with flame retardant PVC insulation for residential house wiring.',
    isOriginalISI: true,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mat-102',
    name: '2.5 sq mm Flame Retardant (FR) Copper Wire - 90m Blue',
    brand: 'Polycab',
    category: 'Wires & Cables',
    model: 'Optima FR',
    hsnCode: '8544',
    unit: 'Coil',
    costPrice: 2300,
    mrp: 3450,
    sellingPrice: 2760,
    discountPercent: 20,
    gstPercent: 18,
    stockQuantity: 28,
    minStockThreshold: 10,
    barcode: '8901234567892',
    warranty: '10 Years Replacement',
    description: 'Multi-strand electrical cable ideal for power sockets, air conditioners, heaters, and heavy power loads.',
    isOriginalISI: true,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mat-103',
    name: '16A Single Pole (SP) C-Curve MCB 10kA',
    brand: 'Schneider Electric',
    category: 'MCBs & Protection',
    model: 'Acti9 xC60',
    hsnCode: '8536',
    unit: 'Piece',
    costPrice: 220,
    mrp: 380,
    sellingPrice: 285,
    discountPercent: 25,
    gstPercent: 18,
    stockQuantity: 6,
    minStockThreshold: 15,
    barcode: '8901234567893',
    warranty: '2 Years Manufacturer Warranty',
    description: '10kA short circuit breaking capacity MCB offering reliable protection against electrical overload and short circuits.',
    isOriginalISI: true,
    stockStatus: 'Low Stock',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mat-104',
    name: '6A 1-Way Modular Switch White',
    brand: 'Havells',
    category: 'Switches & Sockets',
    model: 'Fabio',
    hsnCode: '8536',
    unit: 'Piece',
    costPrice: 35,
    mrp: 65,
    sellingPrice: 48,
    discountPercent: 26,
    gstPercent: 18,
    stockQuantity: 120,
    minStockThreshold: 20,
    barcode: '8901234567894',
    warranty: '10 Years Guarantee',
    description: 'Silent operation switch with silver cadmium oxide contacts for high electrical durability.',
    isOriginalISI: true,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mat-105',
    name: '15W Round COB Recessed LED Spotlight 3000K Warm White',
    brand: 'Philips',
    category: 'Lighting & LEDs',
    model: 'Meson',
    hsnCode: '9405',
    unit: 'Piece',
    costPrice: 480,
    mrp: 850,
    sellingPrice: 620,
    discountPercent: 27,
    gstPercent: 12,
    stockQuantity: 0,
    minStockThreshold: 10,
    barcode: '8901234567895',
    warranty: '2 Years Replacement',
    description: 'High-lumen glare-free LED downlight casing with surge protection for architectural ceilings.',
    isOriginalISI: true,
    stockStatus: 'Out of Stock',
    imageUrl: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80&w=600',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mat-106',
    name: '25mm Heavy Gauge PVC Rigid Conduit Pipe 3m Length',
    brand: 'Supreme',
    category: 'PVC Pipes & Conduits',
    model: 'Heavy Duty',
    hsnCode: '3917',
    unit: 'Length',
    costPrice: 85,
    mrp: 140,
    sellingPrice: 110,
    discountPercent: 21,
    gstPercent: 18,
    stockQuantity: 80,
    minStockThreshold: 20,
    barcode: '8901234567896',
    warranty: '5 Years Guarantee',
    description: 'High impact resistance unplasticized PVC conduit pipe for concealed wall and concrete slab wiring.',
    isOriginalISI: true,
    stockStatus: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// Calculate Stock Status helper
function calculateStockStatus(qty, threshold) {
  if (qty <= 0) return 'Out of Stock';
  if (qty <= threshold) return 'Low Stock';
  return 'In Stock';
}

// Data Storage Initialization & Syncing
function initMaterialsData() {
  // Load Materials
  const localMat = localStorage.getItem('voltpro_materials_db');
  if (localMat) {
    materials = JSON.parse(localMat);
  } else {
    materials = SEED_PRODUCTS;
    localStorage.setItem('voltpro_materials_db', JSON.stringify(materials));
  }

  // Load Categories
  const localCat = localStorage.getItem('voltpro_categories_db');
  if (localCat) {
    categories = JSON.parse(localCat);
  } else {
    categories = SEED_CATEGORIES;
    localStorage.setItem('voltpro_categories_db', JSON.stringify(categories));
  }

  // Load Brands
  const localBr = localStorage.getItem('voltpro_brands_db');
  if (localBr) {
    brands = JSON.parse(localBr);
  } else {
    brands = SEED_BRANDS;
    localStorage.setItem('voltpro_brands_db', JSON.stringify(brands));
  }

  // Load Quotes
  const localQuotes = localStorage.getItem('voltpro_quotes_db');
  if (localQuotes) {
    quoteRequests = JSON.parse(localQuotes);
  }

  // Try Syncing from Firestore if configured
  if (typeof db !== 'undefined' && db) {
    db.collection('materials').get().then(snapshot => {
      if (!snapshot.empty) {
        const firestoreMaterials = [];
        snapshot.forEach(doc => firestoreMaterials.push(doc.data()));
        materials = firestoreMaterials;
        localStorage.setItem('voltpro_materials_db', JSON.stringify(materials));
        renderMaterialsUI();
      }
    }).catch(err => console.log('Firestore fetch notice:', err));
  }

  renderMaterialsUI();
}

function saveMaterialsToStore() {
  localStorage.setItem('voltpro_materials_db', JSON.stringify(materials));

  // Sync to Firestore if online
  if (typeof db !== 'undefined' && db) {
    materials.forEach(m => {
      db.collection('materials').doc(m.id).set(m, { merge: true }).catch(e => console.error(e));
    });
  }

  renderMaterialsUI();
}

function saveCategoriesToStore() {
  localStorage.setItem('voltpro_categories_db', JSON.stringify(categories));
  populateFilterDropdowns();
}

function saveBrandsToStore() {
  localStorage.setItem('voltpro_brands_db', JSON.stringify(brands));
  populateFilterDropdowns();
}

function saveQuoteToStore(quoteObj) {
  quoteRequests.unshift(quoteObj);
  localStorage.setItem('voltpro_quotes_db', JSON.stringify(quoteRequests));

  if (typeof db !== 'undefined' && db) {
    db.collection('quote_requests').doc(quoteObj.id).set(quoteObj).catch(e => console.error(e));
  }
}

// UI RENDERING FUNCTIONS
function renderMaterialsUI() {
  populateFilterDropdowns();
  renderCatalogGrid();
  renderAdminTable();
  updateMetrics();
  updateQuoteBadge();
}

function populateFilterDropdowns() {
  const catSelect = document.getElementById('filter-category');
  const catFormSelect = document.getElementById('form-category');
  if (catSelect) {
    const currentVal = catSelect.value;
    catSelect.innerHTML = `<option value="all">📁 All Categories (${categories.length})</option>` +
      categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    catSelect.value = currentVal || 'all';
  }

  if (catFormSelect) {
    catFormSelect.innerHTML = categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  }

  const brandSelect = document.getElementById('filter-brand');
  const brandFormSelect = document.getElementById('form-brand');
  if (brandSelect) {
    const currentVal = brandSelect.value;
    brandSelect.innerHTML = `<option value="all">🏭 All Brands (${brands.length})</option>` +
      brands.map(b => `<option value="${b.name}">${b.name}</option>`).join('');
    brandSelect.value = currentVal || 'all';
  }

  if (brandFormSelect) {
    brandFormSelect.innerHTML = brands.map(b => `<option value="${b.name}">${b.name}</option>`).join('');
  }
}

function updateMetrics() {
  const totalCount = materials.length;
  const activeCount = materials.filter(m => m.isActive).length;
  const lowStockCount = materials.filter(m => m.stockStatus === 'Low Stock').length;
  const outOfStockCount = materials.filter(m => m.stockStatus === 'Out of Stock').length;
  const valuation = materials.reduce((sum, m) => sum + (m.sellingPrice * m.stockQuantity), 0);

  const elTotal = document.getElementById('stat-total-items');
  const elLow = document.getElementById('stat-low-stock');
  const elOut = document.getElementById('stat-out-stock');
  const elVal = document.getElementById('stat-valuation');

  if (elTotal) elTotal.innerText = totalCount;
  if (elLow) elLow.innerText = lowStockCount;
  if (elOut) elOut.innerText = outOfStockCount;
  if (elVal) elVal.innerText = `₹${(valuation / 1000).toFixed(1)}k`;
}

// Customer Catalog View
function renderCatalogGrid() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  const searchQuery = (document.getElementById('search-input')?.value || '').toLowerCase();
  const categoryFilter = document.getElementById('filter-category')?.value || 'all';
  const brandFilter = document.getElementById('filter-brand')?.value || 'all';
  const stockFilter = document.getElementById('filter-stock')?.value || 'all';
  const sortOption = document.getElementById('sort-option')?.value || 'newest';

  let list = materials.filter(m => m.isActive);

  // Search Filter
  if (searchQuery) {
    list = list.filter(m => 
      m.name.toLowerCase().includes(searchQuery) ||
      m.brand.toLowerCase().includes(searchQuery) ||
      m.category.toLowerCase().includes(searchQuery) ||
      (m.model || '').toLowerCase().includes(searchQuery) ||
      (m.hsnCode || '').toLowerCase().includes(searchQuery) ||
      (m.barcode || '').toLowerCase().includes(searchQuery)
    );
  }

  // Category Filter
  if (categoryFilter !== 'all') {
    list = list.filter(m => m.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  // Brand Filter
  if (brandFilter !== 'all') {
    list = list.filter(m => m.brand.toLowerCase() === brandFilter.toLowerCase());
  }

  // Stock Status Filter
  if (stockFilter !== 'all') {
    list = list.filter(m => m.stockStatus.toLowerCase() === stockFilter.toLowerCase());
  }

  // Sorting
  if (sortOption === 'price-low') {
    list.sort((a, b) => a.sellingPrice - b.sellingPrice);
  } else if (sortOption === 'price-high') {
    list.sort((a, b) => b.sellingPrice - a.sellingPrice);
  } else if (sortOption === 'name-az') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'discount-high') {
    list.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
        <p class="text-base font-bold text-slate-600">No materials match your filter criteria.</p>
        <p class="text-xs mt-1 text-slate-400">Try clearing filters or search query.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(m => {
    const statusBadgeClass = m.stockStatus === 'In Stock' ? 'badge-in-stock' :
                             m.stockStatus === 'Low Stock' ? 'badge-low-stock' : 'badge-out-of-stock';
    return `
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm material-card flex flex-col justify-between">
        <div>
          <div class="relative aspect-[4/3] bg-slate-100 overflow-hidden">
            <img src="${m.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'}" alt="${m.name}" class="w-full h-full object-cover">
            <div class="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase ${statusBadgeClass}">
                ${m.stockStatus}
              </span>
              ${m.isOriginalISI ? `<span class="px-2 py-0.5 rounded text-[10px] font-black uppercase badge-isi">✓ 100% Original ISI</span>` : ''}
            </div>
            ${m.discountPercent > 0 ? `
              <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px]">
                ${m.discountPercent}% OFF
              </span>
            ` : ''}
          </div>

          <div class="p-4 space-y-2">
            <div class="flex justify-between items-center text-[10px] text-slate-500 font-bold">
              <span class="text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">${m.brand}</span>
              <span>HSN: ${m.hsnCode || 'N/A'}</span>
            </div>

            <h3 class="font-bold text-slate-900 text-sm leading-snug line-clamp-2">${m.name}</h3>
            
            <p class="text-xs text-slate-500 line-clamp-2">${m.description || 'Professional grade electrical material.'}</p>
            
            <div class="text-[11px] text-slate-500 space-y-0.5 pt-1">
              <div>Unit: <span class="font-bold text-slate-700">${m.unit}</span> ${m.model ? `| Model: <span class="font-bold text-slate-700">${m.model}</span>` : ''}</div>
              <div>Warranty: <span class="font-bold text-slate-700">${m.warranty || 'Standard'}</span> | GST: <span class="font-bold text-slate-700">${m.gstPercent}%</span></div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <div class="flex items-baseline justify-between">
            <div>
              <span class="text-lg font-black text-slate-900">₹${m.sellingPrice.toLocaleString()}</span>
              ${m.mrp > m.sellingPrice ? `<span class="text-xs text-slate-400 line-through ml-1.5">₹${m.mrp.toLocaleString()}</span>` : ''}
              <span class="text-[10px] text-slate-400 block font-normal">Per ${m.unit} (incl. ${m.gstPercent}% GST)</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button onclick="openWhatsAppInquiry('${m.id}')" class="w-full py-2 px-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors">
              💬 WhatsApp
            </button>
            <button onclick="addToQuoteBasketById('${m.id}')" class="w-full py-2 px-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs rounded-xl transition-colors">
              + Quote Basket
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Admin Materials Table View
function renderAdminTable() {
  const tbody = document.getElementById('admin-table-body');
  if (!tbody) return;

  const searchQuery = (document.getElementById('admin-search-input')?.value || '').toLowerCase();

  let list = materials;
  if (searchQuery) {
    list = list.filter(m => 
      m.name.toLowerCase().includes(searchQuery) ||
      m.brand.toLowerCase().includes(searchQuery) ||
      m.category.toLowerCase().includes(searchQuery) ||
      (m.hsnCode || '').toLowerCase().includes(searchQuery)
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-slate-400">No materials match your inventory query.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(m => {
    const isSelected = selectedMaterialIds.includes(m.id);
    const statusClass = m.stockStatus === 'In Stock' ? 'badge-in-stock' :
                        m.stockStatus === 'Low Stock' ? 'badge-low-stock' : 'badge-out-of-stock';

    return `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="p-3 text-center">
          <input type="checkbox" onchange="toggleSelectMaterial('${m.id}')" ${isSelected ? 'checked' : ''} class="rounded text-amber-500 w-4 h-4">
        </td>

        <td class="p-3">
          <div class="flex items-center gap-2.5">
            <img src="${m.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'}" alt="" class="w-10 h-10 rounded-lg object-cover border border-slate-200">
            <div>
              <span class="font-bold text-slate-900 block leading-tight text-xs">${m.name}</span>
              <span class="text-[10px] text-slate-400">HSN: ${m.hsnCode || 'N/A'} | Code: ${m.barcode || 'N/A'}</span>
            </div>
          </div>
        </td>

        <td class="p-3 text-xs font-semibold text-slate-700">${m.category}</td>
        <td class="p-3 text-xs font-bold text-slate-900">${m.brand}</td>

        <td class="p-3 text-right text-xs">
          <span class="font-bold text-slate-900 block">₹${m.sellingPrice}</span>
          <span class="text-[10px] text-slate-400">MRP: ₹${m.mrp} | Cost: ₹${m.costPrice || 0}</span>
        </td>

        <td class="p-3 text-center text-xs font-bold">
          ${m.stockQuantity} ${m.unit}
        </td>

        <td class="p-3 text-center">
          <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase ${statusClass}">
            ${m.stockStatus}
          </span>
        </td>

        <td class="p-3 text-center">
          <input type="checkbox" onchange="toggleActiveStatus('${m.id}')" ${m.isActive ? 'checked' : ''} class="w-4 h-4 text-emerald-600 rounded">
        </td>

        <td class="p-3 text-right space-x-1 whitespace-nowrap">
          <button onclick="openEditMaterialModal('${m.id}')" class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold" title="Edit">✏️</button>
          <button onclick="duplicateMaterial('${m.id}')" class="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold" title="Duplicate">📋</button>
          <button onclick="deleteMaterialPrompt('${m.id}')" class="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold" title="Delete">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Checkbox and Bulk Actions
function toggleSelectAllMaterials(e) {
  if (e.target.checked) {
    selectedMaterialIds = materials.map(m => m.id);
  } else {
    selectedMaterialIds = [];
  }
  renderAdminTable();
  updateBulkActionBar();
}

function toggleSelectMaterial(id) {
  if (selectedMaterialIds.includes(id)) {
    selectedMaterialIds = selectedMaterialIds.filter(i => i !== id);
  } else {
    selectedMaterialIds.push(id);
  }
  updateBulkActionBar();
}

function updateBulkActionBar() {
  const bar = document.getElementById('bulk-action-bar');
  const countEl = document.getElementById('bulk-selected-count');
  if (bar && countEl) {
    if (selectedMaterialIds.length > 0) {
      countEl.innerText = selectedMaterialIds.length;
      bar.classList.remove('hidden');
    } else {
      bar.classList.add('hidden');
    }
  }
}

function bulkDeleteMaterials() {
  if (!confirm(`Are you sure you want to delete ${selectedMaterialIds.length} selected materials?`)) return;
  materials = materials.filter(m => !selectedMaterialIds.includes(m.id));
  selectedMaterialIds = [];
  saveMaterialsToStore();
  updateBulkActionBar();
}

function bulkUpdatePrices() {
  const percentStr = prompt("Enter percentage adjustment (e.g., +10 for 10% price hike, -5 for 5% discount):");
  if (!percentStr) return;
  const pct = parseFloat(percentStr);
  if (isNaN(pct)) {
    alert("Invalid percentage entered.");
    return;
  }

  materials = materials.map(m => {
    if (selectedMaterialIds.includes(m.id)) {
      const newPrice = Math.round(m.sellingPrice * (1 + pct / 100));
      return { ...m, sellingPrice: newPrice };
    }
    return m;
  });

  saveMaterialsToStore();
  alert(`Updated selling prices for ${selectedMaterialIds.length} items!`);
}

// Active Toggle
function toggleActiveStatus(id) {
  materials = materials.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m);
  saveMaterialsToStore();
}

// Delete Single Material
function deleteMaterialPrompt(id) {
  if (confirm('Delete this material permanently from database?')) {
    materials = materials.filter(m => m.id !== id);
    selectedMaterialIds = selectedMaterialIds.filter(i => i !== id);
    saveMaterialsToStore();
  }
}

// Duplicate Material
function duplicateMaterial(id) {
  const item = materials.find(m => m.id === id);
  if (!item) return;

  const copy = {
    ...item,
    id: 'mat-' + Date.now(),
    name: item.name + ' (Copy)',
    createdAt: new Date().toISOString()
  };

  materials.unshift(copy);
  saveMaterialsToStore();
  alert(`Duplicated "${item.name}"!`);
}

// Add/Edit Modal Handlers
function openAddMaterialModal() {
  document.getElementById('form-material-id').value = '';
  document.getElementById('form-title').innerText = '⚡ Add New Electrical Material';
  document.getElementById('material-form').reset();
  document.getElementById('image-preview').src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600';
  document.getElementById('material-modal').classList.remove('hidden');
}

function openEditMaterialModal(id) {
  const m = materials.find(item => item.id === id);
  if (!m) return;

  document.getElementById('form-material-id').value = m.id;
  document.getElementById('form-title').innerText = '⚡ Edit Electrical Material';
  document.getElementById('form-name').value = m.name;
  document.getElementById('form-category').value = m.category;
  document.getElementById('form-brand').value = m.brand;
  document.getElementById('form-model').value = m.model || '';
  document.getElementById('form-hsn').value = m.hsnCode || '';
  document.getElementById('form-unit').value = m.unit || 'Piece';
  document.getElementById('form-cost').value = m.costPrice || 0;
  document.getElementById('form-mrp').value = m.mrp || 0;
  document.getElementById('form-price').value = m.sellingPrice || 0;
  document.getElementById('form-gst').value = m.gstPercent || 18;
  document.getElementById('form-stock').value = m.stockQuantity || 0;
  document.getElementById('form-threshold').value = m.minStockThreshold || 5;
  document.getElementById('form-barcode').value = m.barcode || '';
  document.getElementById('form-warranty').value = m.warranty || '1 Year Manufacturer';
  document.getElementById('form-description').value = m.description || '';
  document.getElementById('form-isi').checked = !!m.isOriginalISI;
  document.getElementById('form-image-url').value = m.imageUrl || '';
  document.getElementById('image-preview').src = m.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600';

  document.getElementById('material-modal').classList.remove('hidden');
}

function closeMaterialModal() {
  document.getElementById('material-modal').classList.add('hidden');
}

// Handle Form Submission
function handleMaterialFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('form-material-id').value;
  const name = document.getElementById('form-name').value;
  const category = document.getElementById('form-category').value;
  const brand = document.getElementById('form-brand').value;
  const model = document.getElementById('form-model').value;
  const hsnCode = document.getElementById('form-hsn').value;
  const unit = document.getElementById('form-unit').value;
  const costPrice = parseFloat(document.getElementById('form-cost').value) || 0;
  const mrp = parseFloat(document.getElementById('form-mrp').value) || 0;
  const sellingPrice = parseFloat(document.getElementById('form-price').value) || 0;
  const gstPercent = parseFloat(document.getElementById('form-gst').value) || 18;
  const stockQuantity = parseInt(document.getElementById('form-stock').value) || 0;
  const minStockThreshold = parseInt(document.getElementById('form-threshold').value) || 5;
  const barcode = document.getElementById('form-barcode').value;
  const warranty = document.getElementById('form-warranty').value;
  const description = document.getElementById('form-description').value;
  const isOriginalISI = document.getElementById('form-isi').checked;
  const imageUrl = document.getElementById('form-image-url').value || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600';

  const discountPercent = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const stockStatus = calculateStockStatus(stockQuantity, minStockThreshold);

  if (id) {
    // Update
    materials = materials.map(m => m.id === id ? {
      ...m, name, category, brand, model, hsnCode, unit, costPrice, mrp, sellingPrice,
      discountPercent, gstPercent, stockQuantity, minStockThreshold, barcode, warranty,
      description, isOriginalISI, stockStatus, imageUrl
    } : m);
  } else {
    // Create
    const newMaterial = {
      id: 'mat-' + Date.now(),
      name, category, brand, model, hsnCode, unit, costPrice, mrp, sellingPrice,
      discountPercent, gstPercent, stockQuantity, minStockThreshold, barcode, warranty,
      description, isOriginalISI, stockStatus, imageUrl, isActive: true,
      createdAt: new Date().toISOString()
    };
    materials.unshift(newMaterial);
  }

  saveMaterialsToStore();
  closeMaterialModal();
  alert('Material saved successfully!');
}

// Image File Upload Handler (Convert to Base64 or preview)
function handleImageFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const dataUrl = evt.target.result;
    document.getElementById('form-image-url').value = dataUrl;
    document.getElementById('image-preview').src = dataUrl;
  };
  reader.readAsDataURL(file);
}

// CUSTOMER FEATURES: WHATSAPP INQUIRY
function openWhatsAppInquiry(materialId) {
  const m = materials.find(item => item.id === materialId);
  if (!m) return;

  const msg = `Hello VoltPro Electrical! I am interested in purchasing:\n\n` +
    `*${m.name}*\n` +
    `• Brand: ${m.brand}\n` +
    `• Category: ${m.category}\n` +
    `• Model: ${m.model || 'Standard'}\n` +
    `• Selling Price: ₹${m.sellingPrice} per ${m.unit}\n` +
    `• Warranty: ${m.warranty}\n\n` +
    `Please share stock availability and delivery timeframe to my site. Thank you!`;

  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
}

// QUOTE BASKET MANAGEMENT
function addToQuoteBasketById(id) {
  const m = materials.find(item => item.id === id);
  if (!m) return;

  const existing = quoteBasket.find(i => i.material.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    quoteBasket.push({ material: m, quantity: 1 });
  }

  updateQuoteBadge();
  alert(`Added "${m.name}" to your Quote Basket!`);
}

function updateQuoteBadge() {
  const badge = document.getElementById('quote-count-badge');
  if (badge) {
    badge.innerText = quoteBasket.length;
    if (quoteBasket.length > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
}

function openQuoteBasketModal() {
  const listEl = document.getElementById('quote-basket-items');
  const totalEl = document.getElementById('quote-basket-total');
  if (!listEl) return;

  if (quoteBasket.length === 0) {
    listEl.innerHTML = `<p class="text-center py-8 text-slate-400 text-xs">Your Quote Basket is empty. Browse materials to add items.</p>`;
    if (totalEl) totalEl.innerText = '₹0';
  } else {
    let total = 0;
    listEl.innerHTML = quoteBasket.map((item, idx) => {
      const lineTotal = item.material.sellingPrice * item.quantity;
      total += lineTotal;
      return `
        <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div class="flex-1 pr-2">
            <span class="font-bold text-slate-900 block leading-tight">${item.material.name}</span>
            <span class="text-[10px] text-amber-600 font-bold">${item.material.brand} • ₹${item.material.sellingPrice} / ${item.material.unit}</span>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="changeQuoteQty(${idx}, -1)" class="w-6 h-6 rounded bg-slate-200 font-bold text-slate-700">-</button>
            <span class="font-black text-slate-900 w-5 text-center">${item.quantity}</span>
            <button onclick="changeQuoteQty(${idx}, 1)" class="w-6 h-6 rounded bg-slate-200 font-bold text-slate-700">+</button>
            <span class="font-bold text-slate-900 w-16 text-right">₹${lineTotal}</span>
            <button onclick="removeQuoteItem(${idx})" class="text-rose-600 font-bold ml-1">✕</button>
          </div>
        </div>
      `;
    }).join('');

    if (totalEl) totalEl.innerText = `₹${total.toLocaleString()}`;
  }

  document.getElementById('quote-basket-modal').classList.remove('hidden');
}

function closeQuoteBasketModal() {
  document.getElementById('quote-basket-modal').classList.add('hidden');
}

function changeQuoteQty(index, delta) {
  if (quoteBasket[index]) {
    quoteBasket[index].quantity += delta;
    if (quoteBasket[index].quantity <= 0) {
      quoteBasket.splice(index, 1);
    }
  }
  updateQuoteBadge();
  openQuoteBasketModal();
}

function removeQuoteItem(index) {
  quoteBasket.splice(index, 1);
  updateQuoteBadge();
  openQuoteBasketModal();
}

function submitQuoteRequest(e) {
  e.preventDefault();
  if (quoteBasket.length === 0) {
    alert('Please add materials to your quote basket first!');
    return;
  }

  const name = document.getElementById('quote-cust-name').value;
  const phone = document.getElementById('quote-cust-phone').value;
  const site = document.getElementById('quote-cust-site').value;

  const totalEstimate = quoteBasket.reduce((sum, item) => sum + (item.material.sellingPrice * item.quantity), 0);

  const quoteObj = {
    id: 'quote-' + Date.now(),
    customerName: name,
    customerPhone: phone,
    siteLocation: site,
    items: quoteBasket.map(i => ({
      materialName: i.material.name,
      brand: i.material.brand,
      quantity: i.quantity,
      unitPrice: i.material.sellingPrice
    })),
    totalEstimate,
    createdAt: new Date().toISOString()
  };

  saveQuoteToStore(quoteObj);

  // Pre-fill WhatsApp Quote Text
  const itemsText = quoteBasket.map(i => `• ${i.material.name} (${i.material.brand}) x ${i.quantity} ${i.material.unit} = ₹${i.material.sellingPrice * i.quantity}`).join('\n');
  const msg = `⚡ *VoltPro Site Quote Request*\n\n` +
    `• Customer Name: *${name}*\n` +
    `• Phone: ${phone}\n` +
    `• Site Location: ${site}\n\n` +
    `*Requested Materials List:*\n${itemsText}\n\n` +
    `*Estimated Total: ₹${totalEstimate.toLocaleString()}*\n\n` +
    `Please review this Bill of Quantities (BOQ) and send us formal trade discount quotation.`;

  quoteBasket = [];
  updateQuoteBadge();
  closeQuoteBasketModal();

  alert(`Quote Request Submitted! Total Estimate: ₹${totalEstimate.toLocaleString()}`);

  const sendWA = confirm("Would you also like to send this Bill of Quantities directly to our team via WhatsApp?");
  if (sendWA) {
    window.open(`https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  }
}

// IMPORT / EXPORT CSV & PDF
function exportMaterialsCSV() {
  if (materials.length === 0) return alert("No materials to export.");

  const headers = ['ID', 'Name', 'Category', 'Brand', 'Model', 'HSN Code', 'Unit', 'Cost Price', 'MRP', 'Selling Price', 'Discount %', 'GST %', 'Stock Quantity', 'Status', 'Barcode', 'Warranty', 'ISI Original'];
  const rows = materials.map(m => [
    `"${m.id}"`,
    `"${m.name.replace(/"/g, '""')}"`,
    `"${m.category}"`,
    `"${m.brand}"`,
    `"${m.model || ''}"`,
    `"${m.hsnCode || ''}"`,
    `"${m.unit}"`,
    m.costPrice || 0,
    m.mrp || 0,
    m.sellingPrice || 0,
    m.discountPercent || 0,
    m.gstPercent || 18,
    m.stockQuantity || 0,
    `"${m.stockStatus}"`,
    `"${m.barcode || ''}"`,
    `"${m.warranty || ''}"`,
    m.isOriginalISI ? 'TRUE' : 'FALSE'
  ]);

  const csv = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encoded = encodeURI(csv);
  const link = document.createElement("a");
  link.setAttribute("href", encoded);
  link.setAttribute("download", `VoltPro_Materials_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function handleCSVImport(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const text = evt.target.result;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length <= 1) return alert("Empty or invalid CSV file.");

      let addedCount = 0;
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, ''));
        if (cols.length >= 4) {
          const name = cols[1] || cols[0];
          const category = cols[2] || 'Wires & Cables';
          const brand = cols[3] || 'Polycab';
          const sellingPrice = parseFloat(cols[9] || cols[4]) || 100;
          const mrp = parseFloat(cols[8]) || sellingPrice * 1.2;

          materials.unshift({
            id: 'mat-' + Date.now() + '-' + i,
            name, category, brand, model: cols[4] || 'Standard',
            hsnCode: cols[5] || '8544', unit: cols[6] || 'Piece',
            costPrice: parseFloat(cols[7]) || sellingPrice * 0.8, mrp, sellingPrice,
            discountPercent: 15, gstPercent: 18, stockQuantity: parseInt(cols[12]) || 20,
            minStockThreshold: 5, barcode: cols[14] || '', warranty: '1 Year',
            description: name, isOriginalISI: true, stockStatus: 'In Stock',
            imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
            isActive: true, createdAt: new Date().toISOString()
          });
          addedCount++;
        }
      }

      saveMaterialsToStore();
      alert(`Successfully imported ${addedCount} electrical materials from CSV!`);
    } catch (err) {
      alert("Error parsing CSV file format.");
    }
  };
  reader.readAsText(file);
}

function printPDFReport() {
  const printWin = window.open('', '_blank');
  if (!printWin) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>VoltPro Electrical Inventory Report</title>
        <style>
          body { font-family: sans-serif; padding: 20px; font-size: 12px; }
          h1 { color: #f59e0b; margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
          th { background: #0f172a; color: white; }
          .price { text-align: right; font-weight: bold; }
          .center { text-align: center; }
        </style>
      </head>
      <body>
        <h1>⚡ VoltPro Electrical Materials Price List</h1>
        <p>Report Date: ${new Date().toLocaleString()} | Total Items: ${materials.length}</p>
        <table>
          <thead>
            <tr>
              <th>Material Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>HSN</th>
              <th>Unit</th>
              <th class="price">Selling Price</th>
              <th class="center">Stock</th>
              <th class="center">Status</th>
            </tr>
          </thead>
          <tbody>
            ${materials.map(m => `
              <tr>
                <td><strong>${m.name}</strong><br><small>${m.model || ''}</small></td>
                <td>${m.category}</td>
                <td>${m.brand}</td>
                <td>${m.hsnCode || '-'}</td>
                <td>${m.unit}</td>
                <td class="price">₹${m.sellingPrice}</td>
                <td class="center">${m.stockQuantity}</td>
                <td class="center">${m.stockStatus}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>window.onload = function() { window.print(); }</script>
      </body>
    </html>
  `;

  printWin.document.write(html);
  printWin.document.close();
}

// TOGGLE ADMIN & CUSTOMER VIEWS
function toggleAdminView(showAdmin) {
  const adminSec = document.getElementById('admin-section');
  const catalogSec = document.getElementById('catalog-section');
  if (showAdmin) {
    if (adminSec) adminSec.classList.remove('hidden');
    if (catalogSec) catalogSec.classList.add('hidden');
  } else {
    if (adminSec) adminSec.classList.add('hidden');
    if (catalogSec) catalogSec.classList.remove('hidden');
  }
}

// Category & Brand Modal Managers
function addCategoryPrompt() {
  const name = prompt("Enter New Material Category Name:");
  if (name && !categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
    categories.push({ id: 'cat-' + Date.now(), name });
    saveCategoriesToStore();
    alert(`Category "${name}" added!`);
  }
}

function addBrandPrompt() {
  const name = prompt("Enter New Electrical Brand Name:");
  if (name && !brands.some(b => b.name.toLowerCase() === name.toLowerCase())) {
    brands.push({ id: 'br-' + Date.now(), name });
    saveBrandsToStore();
    alert(`Brand "${name}" added!`);
  }
}

// Boot Page
document.addEventListener('DOMContentLoaded', () => {
  initMaterialsData();
  console.log("⚡ VoltPro Materials Management System initialized.");
});
