'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import styles from './analytics.module.css';
import { formatIDR } from '@/utils/format';
import { useAuthStore } from '@/store/authStore';

interface SummaryData {
  totalRevenue: number;
  totalTransactions: number;
  totalProfit: number;
}

interface ChartData {
  date: string;
  amount: number;
}

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sumRes, chartRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/chart')
      ]);
      setSummary(sumRes.data);
      setChartData(chartRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxAmount = chartData.length > 0 ? Math.max(...chartData.map(d => d.amount)) : 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>Business Intelligence</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Welcome back, {user?.username}. Overview of Toko Bangunan performance.</p>
        </div>
        <button 
          onClick={fetchData}
          style={{ 
            padding: '10px 20px', backgroundColor: 'var(--color-primary-900)', 
            color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' 
          }}
        >
          🔄 Refresh Data
        </button>
      </header>

      {/* Statistics Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Revenue</span>
          <span className={styles.statValue}>{formatIDR(summary?.totalRevenue || 0)}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Transactions</span>
          <span className={styles.statValue}>{summary?.totalTransactions || 0}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Est. Total Profit</span>
          <span className={`${styles.statValue}`} style={{ color: 'var(--color-success)' }}>
            {formatIDR(summary?.totalProfit || 0)}
          </span>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className={styles.chartContainer}>
        <h2 className={styles.chartTitle}>Revenue Trend (Last 7 Days)</h2>
        <div className={styles.chartArea}>
          {chartData.length === 0 && !loading && (
            <p style={{ width: '100%', textAlign: 'center', color: 'var(--color-text-muted)' }}>No sales data available yet.</p>
          )}
          {chartData.map((d, index) => {
            const height = maxAmount > 0 ? (d.amount / maxAmount) * 100 : 0;
            return (
              <div key={index} className={styles.barWrapper}>
                <div className={styles.barTooltip}>{formatIDR(d.amount)}</div>
                <div 
                  className={styles.bar} 
                  style={{ height: `${height}%` }}
                ></div>
                <span className={styles.barLabel}>{d.date.split('-').slice(1).reverse().join('/')}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Analytics Sections Can Be Added Here */}
    </div>
  );
}
