'use client';

import {Suspense} from 'react';
import {Analytics} from "@vercel/analytics/react";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {AuthUI} from '@/components/auth/AuthUI';
import {Header} from "@/components/layout/header";

export default function Home() {
    return (
        <main className="flex flex-col min-h-screen bg-background text-foreground">
            <SpeedInsights/>
            <Analytics/>

            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-sm space-y-4">
                    <Header/>
                    <Suspense fallback={<div>Loading...</div>}>
                        <AuthUI/>
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
