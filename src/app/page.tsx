'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './landing.module.css';
import Card from '@/components/common/Card';

export default function RootPage() {
  const router = useRouter();

  const dashboards = [
    { title: 'Super Admin Dashboard', icon: '💎', path: '/admin/analytics', role: 'Full Control & Analytics' },
    { title: 'Customer Service Hub', icon: '⚡', path: '/cs/pos', role: 'POS, Inventory & Transactions' },
  ];

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>TB (Toko Bangunan) - UI Testing Suite</h1>
        <p className={styles.subtitle}>Click any card below to jump directly into each dashboard role.</p>
      </header>
      
      <main className={styles.grid}>
        {dashboards.map((dash, i) => (
          <Card 
            key={i} 
            onClick={() => router.push(dash.path)}
            className={styles.dashCard}
          >
            <div className={styles.icon}>{dash.icon}</div>
            <h2 className={styles.dashTitle}>{dash.title}</h2>
            <p className={styles.dashDesc}>{dash.role}</p>
            <div className={styles.arrow}>Go to Interface →</div>
          </Card>
        ))}
      </main>

      <footer className={styles.footer}>
        <p>Currently in **Development Mode** - Auth logic is disabled for easier navigation.</p>
      </footer>
    </div>
  );
}
