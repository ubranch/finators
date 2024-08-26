"use client";

import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { financialData } from "@/lib/data/financialData";
import { formatAmount } from "@/lib/utils";

const chartData = [
  {
    name: "Company",
    Payment: Number(financialData.Revenue.Company.Payment),
    Paid: Number(financialData.Revenue.Company.Paid),
  },
  {
    name: "Individual",
    Payment: Number(financialData.Revenue.Individual.Payment),
    Paid: Number(financialData.Revenue.Individual.Paid),
  },
];

const chartConfig = {
  Payment: {
    label: "Payment",
    color: "hsl(var(--chart-1))",
  },
  Paid: {
    label: "Paid",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function RevenueBarChart({
  amountFormat,
}: Readonly<{ amountFormat: string }>) {
  const formatYAxis = (tickItem: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(tickItem);
  };

  // Will be needed in the future
  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "UZS",
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>
          Company vs Individual revenue for June
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatYAxis} />
              <Legend />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="font-medium"
                          style={{
                            color:
                              chartConfig[name as keyof typeof chartConfig]
                                .color,
                          }}
                        >
                          {chartConfig[name as keyof typeof chartConfig].label}:
                        </span>
                        <span>
                          {formatAmount(value.toString(), amountFormat)}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="Payment"
                fill={chartConfig.Payment.color}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Paid"
                fill={chartConfig.Paid.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
