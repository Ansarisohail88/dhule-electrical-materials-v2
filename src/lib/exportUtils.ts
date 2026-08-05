import { Material } from '../types/material';

// Export materials to CSV file
export const exportMaterialsToCSV = (materials: Material[], filename = 'Electrical_Materials_Catalog.csv') => {
  const headers = [
    'ID',
    'Material Name',
    'Category',
    'Brand',
    'Model',
    'Size',
    'Specification',
    'Unit',
    'HSN Code',
    'GST %',
    'Purchase Price',
    'Selling Price',
    'MRP',
    'Discount %',
    'Stock Qty',
    'Min Stock Qty',
    'Stock Status',
    'Warranty',
    'Supplier Name',
    'Supplier Phone',
    'Barcode',
    'QR Code',
    'Active Status'
  ];

  const rows = materials.map(m => [
    `"${m.id}"`,
    `"${(m.name || '').replace(/"/g, '""')}"`,
    `"${(m.category || '').replace(/"/g, '""')}"`,
    `"${(m.brand || '').replace(/"/g, '""')}"`,
    `"${(m.model || '').replace(/"/g, '""')}"`,
    `"${(m.size || '').replace(/"/g, '""')}"`,
    `"${(m.specification || '').replace(/"/g, '""')}"`,
    `"${(m.unit || '').replace(/"/g, '""')}"`,
    `"${m.hsnCode || ''}"`,
    m.gstPercent || 0,
    m.purchasePrice || 0,
    m.sellingPrice || 0,
    m.mrp || 0,
    m.discountPercent || 0,
    m.stockQuantity || 0,
    m.minStockQuantity || 0,
    `"${m.stockStatus || 'In Stock'}"`,
    `"${(m.warranty || '').replace(/"/g, '""')}"`,
    `"${(m.supplierName || '').replace(/"/g, '""')}"`,
    `"${(m.supplierPhone || '').replace(/"/g, '""')}"`,
    `"${m.barcode || ''}"`,
    `"${m.qrCode || ''}"`,
    m.isActive ? 'Active' : 'Inactive'
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Import materials from CSV text
export const parseCSVToMaterials = (csvText: string): Partial<Material>[] => {
  const lines = csvText.split('\n').filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const results: Partial<Material>[] = [];
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Simple CSV parser supporting quotes
    const columns: string[] = [];
    let inQuotes = false;
    let colBuffer = '';

    for (let c = 0; c < rawLine.length; c++) {
      const char = rawLine[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        columns.push(colBuffer.trim().replace(/^"|"$/g, ''));
        colBuffer = '';
      } else {
        colBuffer += char;
      }
    }
    columns.push(colBuffer.trim().replace(/^"|"$/g, ''));

    if (columns.length >= 2 && columns[1]) {
      const name = columns[1] || 'Unnamed Material';
      const category = columns[2] || 'Other';
      const brand = columns[3] || 'Other';
      const model = columns[4] || '';
      const size = columns[5] || '';
      const specification = columns[6] || '';
      const unit = columns[7] || 'Pcs';
      const hsnCode = columns[8] || '';
      const gstPercent = parseFloat(columns[9]) || 18;
      const purchasePrice = parseFloat(columns[10]) || 0;
      const sellingPrice = parseFloat(columns[11]) || 0;
      const mrp = parseFloat(columns[12]) || sellingPrice;
      const discountPercent = parseFloat(columns[13]) || (mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0);
      const stockQuantity = parseInt(columns[14], 10) || 0;
      const minStockQuantity = parseInt(columns[15], 10) || 5;

      let stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
      if (stockQuantity <= 0) stockStatus = 'Out of Stock';
      else if (stockQuantity <= minStockQuantity) stockStatus = 'Low Stock';

      results.push({
        id: `mat-imp-${Date.now()}-${i}`,
        name,
        category,
        brand,
        model,
        size,
        specification,
        unit,
        hsnCode,
        gstPercent,
        purchasePrice,
        sellingPrice,
        mrp,
        discountPercent,
        stockQuantity,
        minStockQuantity,
        stockStatus,
        warranty: columns[17] || '1 Year',
        supplierName: columns[18] || '',
        supplierPhone: columns[19] || '',
        description: `${name} ${specification}`,
        notes: 'Imported via CSV batch',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
        barcode: columns[20] || '',
        qrCode: columns[21] || '',
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        isOffer: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return results;
};

// Print / PDF Report Generator
export const printMaterialPDFReport = (materials: Material[], title = 'Electrical Materials Stock Inventory Report') => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const totalStockVal = materials.reduce((acc, m) => acc + (m.sellingPrice * m.stockQuantity), 0);
  const totalCostVal = materials.reduce((acc, m) => acc + (m.purchasePrice * m.stockQuantity), 0);
  const lowStockCount = materials.filter(m => m.stockStatus === 'Low Stock').length;
  const outOfStockCount = materials.filter(m => m.stockStatus === 'Out of Stock').length;

  const rowsHtml = materials.map((m, idx) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${idx + 1}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">
        <strong>${m.name}</strong><br/>
        <small style="color: #666;">Brand: ${m.brand} | Size: ${m.size}</small>
      </td>
      <td style="padding: 8px; border: 1px solid #ddd;">${m.category}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${m.unit}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${m.sellingPrice.toLocaleString()}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${m.stockQuantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${(m.sellingPrice * m.stockQuantity).toLocaleString()}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
        <span style="padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background-color: ${
          m.stockStatus === 'In Stock' ? '#d1fae5; color: #065f46;' :
          m.stockStatus === 'Low Stock' ? '#fef3c7; color: #92400e;' : '#fee2e2; color: #991b1b;'
        }">
          ${m.stockStatus}
        </span>
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px; }
          .title { font-size: 22px; font-weight: bold; color: #0f172a; }
          .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
          .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
          .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; }
          .summary-card h4 { margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; }
          .summary-card p { margin: 4px 0 0 0; font-size: 18px; font-weight: bold; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { background-color: #f1f5f9; color: #334155; font-weight: bold; text-align: left; padding: 10px 8px; border: 1px solid #cbd5e1; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">⚡ Professional Electrician Materials</div>
            <div class="subtitle">${title} | Generated: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</div>
          </div>
          <button class="no-print" onclick="window.print()" style="padding: 8px 16px; background: #0284c7; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Print / Save PDF</button>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <h4>Total Items</h4>
            <p>${materials.length}</p>
          </div>
          <div class="summary-card">
            <h4>Total Stock Valuation</h4>
            <p>₹${totalStockVal.toLocaleString('en-IN')}</p>
          </div>
          <div class="summary-card">
            <h4>Low Stock Alerts</h4>
            <p style="color: #b45309;">${lowStockCount}</p>
          </div>
          <div class="summary-card">
            <h4>Out of Stock</h4>
            <p style="color: #dc2626;">${outOfStockCount}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">#</th>
              <th>Material Name & Specs</th>
              <th>Category</th>
              <th>Unit</th>
              <th style="text-align: right;">Selling Price</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Stock Value</th>
              <th style="text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
