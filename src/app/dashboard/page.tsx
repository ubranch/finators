'use client';

import { useRouter } from 'next/navigation';
import { logout } from '../actions';
import { FinancialDashboard } from "@/components/dashboard/FinancialDashboard";
import { AuthCheck } from "@/components/auth/AuthCheck";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

export default function DashboardPage() {
    const router = useRouter();

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            toast.success('Logged out successfully');
            router.push('/');
        }
    };

    return (
        <AuthCheck>
            <div className="min-h-screen bg-background text-foreground">
                <main className="container mx-auto py-10">
                    <Header />
                    <FinancialDashboard/>
                    <Button onClick={handleLogout} className="mt-8" variant="destructive">Logout</Button>
                </main>
            </div>
        </AuthCheck>
    );
}
