import {Inter} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/ThemeProvider";
import {Toaster} from 'sonner';
import React from "react";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
    title: "Financial Dashboard",
    description: "A comprehensive financial dashboard with authentication",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
        >
            {children}
            <Toaster
                richColors
                position="top-center"
                toastOptions={{
                    className: 'border-2',
                }}
            />
        </ThemeProvider>
        </body>
        </html>
    );
}
