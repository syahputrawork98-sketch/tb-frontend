'use client';

import React, { useState, useEffect } from 'react';
import styles from './inventory.module.css';
import Button from '@/components/common/Button';
import api from '@/utils/api';
import { formatIDR } from '@/utils/format';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load inventory data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Inventory Stock</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage your building material inventory</p>
        </div>
        <Button style={{ width: 'auto' }}>+ Add New Product</Button>
      </header>

      {loading && <p style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>Loading inventory data...</p>}
      {error && <p style={{ textAlign: 'center', color: 'var(--color-error)', padding: 'var(--spacing-xl)' }}>{error}</p>}

      {!loading && !error && (
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
              {products.map((item) => (
                <tr key={item.id} className={styles.row}>
                  <td>
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>{item.name} {item.icon}</span>
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
                    <span className={styles.price}>{formatIDR(item.price)}</span>
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
      )}
    </div>
  );
}
