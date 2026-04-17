'use client';

import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

export default function CSDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    todaySales: 0,
    todayTransactions: 0,
    lowStockItems: 0,
    totalProducts: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/cs-stats');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, []);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary-900)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
            Customer Service Hub
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Pantauan performa shift Anda hari ini.</p>
        </div>
        <Button onClick={() => router.push('/cs/pos')} size="lg">
          🛒 Buka Kasir (POS)
        </Button>
      </header>

      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: 'var(--spacing-lg)' 
      }}>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>Penjualan Saya (Hari Ini)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-success)', marginTop: '8px' }}>
            {formatIDR(stats.todaySales)}
          </div>
        </Card>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>Total Transaksi</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px' }}>{stats.todayTransactions} Struk</div>
        </Card>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>Stok Rendah (Peringatan)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-error)', marginTop: '8px' }}>
            {stats.lowStockItems} Item ⚠️
          </div>
        </Card>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>Katalog Barang</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px' }}>{stats.totalProducts} Jenis</div>
        </Card>
      </section>
      
      <section style={{ 
        backgroundColor: 'var(--color-bg-card)', 
        padding: 'var(--spacing-xl)', 
        borderRadius: 'var(--radius-md)', 
        border: '1px solid var(--color-border)',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '16px' }}>Butuh Bantuan atau Cek Stok?</h3>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button variant="outline" onClick={() => router.push('/cs/inventory')}>🔎 Cek Stok Barang</Button>
          <Button variant="outline" onClick={() => router.push('/cs/history')}>📜 Riwayat Penjualan</Button>
        </div>
      </section>
    </div>
  );
}
