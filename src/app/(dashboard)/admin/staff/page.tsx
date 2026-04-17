'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import styles from './staff.module.css';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Badge from '@/components/common/Badge';
import { Trash2, UserPlus } from 'lucide-react';

interface User {
  id: number;
  username: string;
  role: string;
  createdAt: string;
}

export default function StaffManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  
  // Form State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('CS');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/users', {
        username: newUsername,
        password: newPassword,
        role: newRole
      });
      setModalOpen(false);
      setNewUsername('');
      setNewPassword('');
      fetchUsers();
    } catch (error) {
      alert('Error creating user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert('Error deleting user.');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>Staff Management</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage your team and their access levels.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={18} /> Add New Staff
        </Button>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 style={{ fontWeight: 'bold' }}>Active Members</h3>
          <Badge variant="info">{users.length} Total</Badge>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Created At</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: 'center' }}>Loading members...</td></tr>
            ) : users.map(user => (
              <tr key={user.id}>
                <td style={{ fontWeight: 'bold' }}>{user.username}</td>
                <td>
                  <Badge variant={user.role === 'ADMIN' ? 'success' : 'info'}>
                    {user.role}
                  </Badge>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Add New Staff Member"
      >
        <form onSubmit={handleCreateUser}>
          <div className={styles.formGrid}>
            <Input 
              label="Username" 
              placeholder="e.g. jdoe" 
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Role</label>
              <select 
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{ 
                  padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-card)', fontSize: '14px'
                }}
              >
                <option value="CS">Customer Service</option>
                <option value="ADMIN">Super Admin</option>
              </select>
            </div>
          </div>
          <Input 
            label="Initial Password" 
            type="password" 
            placeholder="••••••••" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <Button type="submit" style={{ flex: 1 }} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </Button>
            <Button variant="outline" style={{ flex: 1 }} onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
