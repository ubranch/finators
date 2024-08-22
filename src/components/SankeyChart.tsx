'use client'

import React, { useEffect, useRef } from 'react'
import { PlotCreator } from '@/lib/SankeyChart/PlotCreator'

interface FinancialData {
  Revenue: {
    Company: string
    Individual: string
    Total: string
  }
  COGS: string
  "Gross Profit": string
  Other: string
  Payroll: string
  Tax: string
  Utility: string
  "Net profit": string
}

const data: FinancialData = {
  "Revenue": {
    "Company": "121028528",
    "Individual": "21944555",
    "Total": "142973083"
  },
  "COGS": "61088128",
  "Gross Profit": "81884955",
  "Other": "34255229",
  "Payroll": "25556400",
  "Tax": "3897672",
  "Utility": "10127000",
  "Net profit": "8048654"
}

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
        { from: { column: 0, node: 0 }, to: { column: 1, node: 0 }, value: Number(data.Revenue.Company),
          color: { start: '#4287f5', end: '#f542e6' } },
        { from: { column: 0, node: 1 }, to: { column: 1, node: 0 }, value: Number(data.Revenue.Individual),
          color: { start: '#41f48e', end: '#f542e6' } },
        { from: { column: 1, node: 0 }, to: { column: 2, node: 0 }, value: Number(data.COGS),
          color: { start: '#f542e6', end: '#f54242' } },
        { from: { column: 1, node: 0 }, to: { column: 2, node: 1 }, value: Number(data["Gross Profit"]),
          color: { start: '#f542e6', end: '#42e8f5' } },
        { from: { column: 2, node: 1 }, to: { column: 3, node: 0 }, value: Number(data.Other),
          color: { start: '#42e8f5', end: '#f5a442' } },
        { from: { column: 2, node: 1 }, to: { column: 3, node: 1 }, value: Number(data.Payroll),
          color: { start: '#42e8f5', end: '#8e42f5' } },
        { from: { column: 2, node: 1 }, to: { column: 3, node: 2 }, value: Number(data.Tax),
          color: { start: '#42e8f5', end: '#42f5b9' } },
        { from: { column: 2, node: 1 }, to: { column: 3, node: 3 }, value: Number(data.Utility),
          color: { start: '#42e8f5', end: '#f542a1' } },
        { from: { column: 2, node: 1 }, to: { column: 4, node: 0 }, value: Number(data["Net profit"]),
          color: { start: '#42e8f5', end: '#42f56f' } },
      ]

      new PlotCreator(
        containerRef.current,
        nodes_data,
        links_data,
        800,  // plot width
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
            Value: ${(node_info.height).toLocaleString('en-US', {maximumFractionDigits:0})} UZS
          `,
          on_link_hover_function: (link_info) => `
            <strong>${link_info.from_label} → ${link_info.to_label}</strong><br>
            Value: ${(link_info.value).toLocaleString('en-US', {maximumFractionDigits:0})} UZS
          `,
        }
      )
    }
  }, [])

  return <div ref={containerRef} className="w-full h-[600px]" />
}
