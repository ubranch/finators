"use client"
import { useState } from 'react'
import { FinancialSummaryTable } from "./FinancialSummaryTable"
import { SankeyChart } from "./SankeyChart"
import { RevenueBarChart } from "./RevenueBarChart"
import { OperatingExpensesPieChart } from "./OperatingExpensesPieChart"
import { ToggleViewButton } from "./ToggleViewButton"
import { AmountFormatSelector } from "./AmountFormatSelector"

export function FinancialDashboard() {
  const [isGraphicView, setIsGraphicView] = useState(true)
  const [amountFormat, setAmountFormat] = useState("default")

  const toggleView = () => {
    setIsGraphicView(!isGraphicView)
  }

  const handleFormatChange = (format: string) => {
    setAmountFormat(format)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4 space-x-4">
        <AmountFormatSelector onFormatChange={handleFormatChange} />
        <ToggleViewButton isGraphicView={isGraphicView} onToggle={toggleView} />
      </div>
      {isGraphicView ? (
        <>
          <SankeyChart amountFormat={amountFormat}/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RevenueBarChart amountFormat={amountFormat} />
            <OperatingExpensesPieChart amountFormat={amountFormat} />
          </div>
        </>
      ) : (
        <FinancialSummaryTable amountFormat={amountFormat} />
      )}
    </div>
  )
}
