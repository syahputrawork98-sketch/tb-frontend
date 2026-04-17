import React from 'react';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import Navbar from '@/components/layout/Navbar/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar - Fixed Width */}
      <Sidebar />

      {/* Main Column */}
      <div style={{ 
        flex: 1, 
        marginLeft: '260px', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg-main)'
      }}>
        <Navbar />
        
        {/* Content Area */}
        <div style={{ padding: 'var(--spacing-xl)', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
