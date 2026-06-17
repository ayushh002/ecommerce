'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types';
import { cartService } from '@/services/cart';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { Plus, Minus, ShoppingCart, Info } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Dialog } from '@/components/ui/dialog';
import { useUIStore } from '@/store/ui-store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  const addToCartMutation = useMutation({
    mutationFn: () => cartService.addToCart(product._id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(`Added ${quantity} ${product.name} to cart`);
      setIsAdded(true);
    },
    onError: (error: any) => {
      const errMsg = error?.response?.data?.message || 'Failed to add item to cart.';
      toast.error(errMsg);
    },
  });

  const handleIncrement = () => {
    if (quantity >= product.stock) {
      toast.warning(`Cannot exceed available stock (${product.stock})`);
      return;
    }
    setQuantity((q) => q + 1);
  };

  const handleDecrement = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleOpenDetails = () => {
    setIsAdded(false);
    setQuantity(1);
    setDetailOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailOpen(false);
    setIsAdded(false);
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <>
      <Card className="group flex flex-col h-full glass-panel cursor-pointer" onClick={handleOpenDetails}>
        {/* Image Frame with hover transitions */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary border-b border-border/10 shrink-0">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs font-semibold bg-secondary/80">
              No Product Image
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            <Badge className="bg-black text-white hover:bg-black/90 dark:bg-black dark:text-white border-transparent text-[10px] font-black uppercase tracking-wider shadow-premium-sm">
              {product.category}
            </Badge>
            {isOutOfStock && (
              <Badge variant="destructive" className="text-[10px] font-black uppercase tracking-wider">
                Sold Out
              </Badge>
            )}
            {isLowStock && (
              <Badge variant="warning" className="text-[10px] font-black uppercase tracking-wider text-black bg-amber-400">
                Only {product.stock} Left
              </Badge>
            )}
          </div>
        </div>

        {/* Content Info — Generous padding (p-6) & clean hierarchy */}
        <CardContent className="p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <h4 className="font-bold text-sm leading-tight text-foreground/90 tracking-tight transition-colors group-hover:text-primary">
              {product.name}
            </h4>
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed min-h-[32px]">
              {product.description}
            </p>
          </div>

          <div className="flex items-baseline justify-between mt-4">
            <span className="text-base font-extrabold text-primary tracking-tight">
              {formatPrice(product.price)}
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground">
              Stock: {product.stock} items
            </span>
          </div>
        </CardContent>

        {/* Footer Actions — Stop click propagation so clicks on buttons don't open details modal */}
        <CardFooter className="p-6 pt-0 border-t border-border/10" onClick={(e) => e.stopPropagation()}>
          <Button
            className="w-full bg-primary hover:bg-primary/90 hover:scale-[1.01] shadow-premium-sm spring-transition h-10 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer rounded-xl"
            onClick={handleOpenDetails}
          >
            View Product
          </Button>
        </CardFooter>
      </Card>

      {/* Product Details Dialog */}
      <Dialog
        isOpen={isDetailOpen}
        onClose={handleCloseDetails}
        title={product.name}
        className="max-w-lg"
      >
        <div className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-secondary border border-border/10">
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="500px" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm font-semibold">
                No Product Image Available
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
              <Badge className="bg-black text-white dark:bg-black dark:text-white border-transparent text-[10px] font-black uppercase tracking-wider px-2.5 py-1 shadow-premium-sm">
                {product.category}
              </Badge>
              <div className="flex gap-1.5 text-xs font-semibold">
                {isOutOfStock ? (
                  <Badge variant="destructive" className="font-bold">Out Of Stock</Badge>
                ) : isLowStock ? (
                  <Badge variant="warning" className="font-bold text-black bg-amber-400">Low Stock ({product.stock} left)</Badge>
                ) : (
                  <Badge variant="success" className="font-bold">In Stock ({product.stock})</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</h4>
              <p className="text-sm text-foreground/80 leading-relaxed bg-secondary/35 p-4 rounded-xl border border-border/10">
                {product.description}
              </p>
            </div>

            <div className="flex justify-between items-center py-4 px-2 border-t border-b border-border/10">
              <span className="text-muted-foreground text-sm font-semibold">Price per unit</span>
              <span className="text-2xl font-black text-primary tracking-tight">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          {!isAdded ? (
            <div className="flex items-center justify-between w-full gap-3 mt-4">
              {/* Quantity Selector inside Dialog */}
              <div className="flex items-center bg-secondary rounded-xl p-0.5 shrink-0 shadow-premium-sm">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={isOutOfStock}
                  className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/80 rounded-lg spring-transition disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-7 text-center text-xs font-bold select-none">
                  {isOutOfStock ? 0 : quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={isOutOfStock}
                  className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/80 rounded-lg spring-transition disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Add to Cart Button inside Dialog */}
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] shadow-premium-sm spring-transition h-9 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer rounded-xl"
                onClick={() => addToCartMutation.mutate()}
                disabled={isOutOfStock}
                isLoading={addToCartMutation.isPending}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add {quantity} to Cart
              </Button>
            </div>
          ) : (
            /* After adding to cart, show "View Cart" or "Back" buttons */
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-10 font-bold border-border/60 hover:bg-secondary/50 cursor-pointer spring-transition text-xs"
                onClick={handleCloseDetails}
              >
                Back
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-10 font-bold shadow-premium-md spring-transition hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-1.5 text-xs"
                onClick={() => {
                  handleCloseDetails();
                  setCartOpen(true);
                }}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                View Cart
              </Button>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}

