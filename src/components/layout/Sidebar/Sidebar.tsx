'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { useAuthStore } from '@/store/authStore';

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  // Role Detection Logic
  const isAdmin = pathname.startsWith('/admin');
  const isCS = pathname.startsWith('/cs');

  const menuItems = [
    // Admin Dashboard
    ...(isAdmin ? [
      { icon: '📊', label: 'Analytics', path: '/admin/analytics' },
      { icon: '👥', label: 'Staf Toko', path: '/admin/staff' },
      { icon: '📦', label: 'Inventaris', path: '/admin/inventory' },
      { icon: '📜', label: 'Laporan Penjualan', path: '/admin/reports' },
    ] : []),
    
    // CS Dashboard
    ...(isCS ? [
      { icon: '📊', label: 'Monitor Shift', path: '/cs' },
      { icon: '🛒', label: 'Kasir (POS)', path: '/cs/pos' },
      { icon: '🔎', label: 'Cek Stok Barang', path: '/cs/inventory' },
      { icon: '📜', label: 'Riwayat Penjualan', path: '/cs/history' },
    ] : []),

    // Settings for all
    { icon: '⚙️', label: 'Settings', path: isAdmin ? '/admin/settings' : '/cs/settings' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <span className={styles.logoIcon}>🏗️</span>
        <h2 className={styles.logoText}>TB System</h2>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item, idx) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={idx} 
              href={item.path} 
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.logoutBtn} onClick={() => logout()}>
          <span>🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
