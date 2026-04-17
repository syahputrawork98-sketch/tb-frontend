'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import styles from './pos.module.css';
import { formatIDR } from '@/utils/format';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  category: string;
  icon?: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  stock: number;
  category: string;
  icon?: string;
}

import { usePosStore } from '@/store/posStore';

export default function POSPage() {
  const { 
    cart, addToCart, removeOne, removeItem, clearCart,
    searchQuery, setSearchQuery, 
    selectedCategory, setSelectedCategory 
  } = usePosStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [error, setError] = useState('');

  const categories = ['All', 'Semen', 'Besi', 'Cat', 'Lainnya'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    setError('');

    try {
      const transactionData = {
        totalAmount: total,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.qty,
          unitPrice: item.price
        }))
      };

      await api.post('/transactions', transactionData);
      setSuccessModalOpen(true);
      fetchProducts(); // Refresh stocks
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transaction failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className={styles.container}>
      {/* Search & Product Selection */}
      <div className={styles.productSection}>
        <div className={styles.searchBar}>
          <Input 
            placeholder="Search material by name or SKU..." 
            style={{ marginBottom: 0, flex: 1 }} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.categories}>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`${styles.categoryTab} ${selectedCategory === cat ? styles.categoryTabActive : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && <p style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>Loading products...</p>}
        
        <div className={styles.productList}>
          {filteredProducts.map(p => (
            <Card key={p.id} onClick={() => addToCart(p)} style={{ opacity: p.stock <= 0 ? 0.6 : 1, cursor: p.stock <= 0 ? 'not-allowed' : 'pointer' }}>
              <div style={{ textAlign: 'center', fontSize: '32px', marginBottom: '10px' }}>{p.icon || '📦'}</div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{p.name}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>{formatIDR(p.price)}</div>
              <div style={{ fontSize: '11px', marginTop: '4px', color: p.stock > 10 ? 'var(--color-success)' : 'var(--color-error)' }}>
                Stock: {p.stock} {p.unit}
              </div>
            </Card>
          ))}
          {filteredProducts.length === 0 && !loading && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
              No products found matches your search.
            </p>
          )}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className={styles.cartSection}>
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitle}>Order Details</h2>
          <button className={styles.clearBtn} onClick={clearCart}>Clear</button>
        </div>

        <div className={styles.cartItems}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <span>🛒</span>
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemPrice}>{formatIDR(item.price)}</span>
                </div>
                
                <div className={styles.qtyControls}>
                  <button className={styles.qtyBtn} onClick={() => removeOne(item.id)}>-</button>
                  <span className={styles.qtyValue}>{item.qty}</span>
                  <button 
                    className={styles.qtyBtn} 
                    onClick={() => addToCart(item)}
                    disabled={item.qty >= item.stock}
                  >+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.cartFooter}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total Payment</span>
            <span className={styles.totalAmount}>{formatIDR(total)}</span>
          </div>
          {error && <p style={{ color: '#ffb3b3', fontSize: '11px', marginBottom: '10px' }}>{error}</p>}
          <button 
            className={styles.checkoutBtn} 
            disabled={cart.length === 0 || isProcessing}
            onClick={handleCheckout}
          >
            {isProcessing ? 'Processing...' : 'Complete Transaction'}
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      <Modal 
        isOpen={isSuccessModalOpen} 
        onClose={() => { setSuccessModalOpen(false); clearCart(); }} 
        title="Transaction Finalized"
      >
        <div className="modalContent" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏗️</div>
          <h3>TB (Toko Bangunan)</h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Official Digital Receipt</p>
          
          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px dashed var(--color-border)' }} />
          
          <div style={{ textAlign: 'left', fontSize: '13px' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>{item.name} (x{item.qty})</span>
                <span>{formatIDR(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <hr style={{ margin: '20px 0', border: 'none', borderTop: '2px solid var(--color-bg-main)' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>GRAND TOTAL</span>
            <span>{formatIDR(total)}</span>
          </div>

          <div style={{ marginTop: '32px' }} className="no-print">
            <button 
              onClick={handlePrint}
              style={{ 
                width: '100%', padding: '12px', backgroundColor: 'var(--color-primary-900)', 
                color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              🖨️ Print Receipt
            </button>
            <button 
              onClick={() => { setSuccessModalOpen(false); clearCart(); }}
              style={{ width: '100%', padding: '12px', background: 'none', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer' }}
            >
              New Transaction
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
