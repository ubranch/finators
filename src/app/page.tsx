'use client';

import {useEffect, useState, Suspense} from 'react';
import {useRouter} from 'next/navigation';
import {AuthUI} from '@/components/auth/AuthUI';
import {checkAuth} from '@/lib/auth';
import {Header} from "@/components/layout/header";
import {SpeedInsights} from "@vercel/speed-insights/react";
import {Analytics} from "@vercel/analytics/react";
import { LoadingSpinner } from '@/components/LoadingSpinner';


export default function Home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserAuth = async () => {
            const isAuthenticated = await checkAuth();
            if (isAuthenticated) {
                router.push('/dashboard');
            } else {
                setIsLoading(false);
            }
        };

        checkUserAuth();
    }, [router]);

    if (isLoading) {
        return <LoadingSpinner/>;
    }

    return (
        <main className="flex flex-col min-h-screen bg-background text-foreground">
            <SpeedInsights/>
            <Analytics/>

            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-sm space-y-4">
                    <Header/>
                    <Suspense fallback={<LoadingSpinner/>}>
                        <AuthUI/>
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
