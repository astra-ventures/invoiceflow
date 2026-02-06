import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InvoiceFlow - Create Professional Invoices in 60 Seconds",
  description:
    "The fastest way for freelancers and small businesses to create and send professional invoices. No signup required.",
  openGraph: {
    title: "InvoiceFlow - Create Professional Invoices in 60 Seconds",
    description:
      "The fastest way for freelancers and small businesses to create and send professional invoices.",
    type: "website",
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
