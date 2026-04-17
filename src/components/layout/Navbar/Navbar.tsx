'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { useAuthStore } from '@/store/authStore';
import { User } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  
  // Role Detection Logic
  const roleName = pathname.startsWith('/admin') 
    ? 'Super Admin' 
    : (pathname.startsWith('/cs') ? 'Customer Service' : 'Staf');

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <span className={styles.breadcrumb}>TB Dashboard / {roleName}</span>
      </div>
      <div className={styles.right}>
        <div className={styles.userInfo}>
          <span className={styles.roleTag}>{roleName}</span>
          <span className={styles.userName}>{user?.username || 'Guest'}</span>
        </div>
        <div className={styles.avatar}>
          {user?.username ? user.username.charAt(0).toUpperCase() : <User size={18} />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
