'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersService } from '@/services/orders';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { ClipboardList, Calendar, DollarSign, Package, AlertCircle } from 'lucide-react';
import Link from 'next/navigation';

export default function OrdersPage() {
  // Load user orders query
  const { data: orders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersService.getOrders(),
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Processing':
        return 'default';
      case 'Shipped':
        return 'secondary';
      case 'Delivered':
        return 'success';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Your Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor status and history of all purchases placed with this account.
        </p>
      </div>

      {isLoading ? (
        /* Skeletons */
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-card p-6 space-y-4 shadow-premium-sm animate-pulse">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-1/3 rounded-lg" />
                <Skeleton className="h-6 w-1/6 rounded-lg" />
              </div>
              <Skeleton className="h-px bg-border/40 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2 rounded-lg" />
                <Skeleton className="h-4 w-1/4 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        /* Connection error state fallback */
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-secondary/30 gap-4 border-none shadow-premium-sm">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-sm text-destructive font-bold">Failed to load order history.</p>
          <Button variant="outline" className="rounded-xl font-bold" onClick={() => refetch()}>
            Retry Connection
          </Button>
        </div>
      ) : orders.length === 0 ? (
        /* Empty orders history state fallback */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-secondary/35 max-w-xl mx-auto space-y-5 shadow-premium-sm border-none">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-premium-sm">
            <ClipboardList className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-foreground/90">No orders placed yet</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              You haven't placed any orders yet. Visit the catalog to add products to your cart and complete checkout.
            </p>
          </div>
          <a href="/dashboard">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-11 rounded-xl font-bold shadow-premium-md spring-transition hover:scale-[1.01]">
              Browse Products
            </Button>
          </a>
        </div>
      ) : (
        /* Order History List */
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl bg-card shadow-premium-md hover:shadow-premium-lg transition-all duration-300 overflow-hidden flex flex-col border-none"
            >
              {/* Order Header info block */}
              <div className="bg-secondary/40 px-6 py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-semibold">Order ID:</span>
                    <span className="font-mono text-xs font-bold select-all text-foreground/85 bg-secondary px-2.5 py-1 rounded-lg shadow-premium-sm border-none">
                      {order._id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={getStatusVariant(order.status)} className="capitalize px-3 py-1 font-bold text-[10px] tracking-wide rounded-full">
                    {order.status}
                  </Badge>
                </div>
              </div>

              {/* Order products list */}
              <div className="px-6 py-5 flex-1 divide-y divide-border/10">
                {order.products.map((item, idx) => (
                  <div key={item._id || idx} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 shadow-premium-sm border-none">
                        <Package className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-sm block truncate text-foreground/90">{item.name}</span>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          Qty: <span className="font-bold">{item.quantity}</span> &times; {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>

                    <span className="text-sm font-extrabold text-foreground/90 shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer summary */}
              <div className="bg-secondary/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground font-semibold text-xs">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span>Payment Method:</span>
                  <span className="font-bold text-foreground/80">{order.paymentMethod}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-muted-foreground">Total Amount:</span>
                  <span className="text-base font-extrabold text-primary">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
