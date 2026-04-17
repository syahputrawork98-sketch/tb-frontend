'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import styles from '../../admin/settings/settings.module.css'; // Reuse premium styles
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuthStore } from '@/store/authStore';
import { Building2, ShieldCheck, UserCircle } from 'lucide-react';

export default function CSSettingsPage() {
  const [activeTab, setActiveTab] = useState<'shop' | 'account'>('account');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  // Shop Info (Read-Only for CS)
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopPhone, setShopPhone] = useState('');

  // Account State
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchShopSettings();
  }, []);

  const fetchShopSettings = async () => {
    try {
      const response = await api.get('/settings');
      const data = response.data;
      if (data) {
        setShopName(data.shopName || '');
        setShopAddress(data.shopAddress || '');
        setShopPhone(data.shopPhone || '');
      }
    } catch (error) {
      console.error('Failed to fetch shop settings');
    }
  };

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
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>Staf Settings</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Manage your account and view shop information.</p>
      </header>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'account' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('account')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ShieldCheck size={18} /> Keamanan Akun
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'shop' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('shop')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Building2 size={18} /> Informasi Toko
        </button>
      </div>

      <div className={styles.card}>
        {activeTab === 'account' && (
          <form onSubmit={handleUpdateProfile}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
               <div style={{ padding: '10px', backgroundColor: 'var(--color-primary-50)', borderRadius: '50%', color: 'var(--color-primary-600)' }}>
                 <UserCircle size={32} />
               </div>
               <div>
                  <h2 className={styles.sectionTitle} style={{ marginBottom: '2px' }}>Profil Pengguna</h2>
                  <p className={styles.helpText}>Perbarui kredensial login Anda secara berkala.</p>
               </div>
            </div>

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
        )}

        {activeTab === 'shop' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
               <div style={{ padding: '10px', backgroundColor: 'var(--color-success-50)', borderRadius: '50%', color: 'var(--color-success)' }}>
                 <Building2 size={32} />
               </div>
               <div>
                  <h2 className={styles.sectionTitle} style={{ marginBottom: '2px' }}>Profil Toko (Read-Only)</h2>
                  <p className={styles.helpText}>Informasi identitas toko yang digunakan pada system.</p>
               </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.fullWidth}>
                <Input 
                  label="Nama Toko" 
                  value={shopName} 
                  disabled
                />
              </div>
              <div className={styles.fullWidth}>
                <Input 
                  label="Alamat Toko" 
                  value={shopAddress} 
                  disabled
                />
              </div>
              <Input 
                label="Telepon Toko" 
                value={shopPhone} 
                disabled
              />
            </div>
            <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              *Hanya Admin yang dapat mengubah informasi profil toko.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
