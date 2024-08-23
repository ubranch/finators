// src/components/RevenueBarChart.tsx
"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { financialData } from "@/lib/data/financialData"

const chartData = [
  {
    name: 'Company',
    Payment: Number(financialData.Revenue.Company.Payment),
    Paid: Number(financialData.Revenue.Company.Paid),
  },
  {
    name: 'Individual',
    Payment: Number(financialData.Revenue.Individual.Payment),
    Paid: Number(financialData.Revenue.Individual.Paid),
  },
]

const chartConfig = {
  Payment: {
    label: "Payment",
    color: "hsl(var(--chart-1))",
  },
  Paid: {
    label: "Paid",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function RevenueBarChart() {
  const formatYAxis = (tickItem: number) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(tickItem)
  }

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'UZS' }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Company vs Individual revenue for June</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatYAxis} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-medium">{formatTooltipValue(value as number)}</span>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey="Payment" fill="var(--color-Payment)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Paid" fill="var(--color-Paid)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
