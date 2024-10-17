'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
    LoginForm,
    LoginFormData,
    loginSchema,
    RegisterForm,
    RegisterFormData,
    registerSchema
} from '@/components/auth/AuthForms';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { login, register } from '@/app/actions';

export function AuthUI() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
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
    }, [router, searchParams]);

    const handleLogin = async (data: LoginFormData) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);
        try {
            await login(formData);
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (data: RegisterFormData) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('passwordConfirm', data.passwordConfirm);
        formData.append('username', data.username);
        try {
            await register(formData);
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Card>
                <CardContent className="pt-6">
                    {isLogin ? (
                        <LoginForm
                            schema={loginSchema}
                            onSubmit={handleLogin}
                            renderAfter={() => (
                                <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </Button>
                            )}
                            props={{
                                password: {
                                    showPassword,
                                    setShowPassword,
                                },
                            }}
                        />
                    ) : (
                        <RegisterForm
                            schema={registerSchema}
                            onSubmit={handleRegister}
                            renderAfter={() => (
                                <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                                    {isLoading ? 'Registering...' : 'Register'}
                                </Button>
                            )}
                            props={{
                                password: {
                                    showPassword,
                                    setShowPassword,
                                },
                                passwordConfirm: {
                                    showPassword,
                                    setShowPassword,
                                },
                            }}
                        />
                    )}
                </CardContent>
            </Card>
            <p className="text-center mt-4">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLogin(!isLogin);
                        setShowPassword(false); // Reset password visibility when switching forms
                    }}
                    className="text-primary hover:underline"
                    disabled={isLoading}
                >
                    {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </button>
            </p>
        </>
    );
}
