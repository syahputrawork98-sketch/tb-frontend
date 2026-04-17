'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import api from '@/utils/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;

      // Save session
      localStorage.setItem('tb_token', token);
      localStorage.setItem('tb_user', JSON.stringify(user));

      // Redirect based on backend role
      const roleMap: { [key: string]: string } = {
        'ADMIN': '/admin/analytics',
        'CS': '/cs/pos'
      };

      const targetPath = roleMap[user.role] || '/cs';
      router.push(targetPath);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
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
          
          {error && <p style={{ color: 'var(--color-error)', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}
          
          <Button type="submit" size="lg" disabled={loading} style={{ marginTop: 'var(--spacing-md)' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
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
