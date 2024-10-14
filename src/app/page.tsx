'use client';

import { login, register } from './actions';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useSearchParams, useRouter } from 'next/navigation';
import { LoginForm, RegisterForm, loginSchema, registerSchema, LoginFormData, RegisterFormData } from '@/components/AuthForms';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const showNotification = useCallback(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    if (error === 'login_failed') {
      toast.error('Login failed. Please try again.');
    } else if (error === 'registration_failed') {
      toast.error('Registration failed. Please try again.');
    } else if (error === 'passwords_do_not_match') {
      toast.error('Passwords do not match. Please try again.');
    } else if (error === 'auth_required') {
      toast.error('Please log in to access the dashboard');
    } else if (error === 'session_expired') {
      toast.error('Your session has expired. Please log in again.');
    }

    if (message === 'logged_out') {
      toast.success('Logged out successfully');
    } else if (message === 'registered') {
      toast.success('Registered and logged in successfully');
    }

    // Clear the URL parameters after showing the notification
    if (error || message) {
      router.replace('/');
    }
  }, [searchParams, router]);

  useEffect(() => {
    showNotification();
  }, [showNotification]);

  const handleLogin = async (data: LoginFormData) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    await login(formData);
  };

  const handleRegister = async (data: RegisterFormData) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('passwordConfirm', data.passwordConfirm);
    formData.append('username', data.username);
    await register(formData);
  };

  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      <SpeedInsights />
      <Analytics />

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-sm space-y-4">
          <Header/>
          <Card>
            <CardContent className="pt-6">
              {isLogin ? (
                <LoginForm
                  schema={loginSchema}
                  onSubmit={handleLogin}
                  renderAfter={() => (
                    <Button type="submit" className="w-full mt-4">
                      Login
                    </Button>
                  )}
                />
              ) : (
                <RegisterForm
                  schema={registerSchema}
                  onSubmit={handleRegister}
                  renderAfter={() => (
                    <Button type="submit" className="w-full mt-4">
                      Register
                    </Button>
                  )}
                />
              )}
            </CardContent>
          </Card>
          <p className="text-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLogin(!isLogin);
              }}
              className="text-primary hover:underline"
            >
              {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
