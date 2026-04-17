'use client';

import React from 'react';
import styles from './analytics.module.css';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { formatIDR } from '@/utils/format';

export default function AnalyticsPage() {
  // Mock Data
  const stats = [
    { label: 'Total Revenue', value: 45850000, change: '+12.5%', isUp: true },
    { label: 'Total Orders', value: 128, change: '+8%', isUp: true },
    { label: 'Avg. Transaction', value: 358000, change: '-2%', isUp: false },
    { label: 'Active Customers', value: 84, change: '+5.4%', isUp: true },
  ];

  const profitData = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 65 },
    { month: 'Mar', value: 85 },
    { month: 'Apr', value: 55 },
    { month: 'May', value: 95 },
    { month: 'Jun', value: 75 },
  ];

  const activities = [
    { id: 1, text: 'CS Artdarkman processed order #1024', time: '5 mins ago', icon: '📝' },
    { id: 2, text: 'Stock update: Semen Tiga Roda (+50)', time: '1 hour ago', icon: '📦' },
    { id: 3, text: 'Price update: Besi Beton 10mm', time: '3 hours ago', icon: '🏷️' },
    { id: 4, text: 'New customer registration: Budi Properti', time: '5 hours ago', icon: '👤' },
  ];

  return (
    <div className={styles.wrapper}>
      <header>
        <h1 style={{ color: 'var(--color-primary-900)', fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>
          Business Analytics
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Real-time performance overview of TB (Toko Bangunan).</p>
      </header>

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <Card key={i} className={styles.statCard}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>
              {typeof stat.value === 'number' && stat.label.includes('Revenue') ? formatIDR(stat.value) : (typeof stat.value === 'number' && stat.label.includes('Avg') ? formatIDR(stat.value) : stat.value)}
            </span>
            <span className={`${styles.statChange} ${stat.isUp ? styles.up : styles.down}`}>
              {stat.isUp ? '↗' : '↘'} {stat.change} <span style={{color: 'var(--color-text-muted)'}}>vs last month</span>
            </span>
          </Card>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className={styles.chartsArea}>
        <Card title="Monthly Profit Trend" className={styles.chartCard}>
          <div className={styles.barContainer}>
            {profitData.map((d, i) => (
              <div key={i} className={styles.barGroup}>
                <div className={styles.bar} style={{ height: `${d.value}%` }}></div>
                <span className={styles.barLabel}>{d.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Activity" className={styles.chartCard}>
          <div className={styles.activityList}>
            {activities.map(act => (
              <div key={act.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>{act.icon}</div>
                <div className={styles.activityContent}>
                  <span className={styles.activityText}>{act.text}</span>
                  <span className={styles.activityTime}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
