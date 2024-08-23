import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Financial Dashboard',
  description: 'A comprehensive financial dashboard displaying revenue, operating expenses, and other key financial metrics.',
  keywords: ['finance', 'dashboard', 'revenue', 'expenses', 'analytics'],
  authors: [{ name: 'Ilya Ismailov' }],
  creator: 'Finators & Swift Team',
  publisher: 'Ilya Ismailov',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
