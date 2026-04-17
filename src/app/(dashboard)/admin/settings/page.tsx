'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import styles from './settings.module.css';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuthStore } from '@/store/authStore';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'shop' | 'system' | 'account'>('shop');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  // Shop & System State
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopPhone, setShopPhone] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  // Account State
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      const data = response.data;
      setShopName(data.shopName);
      setShopAddress(data.shopAddress);
      setShopPhone(data.shopPhone);
      setLowStockThreshold(data.lowStockThreshold);
    } catch (error) {
      console.error('Failed to fetch settings');
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch('/settings', { shopName, shopAddress, shopPhone, lowStockThreshold });
      alert('Settings updated successfully!');
      fetchSettings();
    } catch (error) {
      alert('Failed to update settings');
    } finally {
      setLoading(false);
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
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>System Settings</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Configure your shop identity and business rules.</p>
      </header>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'shop' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('shop')}
        >
          🏢 Profil Toko
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'system' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('system')}
        >
          ⚙️ Sistem Kasir
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'account' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('account')}
        >
          🔐 Keamanan Akun
        </button>
      </div>

      <div className={styles.card}>
        {activeTab === 'shop' && (
          <form onSubmit={handleUpdateSettings}>
            <h2 className={styles.sectionTitle}>Identitas Toko Bangunan</h2>
            <p className={styles.helpText}>Informasi ini akan muncul pada kop struk belanja pelanggan.</p>
            <div className={styles.formGrid}>
               <div className={styles.fullWidth}>
                <Input 
                  label="Nama Toko" 
                  value={shopName} 
                  onChange={(e) => setShopName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.fullWidth}>
                <Input 
                  label="Alamat Lengkap" 
                  value={shopAddress} 
                  onChange={(e) => setShopAddress(e.target.value)}
                  required
                />
              </div>
              <Input 
                label="Nomor Telepon" 
                value={shopPhone} 
                onChange={(e) => setShopPhone(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
              {loading ? 'Saving...' : 'Simpan Profil Toko'}
            </Button>
          </form>
        )}

        {activeTab === 'system' && (
          <form onSubmit={handleUpdateSettings}>
            <h2 className={styles.sectionTitle}>Konfigurasi Bisnis</h2>
            <div className={styles.formGrid}>
              <div className={styles.fullWidth}>
                <Input 
                  label="Ambang Batas Stok Rendah (Low Stock Threshold)" 
                  type="number"
                  value={lowStockThreshold} 
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  required
                />
                <p className={styles.helpText}>Produk dengan stok di bawah nilai ini akan memicu peringatan ⚠️ di dashboard.</p>
              </div>
            </div>
            <Button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
              {loading ? 'Saving...' : 'Update Konfigurasi'}
            </Button>
          </form>
        )}

        {activeTab === 'account' && (
          <form onSubmit={handleUpdateProfile}>
            <h2 className={styles.sectionTitle}>Pengaturan Akun Admin</h2>
            <div className={styles.formGrid}>
              <div className={styles.fullWidth}>
                <Input 
                  label="Username Baru" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <Input 
                label="Password Baru" 
                type="password"
                placeholder="Biarkan kosong jika tidak ingin mengubah"
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
              {loading ? 'Updating...' : 'Perbarui Kredensial'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
