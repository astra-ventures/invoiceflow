"use client";

import { useState } from "react";
import Link from "next/link";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function CreateInvoice() {
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`
  );
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toName, setToName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const currencySymbol: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    AUD: "A$",
  };

  const formatCurrency = (amount: number) => {
    return `${currencySymbol[currency] || currency + " "}${amount.toFixed(2)}`;
  };

  const generateInvoice = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://astra-invoice-api.onrender.com/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_number: invoiceNumber,
          from_name: fromName,
          from_email: fromEmail,
          from_address: fromAddress,
          to_name: toName,
          to_email: toEmail,
          to_address: toAddress,
          items: items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unitPrice,
          })),
          tax_rate: taxRate / 100,
          notes,
          currency,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate invoice");
      
      const html = await response.text();
      setPreviewHtml(html);
    } catch (error) {
      alert("Error generating invoice. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!previewHtml) return;
    
    // Open in new window for printing
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(previewHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  if (previewHtml) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setPreviewHtml(null)}
              className="text-slate-600 hover:text-slate-900 flex items-center gap-2"
            >
              ← Back to Editor
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={downloadPdf}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                🖨️ Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div
            className="bg-white shadow-xl rounded-lg overflow-hidden"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Invoice<span className="text-blue-600">Flow</span>
          </Link>
          <button
            onClick={generateInvoice}
            disabled={loading || !fromName || !toName || items.every(i => !i.description)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Preview Invoice →"}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* From */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h2 className="font-semibold text-slate-900 mb-4">From (Your Details)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Business Name *</label>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="billing@acme.com"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Address</label>
                <textarea
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  placeholder="123 Business St&#10;New York, NY 10001"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* To */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h2 className="font-semibold text-slate-900 mb-4">To (Client Details)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Client Name *</label>
                <input
                  type="text"
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  placeholder="Client Inc"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="accounts@client.com"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Address</label>
                <textarea
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="456 Client Ave&#10;Los Angeles, CA 90001"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Invoice Details</h2>
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm text-slate-600 mr-2">Invoice #</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="px-3 py-1 rounded border border-slate-200 w-40"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mr-2">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-3 py-1 rounded border border-slate-200"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="mt-6">
            <div className="grid grid-cols-12 gap-4 text-sm text-slate-600 mb-2">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Unit Price</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 mb-3 items-center">
                <div className="col-span-6">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder="Web Development"
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.5"
                    className="w-full px-3 py-2 rounded border border-slate-200 text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 rounded border border-slate-200 text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <span className="text-slate-900">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </span>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={addItem}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Line Item
            </button>
          </div>

          {/* Totals */}
          <div className="mt-8 flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Tax</span>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                    step="0.5"
                    className="w-16 px-2 py-1 rounded border border-slate-200 text-right text-sm"
                  />
                  <span className="text-sm">%</span>
                </div>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="font-semibold text-slate-900 mb-4">Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment due within 30 days. Bank details: ..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        {/* Generate Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={generateInvoice}
            disabled={loading || !fromName || !toName || items.every(i => !i.description)}
            className="bg-blue-600 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25"
          >
            {loading ? "Generating..." : "Generate Invoice →"}
          </button>
        </div>
      </main>
    </div>
  );
}
