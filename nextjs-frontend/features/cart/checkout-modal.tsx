'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '@/services/orders';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { ClipboardCheck, CreditCard, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
  onSuccess: () => void;
}

export function CheckoutModal({ isOpen, onClose, totalPrice, onSuccess }: CheckoutModalProps) {
  const queryClient = useQueryClient();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);

  const placeOrderMutation = useMutation({
    mutationFn: () => ordersService.placeOrder('COD'),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setPlacedOrderDetails(data);
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
    },
    onError: (error: any) => {
      const errMsg = error?.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(errMsg);
    },
  });

  const handleClose = () => {
    setOrderPlaced(false);
    setPlacedOrderDetails(null);
    onClose();
    if (orderPlaced) {
      onSuccess();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={orderPlaced ? 'Order Confirmed!' : 'Confirm Your Purchase'}
      description={orderPlaced ? '' : 'Please review your order details before completing the checkout.'}
      className="max-w-md"
    >
      {orderPlaced ? (
        /* Success State */
        <div className="flex flex-col items-center text-center py-6 space-y-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-premium-sm">
            <ClipboardCheck className="h-10 w-10 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold tracking-tight text-foreground/90">Thank you for your order!</h3>
            <p className="text-xs text-muted-foreground px-2 leading-relaxed">
              Your order has been placed successfully and is currently being processed.
            </p>
          </div>

          <div className="w-full bg-secondary/40 rounded-2xl p-4.5 text-left text-sm space-y-3.5 shadow-premium-sm border-none">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-semibold">Order ID</span>
              <span className="font-bold select-all font-mono text-xs text-foreground/80">{placedOrderDetails?._id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-semibold">Total Paid</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatPrice(placedOrderDetails?.totalAmount || totalPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-semibold">Payment Method</span>
              <span className="font-bold text-foreground/80">{placedOrderDetails?.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-semibold">Status</span>
              <span className="font-extrabold text-primary tracking-wide uppercase text-[10px] bg-primary/10 px-2 py-0.5 rounded-full">{placedOrderDetails?.status}</span>
            </div>
          </div>

          <Button onClick={handleClose} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-xl font-bold shadow-premium-md spring-transition hover:scale-[1.01]">
            Back to Dashboard
          </Button>
        </div>
      ) : (
        /* Checkout Summary & Action */
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="bg-secondary/45 rounded-2xl p-4.5 space-y-4 shadow-premium-sm border-none">
              <div className="flex justify-between items-center text-sm">
                <span className="text-xs text-muted-foreground font-semibold">Payment Method</span>
                <span className="flex items-center gap-1.5 font-bold text-foreground/90">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Cash On Delivery (COD)
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-xs text-muted-foreground font-semibold">Shipping Status</span>
                <span className="font-bold text-emerald-500">Free Shipping</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 bg-primary/5 px-4.5 rounded-2xl border-none shadow-premium-sm">
              <span className="text-sm font-bold text-foreground/95">Total Amount</span>
              <span className="text-xl font-extrabold text-primary tracking-tight">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-secondary/50 p-4 rounded-xl text-[11px] text-muted-foreground leading-relaxed shadow-premium-sm border-none">
            <ShieldCheck className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
            <span className="font-medium">
              Order placement decrements stock instantly. Payment will be collected in cash upon delivery at your address.
            </span>
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1 rounded-xl font-bold h-11 border-border/60 text-muted-foreground hover:bg-destructive/10 cursor-pointer" onClick={handleClose} disabled={placeOrderMutation.isPending}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold h-11 shadow-premium-md spring-transition hover:scale-[1.01] cursor-pointer"
              onClick={() => placeOrderMutation.mutate()}
              isLoading={placeOrderMutation.isPending}
            >
              Confirm & Place
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
