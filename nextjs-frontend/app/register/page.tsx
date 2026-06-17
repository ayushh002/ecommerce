'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerSchema, RegisterDto } from '@/schemas/auth-schema';
import { authService } from '@/services/auth';
import { useUIStore } from '@/store/ui-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Lock, Mail, User, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useUIStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterDto) => {
    setIsSubmitting(true);
    try {
      await authService.register(data);
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || 'Failed to register. Please try again.';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12 transition-colors duration-300">
      {/* Theme Toggle Button in top right */}
      <div className="absolute right-6 top-6 z-50">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 border-border/40 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer rounded-xl shadow-premium-sm spring-transition"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      {/* Background gradients */}
      <div className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-secondary/40 dark:bg-card/50 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center animate-fade-in">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 mb-4 spring-transition hover:scale-105">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Apex<span className="text-primary">Cart</span>
          </h1>
          <p className="text-xs text-muted-foreground font-semibold mt-2">
            Create your customer account to start shopping
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-card rounded-3xl p-8 shadow-premium-lg border border-border/60">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="relative">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                className="pl-10 bg-secondary/35 border-border/20 focus:border-primary/40 focus:bg-background focus-visible:ring-primary shadow-premium-sm"
                error={errors.name?.message}
                {...register('name')}
              />
              <User className="absolute left-3.5 top-[37px] h-4 w-4 text-muted-foreground/80" />
            </div>

            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                className="pl-10 bg-secondary/35 border-border/20 focus:border-primary/40 focus:bg-background focus-visible:ring-primary shadow-premium-sm"
                error={errors.email?.message}
                {...register('email')}
              />
              <Mail className="absolute left-3.5 top-[37px] h-4 w-4 text-muted-foreground/80" />
            </div>

            <div className="relative">
              <Input
                label="Password (Min. 6 Characters)"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10 bg-secondary/35 border-border/20 focus:border-primary/40 focus:bg-background focus-visible:ring-primary shadow-premium-sm"
                error={errors.password?.message}
                {...register('password')}
              />
              <Lock className="absolute left-3.5 top-[37px] h-4 w-4 text-muted-foreground/80" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[36px] text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-xl font-bold shadow-premium-md spring-transition hover:scale-[1.01] mt-2"
              isLoading={isSubmitting}
            >
              Create Account
            </Button>
          </form>

          {/* Login navigation Link */}
          <div className="mt-6 text-center text-xs">
            <p className="text-muted-foreground font-medium">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-primary hover:underline transition-colors ml-0.5">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
