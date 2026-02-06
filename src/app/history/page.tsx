"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getInvoices,
  updateInvoiceStatus,
  type InvoiceRecord,
} from "@/lib/storage";

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);

  useEffect(() => {
    setInvoices(getInvoices());
  }, []);

  const handleStatusChange = (id: string, status: InvoiceRecord["status"]) => {
    updateInvoiceStatus(id, status);
    setInvoices(getInvoices());
  };

  const currencySymbol: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    AUD: "A$",
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currencySymbol[currency] || currency + " "}${amount.toFixed(2)}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const statusColors = {
    draft: "bg-slate-100 text-slate-700",
    sent: "bg-blue-100 text-blue-700",
    paid: "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Invoice<span className="text-blue-600">Flow</span>
          </Link>
          <Link
            href="/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Invoice
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Invoice History
        </h1>

        {invoices.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              No invoices yet
            </h2>
            <p className="text-slate-600 mb-6">
              Create your first invoice to get started
            </p>
            <Link
              href="/create"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">
                    Invoice
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">
                    Client
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">
                    Date
                  </th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">
                    Amount
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">
                        {invoice.invoiceNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {invoice.clientName}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(invoice.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={invoice.status}
                        onChange={(e) =>
                          handleStatusChange(
                            invoice.id,
                            e.target.value as InvoiceRecord["status"]
                          )
                        }
                        className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${statusColors[invoice.status]}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats Summary */}
        {invoices.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="text-sm text-slate-600 mb-1">Total Invoiced</div>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(
                  invoices.reduce((sum, inv) => sum + inv.total, 0),
                  "USD"
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="text-sm text-slate-600 mb-1">Paid</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  invoices
                    .filter((inv) => inv.status === "paid")
                    .reduce((sum, inv) => sum + inv.total, 0),
                  "USD"
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="text-sm text-slate-600 mb-1">Outstanding</div>
              <div className="text-2xl font-bold text-amber-600">
                {formatCurrency(
                  invoices
                    .filter((inv) => inv.status !== "paid")
                    .reduce((sum, inv) => sum + inv.total, 0),
                  "USD"
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
