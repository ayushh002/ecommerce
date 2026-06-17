import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/query-provider';
import AuthGuard from '@/components/auth-guard';
import ThemeInitializer from '@/components/theme-initializer';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ApexCart - Premium E-Commerce Platform',
  description: 'A modern, responsive e-commerce web application driven by a NestJS backend.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeInitializer />
        <QueryProvider>
          <AuthGuard>
            {children}
            <Toaster richColors position="top-right" closeButton />
          </AuthGuard>
        </QueryProvider>
      </body>
    </html>
  );
}
