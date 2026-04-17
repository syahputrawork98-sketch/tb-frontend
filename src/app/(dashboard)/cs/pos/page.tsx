'use client';

import React, { useState } from 'react';
import styles from './pos.module.css';
import { formatIDR } from '@/utils/format';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';

// Mock Data Produk
const products = [
  { id: 1, name: 'Semen Tiga Roda', price: 65000, unit: 'Sak', icon: '🧱' },
  { id: 2, name: 'Besi Beton 10mm', price: 88000, unit: 'Lonjor', icon: '🏗️' },
  { id: 3, name: 'Pipa PVC 3 inch', price: 45000, unit: 'Batang', icon: '🚿' },
  { id: 4, name: 'Cat Dulux 5kg', price: 210000, unit: 'Pail', icon: '🎨' },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.price, qty: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className={styles.container}>
      {/* Search & Product Selection */}
      <div className={styles.productSection}>
        <div className={styles.searchBar}>
          <Input placeholder="Search material by name or SKU..." style={{ marginBottom: 0 }} />
          <button style={{ 
            backgroundColor: 'var(--color-primary-900)', 
            color: 'white', border: 'none', borderRadius: '8px', padding: '0 20px' 
          }}>Search</button>
        </div>

        <div className={styles.productList}>
          {products.map(p => (
            <Card key={p.id} onClick={() => addToCart(p)}>
              <div style={{ textAlign: 'center', fontSize: '32px', marginBottom: '10px' }}>{p.icon}</div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{p.name}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>{formatIDR(p.price)}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className={styles.cartSection}>
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitle}>Current Order</h2>
          <Badge variant="info">{cart.length} Items</Badge>
        </div>

        <div className={styles.cartItems}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <span>🛒</span>
              <p>No items in cart</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemPrice}>{item.qty} x {formatIDR(item.price)}</span>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>❌</button>
              </div>
            ))
          )}
        </div>

        <div className={styles.cartFooter}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Grand Total</span>
            <span className={styles.totalAmount}>{formatIDR(total)}</span>
          </div>
          <button 
            className={styles.checkoutBtn} 
            disabled={cart.length === 0}
            onClick={() => setSuccessModalOpen(true)}
          >
            Process Payment
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      <Modal 
        isOpen={isSuccessModalOpen} 
        onClose={() => { setSuccessModalOpen(false); setCart([]); }} 
        title="Transaction Success"
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h3>Payment Completed!</h3>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>
            Receipt has been printed and stock updated.
          </p>
          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--color-bg-main)', borderRadius: '8px' }}>
            <strong>Total: {formatIDR(total)}</strong>
          </div>
        </div>
      </Modal>
    </div>
  );
}
