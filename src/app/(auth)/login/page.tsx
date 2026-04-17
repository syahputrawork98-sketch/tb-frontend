'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock Login Logic
    const roleMap: { [key: string]: string } = {
      'admin': '/admin',
      'cs': '/cs'
    };

    const targetPath = roleMap[username.toLowerCase()] || '/cs'; // Default to CS if not found
    
    router.push(targetPath);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>🏗️</span>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Enter your credentials to access the TB system</p>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          <Input 
            label="Username" 
            placeholder="e.g. admin or cs" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button type="submit" size="lg" style={{ marginTop: 'var(--spacing-md)' }}>
            Sign In
          </Button>
        </form>

        <div className={styles.footer}>
          <p>© 2026 <span className={styles.brandName}>TB (Toko Bangunan)</span></p>
          <p>Industrial Management System v1.0</p>
        </div>
      </div>
    </div>
  );
}
