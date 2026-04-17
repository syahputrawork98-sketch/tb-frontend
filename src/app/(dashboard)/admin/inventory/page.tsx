'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import styles from './inventory.module.css';
import { formatIDR } from '@/utils/format';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Badge from '@/components/common/Badge';

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  unit: string;
  icon: string;
}

const LOW_STOCK_THRESHOLD = 10;

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Semen',
    price: 0,
    costPrice: 0,
    stock: 0,
    unit: 'Sak',
    icon: '📦'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        sku: product.sku,
        name: product.name,
        category: product.category,
        price: product.price,
        costPrice: product.costPrice || 0,
        stock: product.stock,
        unit: product.unit,
        icon: product.icon
      });
    } else {
      setEditingProduct(null);
      setFormData({
        sku: '', name: '', category: 'Semen', price: 0, costPrice: 0, stock: 0, unit: 'Sak', icon: '📦'
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.patch(`/products/${editingProduct.id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      alert('Error saving product.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      alert('Error deleting product.');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.controls}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>Inventory Mastery</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage your material building product catalog.</p>
        </div>
        <div className={styles.searchWrapper}>
          <Input 
            placeholder="Search by SKU or Name..." 
            style={{ marginBottom: 0 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenModal()}>+ Add New Product</Button>
      </header>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price (Sell/Cost)</th>
              <th>Stock</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Loading inventory...</td></tr>
            ) : filteredProducts.map(p => (
              <tr key={p.id} className={styles.productRow}>
                <td style={{ fontWeight: 'mono', fontSize: '12px' }}>{p.sku}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{p.icon}</span>
                    <span style={{ fontWeight: 'bold' }}>{p.name}</span>
                  </div>
                </td>
                <td><Badge variant="info">{p.category}</Badge></td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{formatIDR(p.price)}</span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Cost: {formatIDR(p.costPrice || 0)}</span>
                  </div>
                </td>
                <td>
                  <div className={`${styles.stockLevel} ${p.stock <= LOW_STOCK_THRESHOLD ? styles.lowStock : ''}`}>
                    {p.stock <= LOW_STOCK_THRESHOLD ? '⚠️ ' : ''}
                    {p.stock} {p.unit}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => handleOpenModal(p)}>✏️</button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(p.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <Input 
              label="SKU Code" 
              value={formData.sku} 
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
              required
            />
            <Input 
              label="Product Name" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <div className={styles.fullWidth}>
               <Input 
                label="Category" 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              />
            </div>
            <Input 
              label="Selling Price (IDR)" 
              type="number"
              value={formData.price} 
              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              required
            />
            <Input 
              label="Cost Price (HPP)" 
              type="number"
              value={formData.costPrice} 
              onChange={(e) => setFormData({...formData, costPrice: Number(e.target.value)})}
              required
            />
            <Input 
              label="Current Stock" 
              type="number"
              value={formData.stock} 
              onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
              required
            />
             <Input 
              label="Unit (e.g. Sak, Pail)" 
              value={formData.unit} 
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
              required
            />
          </div>
          <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
            <Button type="submit" style={{ flex: 1 }}>{editingProduct ? 'Update Product' : 'Save Product'}</Button>
            <Button variant="outline" style={{ flex: 1, backgroundColor: 'var(--color-bg-main)', color: 'var(--color-text-main)' }} onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
