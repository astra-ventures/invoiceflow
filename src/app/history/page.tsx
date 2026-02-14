"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppNavbar } from "@/app/_components/AppNavbar";
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
    USD: "$", EUR: "€", GBP: "£", CAD: "C$", AUD: "A$",
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currencySymbol[currency] || currency + " "}${amount.toFixed(2)}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const statusColors: Record<string, string> = {
    draft: "bg-[#1F2937] text-[#9CA3AF]",
    sent: "bg-[#6366F1]/15 text-[#818CF8]",
    viewed: "bg-[#A78BFA]/15 text-[#A78BFA]",
    paid: "bg-[#10B981]/15 text-[#34D399]",
    overdue: "bg-[#F43F5E]/15 text-[#FB7185]",
  };

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0);
  const totalOverdue = invoices.filter((inv) => inv.status === "overdue").reduce((sum, inv) => sum + inv.total, 0);
  const totalOutstanding = invoices.filter((inv) => inv.status !== "paid").reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <AppNavbar />

      <main className="max-w-6xl mx-auto px-6 py-8 pt-24">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111827] rounded-xl border border-white/10 p-6">
            <div className="text-sm text-[#9CA3AF] mb-1">Total Invoiced</div>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalInvoiced, "USD")}</div>
          </div>
          <div className="bg-[#111827] rounded-xl border border-white/10 p-6">
            <div className="text-sm text-[#9CA3AF] mb-1">Paid</div>
            <div className="text-2xl font-bold text-[#34D399]">{formatCurrency(totalPaid, "USD")}</div>
          </div>
          <div className="bg-[#111827] rounded-xl border border-white/10 p-6">
            <div className="text-sm text-[#9CA3AF] mb-1">Outstanding</div>
            <div className="text-2xl font-bold text-[#FBBF24]">{formatCurrency(totalOutstanding, "USD")}</div>
          </div>
          <div className="bg-[#111827] rounded-xl border border-white/10 p-6">
            <div className="text-sm text-[#9CA3AF] mb-1">Overdue</div>
            <div className="text-2xl font-bold text-[#FB7185]">{formatCurrency(totalOverdue, "USD")}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Invoice History</h1>
          <div className="flex gap-2">
            {(["all", "draft", "sent", "overdue", "paid"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f
                    ? "bg-[#6366F1] text-white"
                    : "bg-[#111827] text-[#9CA3AF] border border-white/10 hover:bg-[#1F2937]"
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
          <div className="bg-[#111827] rounded-xl border border-white/10 p-12 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              {filter === "all" ? "No invoices yet" : `No ${filter} invoices`}
            </h2>
            <p className="text-[#9CA3AF] mb-6">
              {filter === "all" ? "Create your first invoice to get started" : "No invoices match this filter"}
            </p>
            <Link href="/create" className="inline-block bg-[#6366F1] text-white px-6 py-3 rounded-lg hover:bg-[#818CF8] transition">
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="bg-[#111827] rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#0A0F1E] border-b border-white/10">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#9CA3AF]">Invoice</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#9CA3AF]">Client</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#9CA3AF]">Created</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#9CA3AF]">Due Date</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-[#9CA3AF]">Amount</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-[#9CA3AF]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInvoices.map((invoice) => {
                  const daysUntilDue = invoice.dueDate ? getDaysUntilDue(invoice.dueDate) : null;
                  const isOverdue = daysUntilDue !== null && daysUntilDue < 0 && invoice.status !== "paid";
                  const isDueSoon = daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 7 && invoice.status !== "paid";
                  const lateFeeInfo = isOverdue && invoice.dueDate
                    ? calculateLateFee(invoice.total, new Date(invoice.dueDate))
                    : null;

                  return (
                    <tr key={invoice.id} className="hover:bg-[#0A0F1E]/50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-white">{invoice.invoiceNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{invoice.clientName}</div>
                        {invoice.clientEmail && (
                          <div className="text-[#6B7280] text-xs">{invoice.clientEmail}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#9CA3AF]">{formatDate(invoice.createdAt)}</td>
                      <td className="px-6 py-4">
                        {invoice.dueDate ? (
                          <div>
                            <span className={`${isOverdue ? "text-[#FB7185] font-medium" : isDueSoon ? "text-[#FBBF24]" : "text-[#9CA3AF]"}`}>
                              {formatDate(invoice.dueDate)}
                            </span>
                            {isOverdue && (
                              <div className="text-xs text-[#FB7185]">{Math.abs(daysUntilDue!)} days overdue</div>
                            )}
                            {isDueSoon && daysUntilDue! > 0 && (
                              <div className="text-xs text-[#FBBF24]">Due in {daysUntilDue} days</div>
                            )}
                            {isDueSoon && daysUntilDue === 0 && (
                              <div className="text-xs text-[#FBBF24]">Due today</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#6B7280]">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-medium text-white">{formatCurrency(invoice.total, invoice.currency)}</div>
                        {lateFeeInfo && lateFeeInfo.fee > 0 && (
                          <div className="text-xs text-[#FB7185]">+{formatCurrency(lateFeeInfo.fee, invoice.currency)} late fee</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={invoice.status}
                          onChange={(e) => handleStatusChange(invoice.id, e.target.value as InvoiceRecord["status"])}
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

        {/* Overdue Alert — dark themed */}
        {totalOverdue > 0 && (
          <div className="mt-8 bg-[#F43F5E]/10 border border-[#F43F5E]/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-2xl">⚠️</div>
              <div>
                <h3 className="font-semibold text-[#FB7185]">
                  You have {formatCurrency(totalOverdue, "USD")} in overdue invoices
                </h3>
                <p className="text-[#9CA3AF] text-sm mt-1">
                  Consider sending payment reminders to your clients. Late fees may apply based on your terms.
                </p>
                <button
                  onClick={() => setFilter("overdue")}
                  className="mt-3 text-sm font-medium text-[#FB7185] hover:text-[#F43F5E]"
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
