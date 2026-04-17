'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { useAuthStore } from '@/store/authStore';
import { 
  BarChart3, 
  Users, 
  Package, 
  FileText, 
  ShoppingCart, 
  Search, 
  Settings, 
  LogOut,
  Container 
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const isAdmin = pathname.startsWith('/admin');
  const isCS = pathname.startsWith('/cs');

  const menuItems = [
    ...(isAdmin ? [
      { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/admin/analytics' },
      { icon: <Users size={20} />, label: 'Staf Toko', path: '/admin/staff' },
      { icon: <Package size={20} />, label: 'Inventaris', path: '/admin/inventory' },
      { icon: <FileText size={20} />, label: 'Laporan Penjualan', path: '/admin/reports' },
    ] : []),
    
    ...(isCS ? [
      { icon: <BarChart3 size={20} />, label: 'Monitor Shift', path: '/cs' },
      { icon: <ShoppingCart size={20} />, label: 'Kasir (POS)', path: '/cs/pos' },
      { icon: <Search size={20} />, label: 'Cek Stok Barang', path: '/cs/inventory' },
      { icon: <FileText size={20} />, label: 'Riwayat Penjualan', path: '/cs/history' },
    ] : []),

    { icon: <Settings size={20} />, label: 'Settings', path: isAdmin ? '/admin/settings' : '/cs/settings' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <span className={styles.logoIcon}>
          <Container size={28} strokeWidth={2.5} />
        </span>
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
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
