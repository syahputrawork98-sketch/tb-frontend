'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const pathname = usePathname();

  // Role Detection Logic (Mock)
  const isAdmin = pathname.startsWith('/admin');
  const isCS = pathname.startsWith('/cs');

  const menuItems = [
    // Global Dashboard for all
    { icon: '📊', label: 'Dashboard', path: isAdmin ? '/admin/analytics' : '/cs' },
    
    // CS & Admin Only: Inventory
    ...((isCS || isAdmin) ? [
      { icon: '📦', label: 'Inventory', path: '/cs/inventory' },
      { icon: '📝', label: 'Transactions', path: '/cs/pos' },
    ] : []),

    // Admin Only: Management
    ...(isAdmin ? [
      { icon: '👥', label: 'Staff Management', path: '#' },
    ] : []),

    // Settings for all
    { icon: '⚙️', label: 'Settings', path: '#' },
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
        <div className={styles.logoutBtn}>
          <span>🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
