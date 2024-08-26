import { FinancialDashboard } from "@/components/FinancialDashboard";

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Finators</h1>
      <FinancialDashboard />
    </main>
  );
}
