"use client";
import {useEffect, useState} from "react";
import {FinancialSummaryTable} from "./FinancialSummaryTable";
import {SankeyChart} from "./SankeyChart";
import {RevenueBarChart} from "./RevenueBarChart";
import {OperatingExpensesPieChart} from "./OperatingExpensesPieChart";
import {ToggleViewButton} from "../ToggleViewButton";
import {AmountFormatSelector} from "./AmountFormatSelector";
import {Card, CardContent} from "../ui/card";
import {LoadingSpinner} from "../LoadingSpinner";
import {ErrorMessage} from "../ErrorMessage";
import {financialData, FinancialData} from "@/lib/data/financialData";

export function FinancialDashboard() {
    const [isGraphicView, setIsGraphicView] = useState(true);
    const [amountFormat, setAmountFormat] = useState("default");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<FinancialData | null>(null);

    useEffect(() => {
        // Simulate API call
        const fetchData = async () => {
            try {
                setLoading(true);
                // In a real application, you would fetch data from an API here
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
                setData(financialData);
                setLoading(false);
            } catch (err) {
                setError("Failed to load financial data. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleView = () => {
        setIsGraphicView(!isGraphicView);
    };

    const handleFormatChange = (format: string) => {
        setAmountFormat(format);
    };

    if (loading) {
        return <LoadingSpinner/>;
    }

    if (error) {
        return <ErrorMessage message={error}/>;
    }

    if (!data) {
        return null;
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-end items-center mb-4 space-x-4">
                        <AmountFormatSelector onFormatChange={handleFormatChange}/>
                        <ToggleViewButton
                            isGraphicView={isGraphicView}
                            onToggle={toggleView}
                        />
                    </div>
                    {isGraphicView ? (
                        <>
                            <SankeyChart amountFormat={amountFormat} data={data}/>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <RevenueBarChart amountFormat={amountFormat} data={data}/>
                                <OperatingExpensesPieChart
                                    amountFormat={amountFormat}
                                    data={data}
                                />
                            </div>
                        </>
                    ) : (
                        <FinancialSummaryTable amountFormat={amountFormat} data={data}/>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
