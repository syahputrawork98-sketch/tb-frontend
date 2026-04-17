'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import api from '@/utils/api';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;

      // 1. Store in Zustand Store (Handled persist & Cookies inside setAuth)
      setAuth(user, token);

      // 2. Redirect based on backend role
      const roleMap: { [key: string]: string } = {
        'ADMIN': '/admin',
        'CS': '/cs/pos'
      };

      const targetPath = roleMap[user.role] || '/cs/pos';
      router.push(targetPath);
      
    } catch (err: any) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || 'Login failed. Connection error or server down.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Premium Technical Corner Accents */}
      <div className={`${styles.corner} ${styles.topLeft}`}></div>
      <div className={`${styles.corner} ${styles.topRight}`}></div>
      <div className={`${styles.corner} ${styles.bottomLeft}`}></div>
      <div className={`${styles.corner} ${styles.bottomRight}`}></div>

      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>🏗️</span>
          <h1 className={styles.title}>TB System</h1>
          <p className={styles.subtitle}>Industrial Management</p>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          <Input 
            label="Username" 
            placeholder="Masukkan username" 
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
          
          {error && <p style={{ color: 'var(--color-error)', fontSize: '11px', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
          
          <Button type="submit" size="lg" disabled={loading} style={{ marginTop: 'var(--spacing-md)' }}>
            {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
          </Button>
        </form>

        <div className={styles.footer}>
          <p>CRYPTO-SECURED TERMINAL v1.0</p>
          <p>© 2026 <span className={styles.brandName}>TOKO BANGUNAN TB</span></p>
        </div>
      </div>
    </div>
  );
}
