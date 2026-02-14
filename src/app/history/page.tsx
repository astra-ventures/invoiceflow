"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getInvoices,
  updateInvoiceStatus,
  checkOverdueInvoices,
  calculateLateFee,
  type InvoiceRecord,
} from "@/lib/storage";

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "draft" | "sent" | "overdue" | "paid">("all");

  useEffect(() => {
    // Check for overdue invoices on load
    checkOverdueInvoices();
    setInvoices(getInvoices());
  }, []);

  const handleStatusChange = (id: string, status: InvoiceRecord["status"]) => {
    updateInvoiceStatus(id, status);
    setInvoices(getInvoices());
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (filter === "all") return true;
    return inv.status === filter;
  });

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

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statusColors: Record<string, string> = {
    draft: "bg-slate-100 text-slate-700",
    sent: "bg-blue-100 text-blue-700",
    viewed: "bg-purple-100 text-purple-700",
    paid: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
  };

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);
  const totalOverdue = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.total, 0);
  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Invoice<span className="text-blue-600">Flow</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/create" className="text-slate-600 hover:text-slate-900">
              Create
            </Link>
            <span className="text-blue-600 font-medium">History</span>
            <Link href="/time" className="text-slate-600 hover:text-slate-900">
              Time
            </Link>
            <Link href="/recurring" className="text-slate-600 hover:text-slate-900">
              Recurring
            </Link>
            <Link href="/analytics" className="text-slate-600 hover:text-slate-900">
              Analytics
            </Link>
            <Link
              href="/create"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + New Invoice
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="text-sm text-slate-600 mb-1">Total Invoiced</div>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalInvoiced, "USD")}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="text-sm text-slate-600 mb-1">Paid</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPaid, "USD")}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="text-sm text-slate-600 mb-1">Outstanding</div>
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(totalOutstanding, "USD")}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="text-sm text-slate-600 mb-1">Overdue</div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalOverdue, "USD")}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Invoice History</h1>
          <div className="flex gap-2">
            {(["all", "draft", "sent", "overdue", "paid"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== "all" && (
                  <span className="ml-1 text-xs opacity-75">
                    ({invoices.filter((inv) => inv.status === f).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              {filter === "all" ? "No invoices yet" : `No ${filter} invoices`}
            </h2>
            <p className="text-slate-600 mb-6">
              {filter === "all"
                ? "Create your first invoice to get started"
                : "No invoices match this filter"}
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
                    Created
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">
                    Due Date
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
                {filteredInvoices.map((invoice) => {
                  const daysUntilDue = invoice.dueDate
                    ? getDaysUntilDue(invoice.dueDate)
                    : null;
                  const isOverdue = daysUntilDue !== null && daysUntilDue < 0 && invoice.status !== "paid";
                  const isDueSoon = daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 7 && invoice.status !== "paid";
                  
                  // Calculate late fee if overdue
                  const lateFeeInfo = isOverdue && invoice.dueDate
                    ? calculateLateFee(invoice.total, new Date(invoice.dueDate))
                    : null;

                  return (
                    <tr key={invoice.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900">
                          {invoice.invoiceNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900">{invoice.clientName}</div>
                        {invoice.clientEmail && (
                          <div className="text-slate-500 text-xs">{invoice.clientEmail}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(invoice.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        {invoice.dueDate ? (
                          <div>
                            <span className={`${isOverdue ? "text-red-600 font-medium" : isDueSoon ? "text-amber-600" : "text-slate-600"}`}>
                              {formatDate(invoice.dueDate)}
                            </span>
                            {isOverdue && (
                              <div className="text-xs text-red-500">
                                {Math.abs(daysUntilDue!)} days overdue
                              </div>
                            )}
                            {isDueSoon && daysUntilDue! > 0 && (
                              <div className="text-xs text-amber-500">
                                Due in {daysUntilDue} days
                              </div>
                            )}
                            {isDueSoon && daysUntilDue === 0 && (
                              <div className="text-xs text-amber-500">
                                Due today
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-medium text-slate-900">
                          {formatCurrency(invoice.total, invoice.currency)}
                        </div>
                        {lateFeeInfo && lateFeeInfo.fee > 0 && (
                          <div className="text-xs text-red-500">
                            +{formatCurrency(lateFeeInfo.fee, invoice.currency)} late fee
                          </div>
                        )}
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
                          <option value="viewed">Viewed</option>
                          <option value="overdue">Overdue</option>
                          <option value="paid">Paid</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Overdue Alert */}
        {totalOverdue > 0 && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-2xl">⚠️</div>
              <div>
                <h3 className="font-semibold text-red-900">
                  You have {formatCurrency(totalOverdue, "USD")} in overdue invoices
                </h3>
                <p className="text-red-700 text-sm mt-1">
                  Consider sending payment reminders to your clients. Late fees may apply based on your terms.
                </p>
                <button
                  onClick={() => setFilter("overdue")}
                  className="mt-3 text-sm font-medium text-red-700 hover:text-red-800"
                >
                  View overdue invoices →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
