'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart';
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { CheckoutModal } from './checkout-modal';
import { formatPrice } from '@/lib/utils';
import { Plus, Minus, Trash2, ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const queryClient = useQueryClient();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  // Load cart items query
  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    enabled: isOpen,
  });

  // Modify cart item quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartService.updateQuantity(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      const errMsg = error?.response?.data?.message || 'Failed to update quantity.';
      toast.error(errMsg);
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: (productId: string) => cartService.removeFromCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item removed from cart');
    },
    onError: () => {
      toast.error('Failed to remove item');
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Cart cleared');
    },
    onError: () => {
      toast.error('Failed to clear cart');
    },
  });

  const handleIncrement = (productId: string, currentQty: number, maxStock: number) => {
    if (currentQty >= maxStock) {
      toast.warning(`Cannot exceed available stock (${maxStock})`);
      return;
    }
    updateQuantityMutation.mutate({ productId, quantity: currentQty + 1 });
  };

  const handleDecrement = (productId: string, currentQty: number) => {
    if (currentQty <= 1) {
      removeItemMutation.mutate(productId);
    } else {
      updateQuantityMutation.mutate({ productId, quantity: currentQty - 1 });
    }
  };

  const hasItems = cartData && cartData.items && cartData.items.length > 0;

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} title="Your Shopping Cart">
        {isLoading ? (
          <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading cart items...</p>
          </div>
        ) : !hasItems ? (
          <div className="flex h-[60vh] flex-col items-center justify-center text-center space-y-4 px-4 animate-fade-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold">Your cart is empty</h3>
              <p className="text-xs text-muted-foreground max-w-[200px] leading-normal">
                Add products from the catalog to see them here!
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onClose} className="mt-2">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full space-y-6">
            {/* Cart Items List */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {cartData?.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-all duration-300 group relative shadow-premium-sm border-none"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-secondary shrink-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="64px"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs font-semibold bg-secondary/80">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold truncate pr-6 text-foreground/90 group-hover:text-primary transition-colors">{item.name}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">{formatPrice(item.price)} each</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-secondary rounded-xl p-0.5 shadow-premium-sm shrink-0">
                        <button
                          onClick={() => handleDecrement(item.productId, item.quantity)}
                          className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/80 rounded-lg spring-transition cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold select-none">{item.quantity}</span>
                        <button
                          onClick={() => handleIncrement(item.productId, item.quantity, item.stock)}
                          className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/80 rounded-lg spring-transition cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="text-sm font-extrabold text-foreground/90">{formatPrice(item.subTotal)}</span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItemMutation.mutate(item.productId)}
                    className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-destructive p-1 rounded-lg hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Summary & Checkout Button */}
            <div className="border-t border-border/10 pt-4 space-y-4 bg-background">
              <div className="flex justify-between items-center text-sm px-1">
                <span className="text-muted-foreground font-semibold">Cart Total</span>
                <span className="text-xl font-extrabold text-primary tracking-tight">
                  {formatPrice(cartData?.totalPrice || 0)}
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 border-border/60 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 cursor-pointer rounded-xl spring-transition font-bold"
                  onClick={() => clearCartMutation.mutate()}
                  isLoading={clearCartMutation.isPending}
                >
                  Clear
                </Button>
                <Button
                  className="flex-[2] bg-primary hover:bg-primary/90 text-primary-foreground h-11 flex items-center justify-center gap-1.5 cursor-pointer font-bold rounded-xl shadow-premium-md spring-transition hover:scale-[1.01]"
                  onClick={() => setCheckoutOpen(true)}
                >
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Checkout Confirmation Overlay */}
      {cartData && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setCheckoutOpen(false)}
          totalPrice={cartData.totalPrice}
          onSuccess={() => {
            setCheckoutOpen(false);
            onClose(); // close cart drawer too
          }}
        />
      )}
    </>
  );
}
