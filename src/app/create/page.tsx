"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getBusinessInfo,
  saveBusinessInfo,
  getClients,
  saveClient,
  getNextInvoiceNumber,
  saveInvoice,
  getDueDateFromTerms,
  PAYMENT_TERMS_NOTES,
  LATE_FEE_CLAUSE,
  DEFAULT_CONTRACT_TERMS,
  type Client,
  type BusinessInfo,
} from "@/lib/storage";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function CreateInvoice() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
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
  const [clients, setClients] = useState<Client[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [saveClientChecked, setSaveClientChecked] = useState(false);
  const [businessInfoSaved, setBusinessInfoSaved] = useState(false);
  
  // New features
  const [paymentTerms, setPaymentTerms] = useState("net_30");
  const [dueDate, setDueDate] = useState("");
  const [lateFeePercent, setLateFeePercent] = useState(1.5);
  const [includeLateFee, setIncludeLateFee] = useState(true);
  const [includeContractTerms, setIncludeContractTerms] = useState(false);
  const [savedInvoiceId, setSavedInvoiceId] = useState<string | null>(null);

  // Load saved data on mount
  useEffect(() => {
    const savedBusiness = getBusinessInfo();
    if (savedBusiness) {
      setFromName(savedBusiness.name);
      setFromEmail(savedBusiness.email);
      setFromAddress(savedBusiness.address);
      if (savedBusiness.paymentTerms) setPaymentTerms(savedBusiness.paymentTerms);
      if (savedBusiness.lateFeePercent) setLateFeePercent(savedBusiness.lateFeePercent);
      if (savedBusiness.defaultNotes) setNotes(savedBusiness.defaultNotes);
      setBusinessInfoSaved(true);
    }
    setClients(getClients());
    setInvoiceNumber(getNextInvoiceNumber());
    
    // Set initial due date
    const initialDueDate = getDueDateFromTerms("net_30");
    setDueDate(initialDueDate.toISOString().split("T")[0]);
  }, []);

  // Update due date when payment terms change
  useEffect(() => {
    const newDueDate = getDueDateFromTerms(paymentTerms);
    setDueDate(newDueDate.toISOString().split("T")[0]);
  }, [paymentTerms]);

  const handleSaveBusinessInfo = () => {
    const info: BusinessInfo = {
      name: fromName,
      email: fromEmail,
      address: fromAddress,
      paymentTerms,
      lateFeePercent,
    };
    saveBusinessInfo(info);
    setBusinessInfoSaved(true);
  };

  const handleSelectClient = (client: Client) => {
    setToName(client.name);
    setToEmail(client.email);
    setToAddress(client.address);
    setShowClientDropdown(false);
  };

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

  const updateItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
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

  // Build the notes with payment terms
  const buildFullNotes = () => {
    let fullNotes = notes;
    
    // Add payment terms
    const termsNote = PAYMENT_TERMS_NOTES[paymentTerms];
    if (termsNote && !fullNotes.includes(termsNote)) {
      fullNotes = termsNote + (fullNotes ? "\n\n" + fullNotes : "");
    }
    
    // Add late fee clause
    if (includeLateFee && lateFeePercent > 0) {
      const lateFeeNote = LATE_FEE_CLAUSE(lateFeePercent);
      if (!fullNotes.includes("late fee")) {
        fullNotes += "\n\n" + lateFeeNote;
      }
    }
    
    // Add contract terms
    if (includeContractTerms) {
      fullNotes += "\n\n" + DEFAULT_CONTRACT_TERMS;
    }
    
    return fullNotes.trim();
  };

  const generateInvoice = async () => {
    setLoading(true);
    try {
      const fullNotes = buildFullNotes();
      
      const response = await fetch(
        "https://astra-invoice-api.onrender.com/preview",
        {
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
            due_date: dueDate,
            items: items.map((item) => ({
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unitPrice,
            })),
            tax_rate: taxRate / 100,
            notes: fullNotes,
            currency,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate invoice");

      const html = await response.text();
      setPreviewHtml(html);

      // Save client if checkbox is checked
      if (saveClientChecked && toName) {
        const newClient = saveClient({
          name: toName,
          email: toEmail,
          address: toAddress,
        });
        setClients([...clients, newClient]);
        setSaveClientChecked(false);
      }

      // Save invoice to history
      const invoice = saveInvoice({
        invoiceNumber,
        clientName: toName,
        clientEmail: toEmail,
        total,
        currency,
        dueDate,
        status: "draft",
        html,
      });
      setSavedInvoiceId(invoice.id);
    } catch (error) {
      alert("Error generating invoice. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!previewHtml) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(previewHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  const emailInvoice = () => {
    if (!toEmail) {
      alert("Please enter the client's email address.");
      return;
    }
    
    const subject = encodeURIComponent(`Invoice ${invoiceNumber} from ${fromName}`);
    const body = encodeURIComponent(
      `Hi ${toName},\n\nPlease find attached invoice ${invoiceNumber} for ${formatCurrency(total)}.\n\nDue Date: ${new Date(dueDate).toLocaleDateString()}\n\nThank you for your business!\n\nBest regards,\n${fromName}`
    );
    
    window.open(`mailto:${toEmail}?subject=${subject}&body=${body}`, "_blank");
  };

  const copyPaymentReminder = () => {
    const reminder = `Hi ${toName},

This is a friendly reminder that invoice ${invoiceNumber} for ${formatCurrency(total)} is due on ${new Date(dueDate).toLocaleDateString()}.

If you've already sent the payment, please disregard this message. Otherwise, please let me know if you have any questions.

Thank you!
${fromName}`;
    
    navigator.clipboard.writeText(reminder);
    alert("Payment reminder copied to clipboard!");
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
            <div className="flex items-center gap-3">
              <button
                onClick={copyPaymentReminder}
                className="text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-sm"
              >
                📋 Copy Reminder
              </button>
              <button
                onClick={emailInvoice}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm"
              >
                ✉️ Email Invoice
              </button>
              <button
                onClick={downloadPdf}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
              >
                🖨️ Print / PDF
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
          <div className="flex items-center gap-4">
            <Link
              href="/history"
              className="text-slate-600 hover:text-slate-900"
            >
              History
            </Link>
            <Link
              href="/clients"
              className="text-slate-600 hover:text-slate-900"
            >
              Clients
            </Link>
            <button
              onClick={generateInvoice}
              disabled={
                loading ||
                !fromName ||
                !toName ||
                items.every((i) => !i.description)
              }
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Preview Invoice →"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* From */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">
                From (Your Details)
              </h2>
              {fromName && !businessInfoSaved && (
                <button
                  onClick={handleSaveBusinessInfo}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Save for next time
                </button>
              )}
              {businessInfoSaved && (
                <span className="text-sm text-green-600">✓ Saved</span>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => {
                    setFromName(e.target.value);
                    setBusinessInfoSaved(false);
                  }}
                  placeholder="Acme Corp"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={fromEmail}
                  onChange={(e) => {
                    setFromEmail(e.target.value);
                    setBusinessInfoSaved(false);
                  }}
                  placeholder="billing@acme.com"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Address
                </label>
                <textarea
                  value={fromAddress}
                  onChange={(e) => {
                    setFromAddress(e.target.value);
                    setBusinessInfoSaved(false);
                  }}
                  placeholder="123 Business St&#10;New York, NY 10001"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* To */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">
                To (Client Details)
              </h2>
              {clients.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowClientDropdown(!showClientDropdown)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Select saved client ▾
                  </button>
                  {showClientDropdown && (
                    <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg py-2 min-w-48 z-10">
                      {clients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => handleSelectClient(client)}
                          className="block w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                        >
                          <div className="font-medium text-slate-900">
                            {client.name}
                          </div>
                          <div className="text-slate-500 text-xs">
                            {client.email}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  placeholder="Client Inc"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="accounts@client.com"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Address
                </label>
                <textarea
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="456 Client Ave&#10;Los Angeles, CA 90001"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={saveClientChecked}
                  onChange={(e) => setSaveClientChecked(e.target.checked)}
                  className="rounded border-slate-300"
                />
                Save client for future invoices
              </label>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="font-semibold text-slate-900">Invoice Details</h2>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="text-sm text-slate-600 mr-2">Invoice #</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="px-3 py-1 rounded border border-slate-200 w-36"
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

          {/* Payment Terms Row */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
            <div>
              <label className="text-sm text-slate-600 mr-2">Payment Terms</label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="px-3 py-1 rounded border border-slate-200"
              >
                <option value="due_on_receipt">Due on Receipt</option>
                <option value="net_15">Net 15</option>
                <option value="net_30">Net 30</option>
                <option value="net_60">Net 60</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600 mr-2">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-1 rounded border border-slate-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={includeLateFee}
                  onChange={(e) => setIncludeLateFee(e.target.checked)}
                  className="rounded border-slate-300"
                />
                Late fee
              </label>
              {includeLateFee && (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={lateFeePercent}
                    onChange={(e) => setLateFeePercent(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="10"
                    step="0.5"
                    className="w-16 px-2 py-1 rounded border border-slate-200 text-sm"
                  />
                  <span className="text-sm text-slate-500">%/mo</span>
                </div>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div className="mt-4">
            <div className="grid grid-cols-12 gap-4 text-sm text-slate-600 mb-2">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Unit Price</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 mb-3 items-center"
              >
                <div className="col-span-6">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, "description", e.target.value)
                    }
                    placeholder="Web Development"
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "quantity",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    min="0"
                    step="0.5"
                    className="w-full px-3 py-2 rounded border border-slate-200 text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "unitPrice",
                        parseFloat(e.target.value) || 0
                      )
                    }
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
                    onChange={(e) =>
                      setTaxRate(parseFloat(e.target.value) || 0)
                    }
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Notes & Terms</h2>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={includeContractTerms}
                onChange={(e) => setIncludeContractTerms(e.target.checked)}
                className="rounded border-slate-300"
              />
              Include contract terms
            </label>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes (payment terms and late fee clause will be auto-added)..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
          />
          <p className="mt-2 text-xs text-slate-500">
            Payment terms ({paymentTerms.replace("_", " ")}) 
            {includeLateFee && ` and ${lateFeePercent}% late fee clause`}
            {includeContractTerms && " and contract terms"} will be automatically included.
          </p>
        </div>

        {/* Generate Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={generateInvoice}
            disabled={
              loading ||
              !fromName ||
              !toName ||
              items.every((i) => !i.description)
            }
            className="bg-blue-600 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25"
          >
            {loading ? "Generating..." : "Generate Invoice →"}
          </button>
        </div>
      </main>
    </div>
  );
}
