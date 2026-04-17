'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import styles from './reports.module.css';
import { formatIDR, formatDate } from '@/utils/format';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';

interface Transaction {
  id: number;
  totalAmount: number;
  createdAt: string;
  cashier: { username: string };
  items: Array<{
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    product: { name: string; unit: string };
  }>;
}

export default function SalesReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/transactions?${params.toString()}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const grandTotal = transactions.reduce((acc, t) => acc + t.totalAmount, 0);

  return (
    <div className={styles.container}>
      <header className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>Sales Reporting</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Generate and print periodic sales summaries.</p>
        </div>
        <Button onClick={handlePrint} variant="primary">🖨️ Print Report</Button>
      </header>

      <div className={`${styles.filterBar} no-print`}>
        <div className={styles.dateGroup}>
          <label>Start Date</label>
          <input 
            type="date" 
            className={styles.dateInput} 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className={styles.dateGroup}>
          <label>End Date</label>
          <input 
            type="date" 
            className={styles.dateInput} 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Button onClick={fetchTransactions}>🔍 Filter Results</Button>
      </div>

      <div className={styles.reportCard}>
        <div style={{ padding: '20px', backgroundColor: 'var(--color-bg-main)', display: 'none', textAlign: 'center' }} className="print-only">
          <h2>TB (Toko Bangunan) - Sales Report</h2>
          <p>{startDate || 'Start'} to {endDate || 'Today'}</p>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date & ID</th>
              <th>Cashier</th>
              <th>Items Detail</th>
              <th style={{ textAlign: 'right' }}>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: 'center' }}>Loading report data...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center' }}>No transactions found for this period.</td></tr>
            ) : transactions.map(t => (
              <tr key={t.id}>
                <td>
                  <div style={{ fontWeight: 'bold' }}>{formatDate(t.createdAt)}</div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>#TRX-{t.id}</div>
                </td>
                <td>{t.cashier.username}</td>
                <td>
                  {t.items.map(item => (
                    <div key={item.id} className={styles.itemLine}>
                      {item.product.name} ({item.quantity} {item.product.unit}) @ {formatIDR(item.unitPrice)}
                    </div>
                  ))}
                </td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  {formatIDR(t.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: 'var(--color-bg-main)', fontWeight: 'bold' }}>
              <td colSpan={3} style={{ textAlign: 'right', padding: '16px' }}>GRAND TOTAL</td>
              <td style={{ textAlign: 'right', padding: '16px', color: 'var(--color-primary-900)', fontSize: '16px' }}>
                {formatIDR(grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <style jsx>{`
        @media screen {
          .print-only { display: none !important; }
        }
        @media print {
          .print-only { display: block !important; }
        }
      `}</style>
    </div>
  );
}
