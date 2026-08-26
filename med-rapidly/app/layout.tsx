import type { Metadata } from "next";
import { Inter } from "next/font/google";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://medrapidly.com"),
  title: "Med Rapidly - Digital Queue Management for Hospitals",
  description: "Replace paper waiting lists with a digital queue system. One QR code, real-time tracking, digital prescriptions.",
  keywords: "hospital queue, patient intake, digital reception, OPD management, queue system",
  authors: [{ name: "Med Rapidly" }],
  creator: "Med Rapidly",
  publisher: "Med Rapidly",
  robots: "index, follow",
  alternates: {
    canonical: "https://medrapidly.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://medrapidly.com",
    title: "Med Rapidly - Digital Queue Management",
    description: "Transform your hospital's patient experience with intelligent digital queues",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Med Rapidly - Digital Queue Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Med Rapidly",
    description: "Digital queue management for hospitals",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0066cc" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
