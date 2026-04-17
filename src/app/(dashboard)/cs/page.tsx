import Image from "next/image";

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header>
        <h1 style={{ color: 'var(--color-primary-900)', fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>
          Customer Service Hub
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Welcome to the TB (Toko Bangunan) management dashboard.
        </p>
      </header>

      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: 'var(--spacing-lg)' 
      }}>
        {/* Mock Stats Cards */}
        {[
          { label: 'Today Sales', value: 'Rp 12.500.000', icon: '💰' },
          { label: 'Active Orders', value: '24', icon: '📦' },
          { label: 'Low Stock Items', value: '12', icon: '⚠️' },
          { label: 'Total Products', value: '1.240', icon: '🏗️' },
        ].map((stat, idx) => (
          <div key={idx} style={{ 
            backgroundColor: 'var(--color-bg-card)', 
            padding: 'var(--spacing-lg)', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>
                {stat.label}
              </span>
              <span>{stat.icon}</span>
            </div>
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-900)' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </section>
      
      <section style={{ 
        backgroundColor: 'var(--color-bg-card)', 
        padding: 'var(--spacing-xl)', 
        borderRadius: 'var(--radius-md)', 
        border: '1px solid var(--color-border)',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-muted)'
      }}>
        Recent Activity Chart Placeholder
      </section>
    </div>
  );
}
