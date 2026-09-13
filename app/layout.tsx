import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import {
  BRAND,
  brandDefaultTitle,
  brandTitleTemplate,
} from "@/lib/brand";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: brandDefaultTitle(),
    template: brandTitleTemplate(),
  },
  description: BRAND.description,
  keywords: [
    "letter of credit",
    "LC compliance",
    "trade finance",
    "document validation",
    "UCP 600",
    "export compliance",
  ],
  authors: [{ name: BRAND.name }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: BRAND.name,
    title: brandDefaultTitle(),
    description: BRAND.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#002878",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
