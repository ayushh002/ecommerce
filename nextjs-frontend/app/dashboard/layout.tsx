'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { authService } from '@/services/auth';
import { cartService } from '@/services/cart';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, ShoppingCart, LogOut, User, ClipboardList, Package, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CartDrawer } from '@/features/cart/cart-drawer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const { isCartOpen, setCartOpen, theme, toggleTheme } = useUIStore();

  // Fetch cart to show count badge
  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    refetchInterval: 12000,
  });

  const cartItemsCount = cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Successfully logged out.');
    } catch (error) {
      // ignore
    } finally {
      clearAuth();
      router.push('/login');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-hidden">
      {/* Premium backdrop blurs (Linear & Vercel design benchmarking) */}
      <div className="absolute top-[-25%] left-[-15%] h-[800px] w-[800px] rounded-full bg-primary/3 dark:bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-15%] h-[800px] w-[800px] rounded-full bg-primary/2 dark:bg-primary/4 blur-[150px] pointer-events-none" />

      {/* Header — Sticky Premium Glass Effect */}
      <header className="sticky top-0 z-40 w-full border-b border-border/10 bg-background/40 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-10">
            <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-lg tracking-tight spring-transition hover:opacity-90">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-premium-sm">
                <ShoppingCart className="h-4.5 w-4.5" />
              </div>
              <span className="font-semibold text-foreground/90">
                Apex<span className="text-primary font-bold">Cart</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/dashboard"
                className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-foreground flex items-center gap-1.5 ${
                  pathname === '/dashboard' ? 'text-primary font-bold' : 'text-muted-foreground'
                }`}
              >
                <Package className="h-3.5 w-3.5" />
                Products
              </Link>
              <Link
                href="/dashboard/orders"
                className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-foreground flex items-center gap-1.5 ${
                  pathname === '/dashboard/orders' ? 'text-primary font-bold' : 'text-muted-foreground'
                }`}
              >
                <ClipboardList className="h-3.5 w-3.5" />
                My Orders
              </Link>
              <Link
                href="/dashboard/profile"
                className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-foreground flex items-center gap-1.5 ${
                  pathname === '/dashboard/profile' ? 'text-primary font-bold' : 'text-muted-foreground'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                My Profile
              </Link>
            </nav>
          </div>

          {/* Right Controls — Soft Elevation instead of visible outlines */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              className="h-8.5 w-8.5 rounded-lg bg-transparent hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center spring-transition cursor-pointer"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Cart Trigger */}
            <button
              className="relative h-8.5 w-8.5 rounded-lg bg-transparent hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center spring-transition cursor-pointer"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-black text-primary-foreground shadow-premium-sm ring-2 ring-background">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Profile Pill — Borderless layout */}
            <Link
              href="/dashboard/profile"
              className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-xs font-semibold transition-colors duration-200 max-w-[180px] cursor-pointer ${
                pathname === '/dashboard/profile' ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="h-3 w-3 shrink-0" />
              <span className="truncate">{user?.name || user?.email}</span>
            </Link>

            {/* Logout Trigger */}
            <button
              className="h-8.5 w-8.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center spring-transition cursor-pointer"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden border-t border-border/10 bg-background/40 py-2.5 px-4 flex items-center justify-around text-[10px] font-bold uppercase tracking-wider">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center gap-1 transition-colors ${
              pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Package className="h-4 w-4" />
            Products
          </Link>
          <Link
            href="/dashboard/orders"
            className={`flex flex-col items-center gap-1 transition-colors ${
              pathname === '/dashboard/orders' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            My Orders
          </Link>
          <Link
            href="/dashboard/profile"
            className={`flex flex-col items-center gap-1 transition-colors ${
              pathname === '/dashboard/profile' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
        </div>
      </header>

      {/* Main Content Area — Section spacing (64px / py-16) to prevent crowded layout */}
      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
