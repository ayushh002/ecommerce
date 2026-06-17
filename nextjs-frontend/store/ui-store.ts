import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategory: 'All',
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      theme: 'dark', // default theme is dark for that premium, elegant vibe
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'ecommerce-ui',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
