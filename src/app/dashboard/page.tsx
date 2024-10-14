'use client';

import {logout} from '../actions';
import {FinancialDashboard} from "@/components/dashboard/FinancialDashboard";
import {AuthCheck} from "@/components/auth/AuthCheck";
import {Header} from "@/components/layout/header";
import {Button} from "@/components/ui/button";

export default function DashboardPage() {
    return (
        <AuthCheck>
            <div className="min-h-screen bg-background text-foreground">
                <Header/>
                <main className="container mx-auto py-10">
                    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
                    <p className="mb-4">Welcome to your dashboard</p>
                    <FinancialDashboard/>
                    <form action={logout} className="mt-8">
                        <Button type="submit" variant="destructive">Logout</Button>
                    </form>
                </main>
            </div>
        </AuthCheck>
    );
}
