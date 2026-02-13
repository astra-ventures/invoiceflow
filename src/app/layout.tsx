import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free Invoice Generator - Create Professional Invoices in 60 Seconds | InvoiceFlow",
  description:
    "Free invoice generator for freelancers and small businesses. Create professional invoices in 60 seconds with no signup required. Include time tracking, recurring invoices, and instant payment links.",
  keywords: [
    "free invoice generator",
    "invoice template", 
    "create invoice online",
    "invoice maker",
    "freelance invoicing",
    "small business invoices",
    "invoice software",
    "billing software",
    "professional invoices"
  ],
  openGraph: {
    title: "Free Invoice Generator - Create Professional Invoices Fast",
    description:
      "Free invoice generator with time tracking, recurring invoices, and payment links. No signup required, just fast professional invoicing.",
    type: "website",
    siteName: "InvoiceFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Generator - Professional Invoices in 60 Seconds",
    description: "Create beautiful invoices instantly. Free forever, no signup required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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
