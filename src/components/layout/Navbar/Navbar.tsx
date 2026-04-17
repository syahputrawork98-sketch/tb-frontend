'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const Navbar = () => {
  const pathname = usePathname();
  
  // Role Detection Logic (Mock)
  const roleName = pathname.startsWith('/admin') 
    ? 'Super Admin' 
    : (pathname.startsWith('/cs') ? 'Customer Service' : 'Customer');

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <span className={styles.breadcrumb}>Dashboard / Overview</span>
      </div>
      <div className={styles.right}>
        <div className={styles.userInfo}>
          <span className={styles.roleTag}>{roleName}</span>
          <span className={styles.userName}>Artdarkman</span>
        </div>
        <div className={styles.avatar}>👤</div>
      </div>
    </header>
  );
};

export default Navbar;
