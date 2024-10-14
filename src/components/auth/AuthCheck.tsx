'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {LoadingSpinner} from "@/components/LoadingSpinner";

type AuthCheckProps = {
    readonly children: React.ReactNode;
};

export function AuthCheck({ children }: AuthCheckProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/check-auth');
                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    // Redirect to home if unauthorized
                    router.push('/?error=auth_required');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                // Redirect to home on error
                router.push('/?error=auth_required');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return <div><LoadingSpinner/></div>; // or a more sophisticated loading component
    }

    if (!isAuthenticated) {
        return null; // This will briefly show while redirecting
    }

    return <>{children}</>;
}
