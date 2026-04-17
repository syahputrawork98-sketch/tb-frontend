'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import Table from '@/components/common/Table';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

export default function CSHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/transactions');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch transaction history');
    } finally {
      setLoading(false);
    }
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const handlePrint = (transaction: any) => {
    // Basic thermal-style print preview
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Re-Print Receipt</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; width: 300px; padding: 20px; }
            .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .item { display: flex; justify-content: space-between; margin-top: 5px; }
            .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 10px; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="header">
            <h3>TOKO BANGUNAN</h3>
            <p>Salinan Struk - ${transaction.id}</p>
            <p>${formatDate(transaction.createdAt)}</p>
          </div>
          <div class="content">
            ${transaction.items.map((item: any) => `
              <div class="item">
                <span>${item.product.name} x${item.quantity}</span>
                <span>${formatIDR(item.unitPrice * item.quantity)}</span>
              </div>
            `).join('')}
          </div>
          <div class="total">
            <div class="item">
              <span>TOTAL</span>
              <span>${formatIDR(transaction.totalAmount)}</span>
            </div>
          </div>
          <div class="footer">
            <p>Terima Kasih Telah Berbelanja!</p>
            <p>Kasir: ${transaction.cashier.username}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const columns = [
    { header: 'No. Struk', key: 'id', render: (val: number) => `#${val}` },
    { header: 'Waktu Transaksi', key: 'createdAt', render: (val: string) => formatDate(val) },
    { header: 'Total Belanja', key: 'totalAmount', render: (val: number) => (
      <span style={{ fontWeight: 'bold' }}>{formatIDR(val)}</span>
    )},
    { header: 'Item', key: 'items', render: (val: any[]) => (
      <Badge variant="neutral">{val.length} Produk</Badge>
    )},
    { header: 'Aksi', key: 'action', render: (_: any, item: any) => (
      <Button size="md" variant="outline" onClick={() => handlePrint(item)}>🖨️ Cetak Ulang</Button>
    )}
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>Riwayat Penjualan Saya</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Melihat dan mencetak ulang transaksi shift Anda.</p>
      </header>

      <Card>
        <Table 
          columns={columns}
          data={history}
          loading={loading}
        />

        {history.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
            Anda belum melakukan transaksi hari ini.
          </div>
        )}
      </Card>
    </div>
  );
}
