import { FinancialDashboard } from "@/components/FinancialDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Home() {
  return (
    <main className="container mx-auto py-10 flex-grow overflow-y-auto">
      <SpeedInsights />
      <Analytics />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Finators</h1>
        <ThemeToggle />
      </div>
      <FinancialDashboard />
    </main>
  );
}
