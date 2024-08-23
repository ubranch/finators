// src/components/FinancialSummaryTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { financialData } from "@/lib/data/financialData"

export function FinancialSummaryTable() {
  const formatNumber = (num: string) => new Intl.NumberFormat('en-US').format(Number(num));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Ratio (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell rowSpan={3}>Revenue</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>{formatNumber(financialData.Revenue.Company.Payment)}</TableCell>
              <TableCell>{formatNumber(financialData.Revenue.Company.Paid)}</TableCell>
              <TableCell>{financialData.Revenue.Company.Ratio}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Individual</TableCell>
              <TableCell>{formatNumber(financialData.Revenue.Individual.Payment)}</TableCell>
              <TableCell>{formatNumber(financialData.Revenue.Individual.Paid)}</TableCell>
              <TableCell>{financialData.Revenue.Individual.Ratio}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>{formatNumber(financialData.Revenue.Total.Payment)}</TableCell>
              <TableCell>{formatNumber(financialData.Revenue.Total.Paid)}</TableCell>
              <TableCell>100.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>COGS</TableCell>
              <TableCell>{formatNumber(financialData.COGS.Amount)}</TableCell>
              <TableCell>{formatNumber(financialData.COGS.Amount)}</TableCell>
              <TableCell>{financialData.COGS.Ratio}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Gross Profit</TableCell>
              <TableCell>{formatNumber(financialData.GrossProfit.Payment)}</TableCell>
              <TableCell>{formatNumber(financialData.GrossProfit.Paid)}</TableCell>
              <TableCell>{financialData.GrossProfit.Ratio}</TableCell>
            </TableRow>
            {Object.entries(financialData.OperatingExpenses).map(([key, value]) => (
              key !== 'Total' && (
                <TableRow key={key}>
                  <TableCell>{key === 'Other' ? 'Operating Expenses' : ''}</TableCell>
                  <TableCell>{key}</TableCell>
                  <TableCell>{formatNumber(value.Amount)}</TableCell>
                  <TableCell>{formatNumber(value.Amount)}</TableCell>
                  <TableCell>{value.Ratio}</TableCell>
                </TableRow>
              )
            ))}
            <TableRow>
              <TableCell colSpan={2}>Net Profit</TableCell>
              <TableCell>{formatNumber(financialData.NetProfit.Payment)}</TableCell>
              <TableCell>{formatNumber(financialData.NetProfit.Paid)}</TableCell>
              <TableCell>{financialData.NetProfit.Ratio}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
