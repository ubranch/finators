import { SankeyChart } from '@/components/SankeyChart'

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <main className="flex min-h-screen flex-col items-center justify-center py-12 sm:py-24">
        <h1 className="text-4xl font-bold mb-8 text-center">Financial Flow</h1>
        <div className="w-full max-w-4xl">
          <SankeyChart />
        </div>
      </main>
    </div>
  )
}
