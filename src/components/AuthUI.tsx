'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    LoginForm,
    LoginFormData,
    loginSchema,
    RegisterForm,
    RegisterFormData,
    registerSchema
} from '@/components/AuthForms';
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {login, register} from '@/app/actions';

export function AuthUI() {
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const error = params.get('error');
        const message = params.get('message');

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
    }, [router]);

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
        <>
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
            <p className="text-center mt-4">
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
        </>
    );
}
