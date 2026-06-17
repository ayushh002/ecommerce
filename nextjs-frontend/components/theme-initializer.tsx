'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/ui-store';

export default function ThemeInitializer() {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    // Read directly from localStorage on mount to bypass any async hydration lag
    let activeTheme = theme;
    
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ecommerce-ui');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.state?.theme) {
            activeTheme = parsed.state.theme;
          }
        } catch (e) {
          // ignore parsing error
        }
      }
    }

    const root = window.document.documentElement;
    if (activeTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return null;
}
