"use client"
import { useState } from 'react'
import { FinancialSummaryTable } from "./FinancialSummaryTable"
import { SankeyChart } from "./SankeyChart"
import { RevenueBarChart } from "./RevenueBarChart"
import { OperatingExpensesPieChart } from "./OperatingExpensesPieChart"
import { ToggleViewButton } from "./ToggleViewButton"

export function FinancialDashboard() {
  const [isGraphicView, setIsGraphicView] = useState(true);

  const toggleView = () => {
    setIsGraphicView(!isGraphicView);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <ToggleViewButton isGraphicView={isGraphicView} onToggle={toggleView} />
      </div>
      {isGraphicView ? (
        <>
          <SankeyChart />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RevenueBarChart />
            <OperatingExpensesPieChart />
          </div>
        </>
      ) : (
        <FinancialSummaryTable />
      )}
    </div>
  )
}
