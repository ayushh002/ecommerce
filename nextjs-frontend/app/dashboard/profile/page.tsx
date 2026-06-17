'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { ordersService } from '@/services/orders';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { User, Mail, Calendar, ClipboardList, Wallet, ShieldCheck, ChevronRight, Activity } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuthStore();

  // Load orders to calculate stats dynamically
  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersService.getOrders(),
  });

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const lastOrderDate = orders.length > 0 ? new Date(orders[0].createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'No orders placed yet';

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Account Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your security settings and view overall shopping metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Card: Avatar & Primary Info */}
        <div className="md:col-span-1 flex flex-col items-center justify-center p-8 text-center space-y-6 bg-card rounded-2xl shadow-premium-md border-none">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground font-black text-4xl shadow-xl shadow-primary/20">
            {userInitial}
            <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-emerald-500 border-4 border-background flex items-center justify-center" title="Active Session">
              <span className="h-2.5 w-2.5 rounded-full bg-white animate-ping" />
            </div>
          </div>

          <div className="space-y-1 w-full">
            <h3 className="text-xl font-bold truncate px-2 text-foreground/90">{user?.name || 'Customer'}</h3>
            <p className="text-xs text-muted-foreground truncate px-2 font-medium">{user?.email}</p>
          </div>

          <Badge variant="success" className="px-3.5 py-1.5 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 mx-auto rounded-full">
            <Activity className="h-3.5 w-3.5" />
            Active Account
          </Badge>

          <div className="w-full border-t border-border/10 pt-6 text-[11px] text-muted-foreground font-medium leading-relaxed">
            Authorized via secure HTTP-Only JWT cookies. Access credentials expire automatically.
          </div>
        </div>

        {/* Right Area: Stats & Account Details */}
        <div className="md:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 flex items-center gap-4 bg-card rounded-2xl shadow-premium-sm hover:-translate-y-0.5 hover:shadow-premium-md transition-all duration-300 border-none">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-wider">Total Orders</span>
                <span className="text-xl font-extrabold text-foreground mt-0.5 block">{orders.length}</span>
              </div>
            </div>

            <div className="p-5 flex items-center gap-4 bg-card rounded-2xl shadow-premium-sm hover:-translate-y-0.5 hover:shadow-premium-md transition-all duration-300 border-none">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                <Wallet className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-wider">Total Spent</span>
                <span className="text-xl font-extrabold text-foreground mt-0.5 block">{formatPrice(totalSpent)}</span>
              </div>
            </div>

            <div className="p-5 flex items-center gap-4 bg-card rounded-2xl shadow-premium-sm hover:-translate-y-0.5 hover:shadow-premium-md transition-all duration-300 border-none">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-wider">Last Order</span>
                <span className="text-xs font-bold text-foreground mt-1 block truncate leading-normal">{lastOrderDate}</span>
              </div>
            </div>
          </div>

          {/* Profile Details Block */}
          <div className="bg-card rounded-2xl shadow-premium-md border-none overflow-hidden">
            <div className="px-6 py-5 bg-secondary/30">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Profile Information
              </h3>
            </div>
            <div className="p-6 divide-y divide-border/10 text-sm">
              <div className="flex items-center justify-between py-4 first:pt-0">
                <span className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-muted-foreground/80" />
                  Full Name
                </span>
                <span className="font-bold text-foreground/90 text-right">{user?.name || 'Not Provided'}</span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
                  <Mail className="h-4.5 w-4.5 text-muted-foreground/80" />
                  Email Address
                </span>
                <span className="font-bold text-foreground/90 select-all text-right">{user?.email}</span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-muted-foreground/80" />
                  Account ID
                </span>
                <span className="font-mono text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg border-none select-all font-bold text-right shadow-premium-sm">
                  {user?.id || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard" className="flex-1">
              <Button variant="primary" className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 cursor-pointer rounded-xl font-bold shadow-premium-md spring-transition hover:scale-[1.01]">
                Continue Shopping
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/orders" className="flex-1">
              <Button variant="outline" className="w-full h-11 flex items-center justify-center gap-2 rounded-xl font-bold border-border/60 text-muted-foreground hover:bg-secondary/50 cursor-pointer spring-transition">
                View Order History
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
