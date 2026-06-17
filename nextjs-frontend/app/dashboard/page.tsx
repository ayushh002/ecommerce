'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products';
import { ProductCard } from '@/features/products/product-card';
import { useUIStore } from '@/store/ui-store';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RotateCcw, Database, Grid, Sparkles, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useUIStore();
  const [isSeeding, setSeeding] = useState(false);

  // Fetch catalog query
  const { data: products = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsService.getProducts(),
  });

  // Extract unique categories dynamically from products
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter products by search and category
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Database Catalog Seeder handler
  const handleSeedCatalog = async () => {
    setSeeding(true);
    toast.loading('Seeding catalog data on backend...', { id: 'seeder' });

    const demoProducts = [
      {
        name: 'Logitech MX Master 3S',
        description: 'Ergonomic wireless mouse with ultra-fast MagSpeed scrolling, silent clicks, and 8K DPI track-on-glass sensor.',
        price: 99.99,
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60',
        category: 'Electronics',
      },
      {
        name: 'Varmilo Mechanical Keyboard',
        description: 'Premium RGB mechanical keyboard with Cherry MX Brown switches, dye-subbed PBT keycaps, and USB-C connectivity.',
        price: 139.99,
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60',
        category: 'Electronics',
      },
      {
        name: 'Wireless ANC Headphones',
        description: 'Over-ear headphones featuring Hybrid Active Noise Cancellation, high-fidelity sound quality, and 40-hour battery life.',
        price: 199.99,
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
        category: 'Electronics',
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Adjustable height office chair with 3D mesh support, dynamic lumbar alignment, and padded flip-up armrests.',
        price: 349.99,
        stock: 5,
        imageUrl: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&auto=format&fit=crop&q=60',
        category: 'Furniture',
      },
      {
        name: 'Leather Minimalist Desk Pad',
        description: 'Full grain leather desk pad backing, waterproof micro-weave surface, layout protection for keyboards & mice.',
        price: 49.99,
        stock: 22,
        imageUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&auto=format&fit=crop&q=60',
        category: 'Office',
      },
      {
        name: 'Stainless Steel Water Bottle',
        description: 'Double-walled vacuum insulated water flask. Keeps beverages cold for 24 hours or hot for 12 hours.',
        price: 29.99,
        stock: 45,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60',
        category: 'Accessories',
      },
    ];

    try {
      for (const prod of demoProducts) {
        await productsService.createProduct(prod);
      }
      toast.success('Product catalog seeded successfully!', { id: 'seeder' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (err: any) {
      toast.error('Failed to seed catalog: ' + (err.response?.data?.message || err.message), { id: 'seeder' });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground/90">Our Collection</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Browse and search from our complete stock inventory.
          </p>
        </div>
        {/* Search Bar input */}
        <div className="relative w-full sm:max-w-sm shrink-0">
          <Input
            placeholder="Search products..."
            className="pl-10 h-10 bg-secondary/35 border border-border/80 focus:border-primary focus-visible:ring-primary/20 shadow-premium-sm transition-all focus:shadow-premium-md placeholder:text-muted-foreground/80 text-sm font-medium focus:bg-background rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3.5 top-[12px] h-4.5 w-4.5 text-muted-foreground/70" />
        </div>
      </div>

      {/* Categories Segmented Control (Apple Store / Shopify inspired) */}
      {products.length > 0 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none select-none">
          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground mr-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Category</span>
          </div>
          <div className="bg-secondary/70 p-1 rounded-xl flex gap-1 shadow-premium-sm border border-border/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-350 cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-card text-foreground shadow-premium-sm scale-[1.02]'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Catalog Rendering */}
      {isLoading ? (
        /* Loading Skeletons Grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <div className="p-4 flex-1 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-8 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-4 w-1/5" />
                </div>
              </div>
              <div className="p-4 pt-0 flex gap-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-8 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        /* Error State fallback */
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-2xl bg-card gap-4">
          <p className="text-sm text-destructive font-medium">Failed to load product catalog.</p>
          <Button variant="outline" onClick={() => refetch()} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Retry Connection
          </Button>
        </div>
      ) : products.length === 0 ? (
        /* Empty Database Seeder helper */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border/80 rounded-2xl bg-card/50 max-w-xl mx-auto space-y-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Database className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Your database is empty</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No products found in the database. You can manually seed the catalog with 6 beautiful high-quality mock items using the button below.
            </p>
          </div>
          <Button
            onClick={handleSeedCatalog}
            isLoading={isSeeding}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-11 flex items-center gap-2"
          >
            <Sparkles className="h-4.5 w-4.5" />
            Seed Demo Product Catalog
          </Button>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Search/Filter Empty View fallback */
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Search className="h-5 w-5" />
          </div>
          <h4 className="text-base font-semibold">No matches found</h4>
          <p className="text-xs text-muted-foreground max-w-[240px] leading-normal">
            No products matched search query "{searchQuery}" or category filter "{selectedCategory}".
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-blue-500 mt-1 cursor-pointer"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        /* Grid Display */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
