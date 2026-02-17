import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://invoiceflow.astra.ventures"),
  title: {
    template: "%s | InvoiceFlow",
    default: "Free Invoice Generator - Create Professional Invoices in 60 Seconds",
  },
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
    "professional invoices",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Free Invoice Generator - Create Professional Invoices Fast",
    description:
      "Free invoice generator with time tracking, recurring invoices, and payment links. No signup required, just fast professional invoicing.",
    type: "website",
    siteName: "InvoiceFlow",
    url: "https://invoiceflow.astra.ventures",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "InvoiceFlow — Professional invoices in 60 seconds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Generator - Professional Invoices in 60 Seconds",
    description:
      "Create beautiful invoices instantly. Free forever, no signup required.",
    images: ["/api/og"],
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
      <body className={inter.className}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
