import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { financialData } from "@/lib/data/financialData"
import { useState } from "react"
import { formatAmount } from "@/lib/utils"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

export function FinancialSummaryTable({ amountFormat }: { amountFormat: string }) {  const formatNumber = (num: string) =>
    new Intl.NumberFormat("en-US").format(Number(num))

  const [showOperatingExpenses, setShowOperatingExpenses] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Payment</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Ratio (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Revenue */}
            <TableRow>
              <TableCell rowSpan={3}>Revenue</TableCell>
              <TableCell>Company</TableCell>
              <TableCell className="text-right">
                {formatAmount(financialData.Revenue.Company.Payment, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(financialData.Revenue.Company.Paid, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {financialData.Revenue.Company.Ratio}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Individual</TableCell>
              <TableCell className="text-right">
                {formatAmount(financialData.Revenue.Individual.Payment, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(financialData.Revenue.Individual.Paid, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {financialData.Revenue.Individual.Ratio}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell className="text-right">
                {formatAmount(financialData.Revenue.Total.Payment, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(financialData.Revenue.Total.Paid, amountFormat)}
              </TableCell>
              <TableCell className="text-right">100.00</TableCell>
            </TableRow>

            {/* COGS */}
            <TableRow>
              <TableCell colSpan={2}>Cost of Goods Sold (COGS)</TableCell>
              <TableCell className="text-right">
                {formatAmount(financialData.COGS.Amount, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(financialData.COGS.Amount, amountFormat)}
              </TableCell>
              <TableCell className="text-right">{financialData.COGS.Ratio}</TableCell>
            </TableRow>

            {/* Gross Profit */}
            <TableRow>
              <TableCell colSpan={2}>Gross Profit</TableCell>
              <TableCell className="text-right">
                {formatAmount(financialData.GrossProfit.Payment, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(financialData.GrossProfit.Paid, amountFormat)}
              </TableCell>
              <TableCell className="text-right">{financialData.GrossProfit.Ratio}</TableCell>
            </TableRow>
                        {/* Operating Expenses */}
            <TableRow>
              <TableCell
                colSpan={2}
                className="cursor-pointer flex items-center justify-between"
                onClick={() =>
                  setShowOperatingExpenses(!showOperatingExpenses)
                }
              >
                Operating Expenses
                <ChevronDownIcon
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    showOperatingExpenses ? "rotate-180" : ""
                  )}
                />
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(
                  financialData.OperatingExpenses.Total.Amount,
                  amountFormat
                )}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(
                  financialData.OperatingExpenses.Total.Amount,
                  amountFormat
                )}
              </TableCell>
              <TableCell className="text-right">
                {financialData.OperatingExpenses.Total.Ratio}
              </TableCell>
            </TableRow>
            {showOperatingExpenses &&
              Object.entries(financialData.OperatingExpenses).map(
                ([key, value]) =>
                  key !== "Total" && (
                    <TableRow key={key}>
                      <TableCell></TableCell>
                      <TableCell className="pl-6">{key}</TableCell>
                      <TableCell className="text-right">
                        {formatAmount(value.Amount, amountFormat)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatAmount(value.Amount, amountFormat)}
                      </TableCell>
                      <TableCell className="text-right">{value.Ratio}</TableCell>
                    </TableRow>
                  )
              )}

            {/* Net Profit */}
            <TableRow>
              <TableCell colSpan={2}>Net Profit</TableCell>
              <TableCell className="text-right">
                {formatAmount(financialData.NetProfit.Payment, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(financialData.NetProfit.Paid, amountFormat)}
              </TableCell>
              <TableCell className="text-right">{financialData.NetProfit.Ratio}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
