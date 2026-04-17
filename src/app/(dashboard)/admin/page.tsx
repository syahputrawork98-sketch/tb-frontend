'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/admin/analytics');
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%' }}>
      <p style={{ color: 'var(--color-text-muted)' }}>Redirecting to analytics...</p>
    </div>
  );
}
