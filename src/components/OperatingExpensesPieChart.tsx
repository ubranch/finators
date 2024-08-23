// src/components/OperatingExpensesPieChart.tsx

import { Pie, PieChart, Cell, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { financialData } from "@/lib/data/financialData"

const chartData = [
  { name: 'Other', value: Number(financialData.OperatingExpenses.Other.Amount) },
  { name: 'Payroll', value: Number(financialData.OperatingExpenses.Payroll.Amount) },
  { name: 'Tax', value: Number(financialData.OperatingExpenses.Tax.Amount) },
  { name: 'Utility', value: Number(financialData.OperatingExpenses.Utility.Amount) },
]

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))']

const chartConfig = {
  Other: {
    label: "Other",
    color: COLORS[0],
  },
  Payroll: {
    label: "Payroll",
    color: COLORS[1],
  },
  Tax: {
    label: "Tax",
    color: COLORS[2],
  },
  Utility: {
    label: "Utility",
    color: COLORS[3],
  },
} satisfies ChartConfig

export function OperatingExpensesPieChart() {
  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'UZS' }).format(value)
  }

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0)

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text
        x={x}
        y={y}
        fill="dark"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operating Expenses</CardTitle>
        <CardDescription>Breakdown of operating expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                labelLine={true}
                label={renderCustomizedLabel}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value, entry: any) => (
                  <span style={{ color: entry.color }}>{value}</span>
                )}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => {
                      const percentage = ((value as number / totalValue) * 100).toFixed(2);
                      return (
                        <div className="flex flex-col gap-1">
                          <span className="font-medium" style={{ color: chartConfig[name as keyof typeof chartConfig].color }}>
                            {chartConfig[name as keyof typeof chartConfig].label}
                          </span>
                          <span>{`${formatTooltipValue(value as number)} (${percentage}%)`}</span>
                        </div>
                      )
                    }}
                  />
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
