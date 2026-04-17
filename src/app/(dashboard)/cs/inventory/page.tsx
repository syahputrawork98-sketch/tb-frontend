'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import Table from '@/components/common/Table';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  icon: string;
}

export default function CSInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);
  };

  const columns = [
    { header: 'Info Barang', key: 'name', render: (val: string, item: Product) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>{item.icon}</span>
        <div>
          <div style={{ fontWeight: 'bold' }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{item.sku}</div>
        </div>
      </div>
    )},
    { header: 'Kategori', key: 'category', render: (val: string) => (
      <Badge variant="neutral">{val}</Badge>
    )},
    { header: 'Stok Saat Ini', key: 'stock', render: (val: number, item: Product) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          fontWeight: 'bold', 
          color: val < 10 ? 'var(--color-error)' : 'var(--color-text-main)' 
        }}>
          {val} {item.unit}
        </span>
        {val < 10 && <span title="Stok Rendah!">⚠️</span>}
      </div>
    )},
    { header: 'Harga Jual', key: 'price', render: (val: number) => (
      <span style={{ fontWeight: 'bold', color: 'var(--color-primary-900)' }}>{formatIDR(val)}</span>
    )}
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>Cek Stok & Harga</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Cari material bangunan berdasarkan nama atau SKU.</p>
      </header>

      <Card>
        <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
          <Input 
            placeholder="🔍 Cari nama barang, SKU, atau kategori..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Table 
          columns={columns}
          data={filtered}
          loading={loading}
        />
      </Card>
      
      {filtered.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
          Barang tidak ditemukan. Coba kata kunci lain.
        </div>
      )}
    </div>
  );
}
