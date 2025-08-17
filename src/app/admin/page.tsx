
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { DashboardSkeleton } from '@/components/admin/dashboard/DashboardSkeleton';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to the dashboard.
        router.replace('/admin/dashboard');
      } else {
        // No user is signed in, redirect to the central login page.
        router.replace('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  // Render a skeleton while the redirect is happening.
  return <DashboardSkeleton />;
}
