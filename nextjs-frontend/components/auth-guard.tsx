'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { cartService } from '@/services/cart';
import api from '@/services/api';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore();
  const [checkingSession, setCheckingSession] = useState(true);

  // Set up response interceptor to handle 401 globally
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          clearAuth();
          if (pathname.startsWith('/dashboard')) {
            router.push('/login');
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [clearAuth, pathname, router]);

  // Check auth session validity on mount
  useEffect(() => {
    async function verifySession() {
      if (!isAuthenticated) {
        setCheckingSession(false);
        return;
      }

      try {
        // Since we don't have a profile endpoint, we check if the user is authorized to read their cart
        await cartService.getCart();
        setCheckingSession(false);
      } catch (err: any) {
        // If 401 or network error, session is invalid
        clearAuth();
        setCheckingSession(false);
      }
    }

    verifySession();
  }, [isAuthenticated, clearAuth]);

  useEffect(() => {
    if (checkingSession) return;

    const isAuthRoute = pathname === '/login' || pathname === '/register';
    const isDashboardRoute = pathname.startsWith('/dashboard') || pathname === '/';

    if (isDashboardRoute && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthRoute && isAuthenticated && user) {
      router.push('/dashboard');
    } else if (pathname === '/') {
      router.push(isAuthenticated ? '/dashboard' : '/login');
    }
  }, [isAuthenticated, checkingSession, pathname, router, user]);

  if (checkingSession) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Checking authentication session...</p>
      </div>
    );
  }

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname === '/';

  // Prevent flash of protected contents
  if (isDashboardRoute && !isAuthenticated) {
    return null;
  }
  if (isAuthRoute && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
