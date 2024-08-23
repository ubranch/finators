// src/components/SankeyChart.tsx
"use client"

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlotCreator } from '@/lib/SankeyChart/PlotCreator'
import { financialData } from '@/lib/data/financialData'

export function SankeyChart() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const nodes_data = [
        [{ label: 'Company Revenue', color: '#4287f5' }, { label: 'Individual Revenue', color: '#41f48e' }],
        [{ label: 'Total Revenue', color: '#f542e6' }],
        [{ label: 'COGS', color: '#f54242' }, { label: 'Gross Profit', color: '#42e8f5' }],
        [{ label: 'Other', color: '#f5a442' }, { label: 'Payroll', color: '#8e42f5' },
         { label: 'Tax', color: '#42f5b9' }, { label: 'Utility', color: '#f542a1' }],
        [{ label: 'Net Profit', color: '#42f56f' }]
      ]

      const links_data = [
        { from: { column: 0, node: 0 }, to: { column: 1, node: 0 }, value: Number(financialData.Revenue.Company.Payment),
          color: { start: '#4287f5', end: '#f542e6' } },
        { from: { column: 0, node: 1 }, to: { column: 1, node: 0 }, value: Number(financialData.Revenue.Individual.Payment),
          color: { start: '#41f48e', end: '#f542e6' } },
        { from: { column: 1, node: 0 }, to: { column: 2, node: 0 }, value: Number(financialData.COGS.Amount),
          color: { start: '#f542e6', end: '#f54242' } },
        { from: { column: 1, node: 0 }, to: { column: 2, node: 1 }, value: Number(financialData.GrossProfit.Payment),
          color: { start: '#f542e6', end: '#42e8f5' } },
        { from: { column: 2, node: 1 }, to: { column: 3, node: 0 }, value: Number(financialData.OperatingExpenses.Other.Amount),
          color: { start: '#42e8f5', end: '#f5a442' } },
        { from: { column: 2, node: 1 }, to: { column: 3, node: 1 }, value: Number(financialData.OperatingExpenses.Payroll.Amount),
          color: { start: '#42e8f5', end: '#8e42f5' } },
        { from: { column: 2, node: 1 }, to: { column: 3, node: 2 }, value: Number(financialData.OperatingExpenses.Tax.Amount),
          color: { start: '#42e8f5', end: '#42f5b9' } },
        { from: { column: 2, node: 1 }, to: { column: 3, node: 3 }, value: Number(financialData.OperatingExpenses.Utility.Amount),
          color: { start: '#42e8f5', end: '#f542a1' } },
        { from: { column: 2, node: 1 }, to: { column: 4, node: 0 }, value: Number(financialData.NetProfit.Payment),
          color: { start: '#42e8f5', end: '#42f56f' } },
      ]

      new PlotCreator(
        containerRef.current,
        nodes_data,
        links_data,
        1000,  // plot width
        400,   // plot height
        0,     // first column
        5,     // last column
        {
          show_column_lines: false,
          show_column_names: false,
          node_move_y: true,
          linear_gradient_links: true,
          plot_background_color: 'transparent',
          default_links_opacity: 0.7,
          default_gradient_links_opacity: 0.7,
          vertical_gap_between_nodes: 0.3,
          node_percent_of_column_width: 0.7,
          hover_node_cursor: 'pointer',
          hover_link_cursor: 'crosshair',
          on_node_hover_function: (node_info) => `
            <strong>${node_info.label}</strong><br>
            Value: ${Number(node_info.height).toLocaleString('en-US', {maximumFractionDigits:0})} UZS
          `,
          on_link_hover_function: (link_info) => `
            <strong>${link_info.from_label} → ${link_info.to_label}</strong><br>
            Value: ${Number(link_info.value).toLocaleString('en-US', {maximumFractionDigits:0})} UZS
          `,
        }
      )
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Flow</CardTitle>
        <CardDescription>Sankey diagram of financial flows</CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="w-full h-[400px]" />
      </CardContent>
    </Card>
  )
}
