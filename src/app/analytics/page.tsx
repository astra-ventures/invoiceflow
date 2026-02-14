"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getInvoiceAnalytics, type InvoiceAnalytics } from "@/lib/storage";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<InvoiceAnalytics | null>(null);

  useEffect(() => {
    setAnalytics(getInvoiceAnalytics());
  }, []);

  if (!analytics) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading analytics...</div>
      </div>
    );
  }

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const formatMonth = (month: string) => {
    const [year, m] = month.split("-");
    const date = new Date(parseInt(year), parseInt(m) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  };

  // Calculate max for chart scaling
  const maxRevenue = Math.max(...analytics.monthlyRevenue.map((m) => m.amount), 1);

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
            <Link href="/history" className="text-slate-600 hover:text-slate-900">
              History
            </Link>
            <Link href="/time" className="text-slate-600 hover:text-slate-900">
              Time
            </Link>
            <Link href="/recurring" className="text-slate-600 hover:text-slate-900">
              Recurring
            </Link>
            <span className="text-blue-600 font-medium">Analytics</span>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Invoice Analytics</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Total Invoiced</div>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(analytics.totalInvoiced)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {analytics.invoiceCount} invoices
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Total Paid</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(analytics.totalPaid)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {analytics.paidCount} paid
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Outstanding</div>
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(analytics.totalOutstanding)}
            </div>
            <div className="text-xs text-slate-400 mt-1">awaiting payment</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Overdue</div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(analytics.totalOverdue)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {analytics.overdueCount} overdue
            </div>
          </div>
        </div>

        {/* Average Time to Payment */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Avg. Time to Payment</div>
            <div className="text-3xl font-bold text-slate-900">
              {analytics.averageTimeToPayDays}{" "}
              <span className="text-lg font-normal text-slate-500">days</span>
            </div>
            <div className="mt-4 text-xs text-slate-400">
              Based on {analytics.paidCount} paid invoices
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Collection Rate</div>
            <div className="text-3xl font-bold text-slate-900">
              {analytics.invoiceCount > 0
                ? Math.round((analytics.paidCount / analytics.invoiceCount) * 100)
                : 0}
              <span className="text-lg font-normal text-slate-500">%</span>
            </div>
            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  width: `${
                    analytics.invoiceCount > 0
                      ? (analytics.paidCount / analytics.invoiceCount) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="text-sm text-slate-500 mb-2">Currency Breakdown</div>
            <div className="space-y-2">
              {Object.entries(analytics.currencyBreakdown).map(([currency, amount]) => (
                <div key={currency} className="flex justify-between text-sm">
                  <span className="text-slate-600">{currency}</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(amount, currency)}
                  </span>
                </div>
              ))}
              {Object.keys(analytics.currencyBreakdown).length === 0 && (
                <div className="text-slate-400 text-sm">No invoices yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Monthly Revenue</h3>
            {analytics.monthlyRevenue.length > 0 ? (
              <div className="h-48 flex items-end gap-2">
                {analytics.monthlyRevenue.map((month) => (
                  <div
                    key={month.month}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                      style={{
                        height: `${(month.amount / maxRevenue) * 160}px`,
                        minHeight: month.amount > 0 ? "4px" : "0",
                      }}
                      title={formatCurrency(month.amount)}
                    />
                    <div className="text-xs text-slate-500 mt-2 rotate-45 origin-left">
                      {formatMonth(month.month)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400">
                No revenue data yet
              </div>
            )}
          </div>

          {/* Top Clients */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Top Clients</h3>
            {analytics.topClients.length > 0 ? (
              <div className="space-y-3">
                {analytics.topClients.map((client, idx) => (
                  <div key={client.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 truncate">
                        {client.name}
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${
                              (client.total / (analytics.topClients[0]?.total || 1)) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-sm font-medium text-slate-600">
                      {formatCurrency(client.total)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400">
                No client data yet
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips to Get Paid Faster</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              • <strong>Send immediately:</strong> Invoices sent within 24 hours of work completion get paid 1.5x faster
            </li>
            <li>
              • <strong>Use shorter terms:</strong> Net 15 has higher on-time payment rates than Net 30
            </li>
            <li>
              • <strong>Add late fees:</strong> Invoices with late fee clauses are paid 8% faster on average
            </li>
            <li>
              • <strong>Set up recurring:</strong> Automate regular invoices to maintain cash flow
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
