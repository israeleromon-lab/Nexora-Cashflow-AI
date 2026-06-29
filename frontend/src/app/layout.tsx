import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexora CashFlow AI",
  description: "Advanced AI-powered financial forecasting and scenario planning for modern SMEs. Manage revenue, track expenses, and get strategic CFO advice.",
  keywords: "cashflow, ai cfo, financial forecasting, startup finance, saas, financial planning",
  authors: [{ name: "Nexora" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
