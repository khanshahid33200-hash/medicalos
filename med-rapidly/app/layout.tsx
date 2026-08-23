import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Med Rapidly - Digital Queue Management for Hospitals",
  description: "Replace paper waiting lists with a digital queue system. One QR code, real-time tracking, digital prescriptions.",
  keywords: "hospital queue, patient intake, digital reception, OPD management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
