'use client';

import React from 'react';
import styles from './inventory.module.css';
import Button from '@/components/common/Button';

// Mock Data untuk Barang Bangunan
const inventoryData = [
  { id: 1, sku: 'SPR-001', name: 'Semen Tiga Roda', category: 'Semen', stock: 120, unit: 'Sak', price: 'Rp 65.000' },
  { id: 2, sku: 'BST-010', name: 'Besi Beton 10mm', category: 'Besi', stock: 45, unit: 'Lonjor', price: 'Rp 88.000' },
  { id: 3, sku: 'PVC-003', name: 'Pipa PVC 3 inch', category: 'Pipa', stock: 15, unit: 'Batang', price: 'Rp 45.000' },
  { id: 4, sku: 'CAT-D5K', name: 'Cat Dulux Putih 5kg', category: 'Cat', stock: 8, unit: 'Pail', price: 'Rp 210.000' },
  { id: 5, sku: 'PSR-B01', name: 'Pasir Beton', category: 'Pasir', stock: 4, unit: 'Pick Up', price: 'Rp 750.000' },
  { id: 6, sku: 'KYU-612', name: 'Kayu Reng 6x12', category: 'Kayu', stock: 300, unit: 'Batang', price: 'Rp 12.000' },
];

export default function InventoryPage() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Inventory Stock</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage your building material inventory</p>
        </div>
        <Button style={{ width: 'auto' }}>+ Add New Product</Button>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product Details</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item) => (
              <tr key={item.id} className={styles.row}>
                <td>
                  <div className={styles.productInfo}>
                    <span className={styles.productName}>{item.name}</span>
                    <span className={styles.sku}>{item.sku}</span>
                  </div>
                </td>
                <td>
                  <span className={styles.categoryTag}>{item.category}</span>
                </td>
                <td>
                  <div className={`${styles.stockBadge} ${item.stock > 10 ? styles.stokAman : styles.stokRendah}`}>
                    {item.stock} {item.unit}
                  </div>
                </td>
                <td>
                  <span className={styles.price}>{item.price}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
