import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { cn, formatAmount } from "@/lib/utils";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { FinancialData } from "@/lib/data/financialData";

interface FinancialSummaryTableProps {
  amountFormat: string;
  data: FinancialData;
}

export function FinancialSummaryTable({
  amountFormat,
  data,
}: Readonly<FinancialSummaryTableProps>) {
  const [showOperatingExpenses, setShowOperatingExpenses] = useState(false);

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
                {formatAmount(data.Revenue.Company.Payment, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(data.Revenue.Company.Paid, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {data.Revenue.Company.Ratio}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Individual</TableCell>
              <TableCell className="text-right">
                {formatAmount(data.Revenue.Individual.Payment, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(data.Revenue.Individual.Paid, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {data.Revenue.Individual.Ratio}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell className="text-right">
                {formatAmount(data.Revenue.Total.Payment, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(data.Revenue.Total.Paid, amountFormat)}
              </TableCell>
              <TableCell className="text-right">100.00</TableCell>
            </TableRow>

            {/* COGS */}
            <TableRow>
              <TableCell colSpan={2}>Cost of Goods Sold (COGS)</TableCell>
              <TableCell className="text-right">
                {formatAmount(data.COGS.Amount, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(data.COGS.Amount, amountFormat)}
              </TableCell>
              <TableCell className="text-right">{data.COGS.Ratio}</TableCell>
            </TableRow>

            {/* Gross Profit */}
            <TableRow>
              <TableCell colSpan={2}>Gross Profit</TableCell>
              <TableCell className="text-right">
                {formatAmount(data.GrossProfit.Payment, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(data.GrossProfit.Paid, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {data.GrossProfit.Ratio}
              </TableCell>
            </TableRow>

            {/* Operating Expenses */}
            <TableRow>
              <TableCell
                colSpan={2}
                className="cursor-pointer flex items-center justify-between"
                onClick={() => setShowOperatingExpenses(!showOperatingExpenses)}
              >
                Operating Expenses
                <ChevronDownIcon
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    showOperatingExpenses ? "rotate-180" : "",
                  )}
                />
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(
                  data.OperatingExpenses.Total.Amount,
                  amountFormat,
                )}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(
                  data.OperatingExpenses.Total.Amount,
                  amountFormat,
                )}
              </TableCell>
              <TableCell className="text-right">
                {data.OperatingExpenses.Total.Ratio}
              </TableCell>
            </TableRow>
            {showOperatingExpenses &&
              Object.entries(data.OperatingExpenses).map(
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
                      <TableCell className="text-right">
                        {value.Ratio}
                      </TableCell>
                    </TableRow>
                  ),
              )}

            {/* Net Profit */}
            <TableRow>
              <TableCell colSpan={2}>Net Profit</TableCell>
              <TableCell className="text-right">
                {formatAmount(data.NetProfit.Payment, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(data.NetProfit.Paid, amountFormat)}
              </TableCell>
              <TableCell className="text-right">
                {data.NetProfit.Ratio}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
