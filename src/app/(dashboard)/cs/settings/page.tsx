'use client';

import React, { useState } from 'react';
import api from '@/utils/api';
import styles from '../../admin/settings/settings.module.css'; // Reuse styles from admin
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuthStore } from '@/store/authStore';

export default function CSSettingsPage() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  // Account State
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.patch('/users/profile', { username, password });
      alert('Profile updated! Please log in again if you changed your username.');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>My Profile</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Security and account management for Customer Service.</p>
      </header>

      <div className={styles.card}>
        <form onSubmit={handleUpdateProfile}>
          <h2 className={styles.sectionTitle}>Keamanan Akun Staf</h2>
          <div className={styles.formGrid}>
            <div className={styles.fullWidth}>
              <Input 
                label="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <Input 
              label="Password Baru" 
              type="password"
              placeholder="Kosongkan jika tidak ganti"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input 
              label="Konfirmasi Password" 
              type="password"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
            {loading ? 'Updating...' : 'Simpan Perubahan'}
          </Button>
        </form>
      </div>
    </div>
  );
}
