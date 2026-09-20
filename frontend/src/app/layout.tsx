import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Circular Tech — AI-Powered Circular Resource Intelligence",
  description: "Circular Tech turns institutional IT assets into intelligent lifecycle decisions. AI-powered circular economy platform for laptops, monitors, projectors and printers.",
  keywords: "circular economy, AI asset management, e-waste reduction, resource lifecycle, sustainable IT",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
