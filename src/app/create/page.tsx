"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Crown, Zap, Lock } from "lucide-react";
import { hasProAccess } from "@/lib/stripe";
import { AppNavbar } from "@/app/_components/AppNavbar";
import { InvoicePreview } from "@/app/_components/InvoicePreview";
import { InvoiceActions } from "@/app/_components/InvoiceActions";
import {
  getBusinessInfo,
  saveBusinessInfo,
  getClients,
  saveClient,
  getNextInvoiceNumber,
  saveInvoice,
  getDueDateFromTerms,
  getUnbilledTimeEntries,
  markTimeEntriesAsBilled,
  formatDuration,
  generateWhatsAppLink,
  generateSMSLink,
  formatStripePaymentLink,
  PAYMENT_TERMS_NOTES,
  LATE_FEE_CLAUSE,
  DEFAULT_CONTRACT_TERMS,
  type Client,
  type BusinessInfo,
  type TimeEntry,
} from "@/lib/storage";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  timeEntryId?: string;
}

export default function CreateInvoice() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toName, setToName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [saveClientChecked, setSaveClientChecked] = useState(false);
  const [businessInfoSaved, setBusinessInfoSaved] = useState(false);

  // Payment & Terms
  const [paymentTerms, setPaymentTerms] = useState("net_30");
  const [dueDate, setDueDate] = useState("");
  const [lateFeePercent, setLateFeePercent] = useState(1.5);
  const [includeLateFee, setIncludeLateFee] = useState(true);
  const [includeContractTerms, setIncludeContractTerms] = useState(false);

  // V2: Stripe Payment Link
  const [stripePaymentLink, setStripePaymentLink] = useState("");
  const [isPro, setIsPro] = useState(false);

  // V2: Time Entries
  const [unbilledTime, setUnbilledTime] = useState<TimeEntry[]>([]);
  const [selectedTimeEntries, setSelectedTimeEntries] = useState<string[]>([]);
  const [showTimeEntries, setShowTimeEntries] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const savedBusiness = getBusinessInfo();
    if (savedBusiness) {
      setFromName(savedBusiness.name);
      setFromEmail(savedBusiness.email);
      setFromAddress(savedBusiness.address);
      if (savedBusiness.paymentTerms)
        setPaymentTerms(savedBusiness.paymentTerms);
      if (savedBusiness.lateFeePercent)
        setLateFeePercent(savedBusiness.lateFeePercent);
      if (savedBusiness.defaultNotes) setNotes(savedBusiness.defaultNotes);
      setBusinessInfoSaved(true);
    }
    setClients(getClients());
    setInvoiceNumber(getNextInvoiceNumber());
    setUnbilledTime(getUnbilledTimeEntries());

    // Set initial due date
    const initialDueDate = getDueDateFromTerms("net_30");
    setDueDate(initialDueDate.toISOString().split("T")[0]);
  }, []);

  // Check Pro status on mount
  useEffect(() => {
    setIsPro(hasProAccess());
  }, []);

  // Update due date when payment terms change
  useEffect(() => {
    const newDueDate = getDueDateFromTerms(paymentTerms);
    setDueDate(newDueDate.toISOString().split("T")[0]);
  }, [paymentTerms]);

  // Update unbilled time when client changes
  useEffect(() => {
    if (toName) {
      const clientId = clients.find((c) => c.name === toName)?.id;
      setUnbilledTime(getUnbilledTimeEntries(clientId));
    } else {
      setUnbilledTime(getUnbilledTimeEntries());
    }
  }, [toName, clients]);

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
    setToPhone(client.phone || "");
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

  const addTimeEntriesToInvoice = () => {
    const newItems: LineItem[] = selectedTimeEntries.map((id) => {
      const entry = unbilledTime.find((e) => e.id === id)!;
      return {
        id: `time-${id}`,
        description: `${entry.projectName ? entry.projectName + ": " : ""}${entry.description} (${formatDuration(entry.durationMinutes)})`,
        quantity: Math.round((entry.durationMinutes / 60) * 100) / 100,
        unitPrice: entry.hourlyRate,
        timeEntryId: id,
      };
    });

    setItems([...items.filter((i) => i.description), ...newItems]);
    setShowTimeEntries(false);
    setSelectedTimeEntries([]);
  };

  const toggleTimeEntry = (id: string) => {
    if (selectedTimeEntries.includes(id)) {
      setSelectedTimeEntries(selectedTimeEntries.filter((e) => e !== id));
    } else {
      setSelectedTimeEntries([...selectedTimeEntries, id]);
    }
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

    // Add Stripe payment link
    if (stripePaymentLink) {
      const formattedLink = formatStripePaymentLink(stripePaymentLink);
      fullNotes += `\n\n💳 Pay Online: ${formattedLink}`;
    }

    return fullNotes.trim();
  };

  const copyPaymentReminder = () => {
    const reminder = `Hi ${toName},

This is a friendly reminder that invoice ${invoiceNumber} for ${formatCurrency(total)} is due on ${new Date(dueDate).toLocaleDateString()}.
${stripePaymentLink ? `\nPay online: ${formatStripePaymentLink(stripePaymentLink)}` : ""}
If you've already sent the payment, please disregard this message. Otherwise, please let me know if you have any questions.

Thank you!
${fromName}`;

    navigator.clipboard.writeText(reminder);
    alert("Payment reminder copied to clipboard!");
  };

  const shareWhatsApp = () => {
    if (!toPhone) {
      const phone = prompt("Enter client phone number (with country code):");
      if (!phone) return;
      setToPhone(phone);
    }
    const link = generateWhatsAppLink(
      toPhone,
      invoiceNumber,
      formatCurrency(total),
      new Date(dueDate).toLocaleDateString()
    );
    window.open(link, "_blank");
  };

  const shareSMS = () => {
    if (!toPhone) {
      const phone = prompt("Enter client phone number:");
      if (!phone) return;
      setToPhone(phone);
    }
    const link = generateSMSLink(
      toPhone,
      invoiceNumber,
      formatCurrency(total),
      new Date(dueDate).toLocaleDateString()
    );
    window.open(link, "_blank");
  };

  const emailInvoice = () => {
    if (!toEmail) {
      alert("Please enter the client's email address.");
      return;
    }

    const subject = encodeURIComponent(
      `Invoice ${invoiceNumber} from ${fromName}`
    );
    const body = encodeURIComponent(
      `Hi ${toName},\n\nPlease find attached invoice ${invoiceNumber} for ${formatCurrency(total)}.\n\nDue Date: ${new Date(dueDate).toLocaleDateString()}${stripePaymentLink ? `\n\nPay online: ${formatStripePaymentLink(stripePaymentLink)}` : ""}\n\nThank you for your business!\n\nBest regards,\n${fromName}`
    );

    window.open(`mailto:${toEmail}?subject=${subject}&body=${body}`, "_blank");
  };

  const downloadPdf = () => {
    // For now, we'll generate the HTML version for printing
    // In a real implementation, this would generate a proper PDF
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const fullNotes = buildFullNotes();
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; background: white; }
              .invoice { max-width: 800px; margin: 0 auto; }
              .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
              .title { font-size: 36px; font-weight: bold; color: #333; }
              .details { margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
              .content { margin-top: 5px; color: #333; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
              th { background: #f8f9fa; font-weight: bold; color: #333; }
              .total-row { font-weight: bold; font-size: 18px; border-top: 2px solid #333; }
              .notes { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
            </style>
          </head>
          <body>
            <div class="invoice">
              <div class="header">
                <div>
                  <div class="title">INVOICE</div>
                  <div style="color: #666; margin-top: 5px;">Invoice #${invoiceNumber}</div>
                </div>
                <div style="text-align: right;">
                  <div class="label">Date</div>
                  <div class="content">${new Date().toLocaleDateString()}</div>
                  <div class="label" style="margin-top: 15px;">Due Date</div>
                  <div class="content">${new Date(dueDate).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
                <div style="width: 45%;">
                  <div class="label">From</div>
                  <div class="content">
                    <div style="font-weight: bold; margin-bottom: 5px;">${fromName}</div>
                    ${fromEmail ? `<div>${fromEmail}</div>` : ''}
                    ${fromAddress ? `<div style="white-space: pre-line;">${fromAddress}</div>` : ''}
                  </div>
                </div>
                <div style="width: 45%;">
                  <div class="label">Bill To</div>
                  <div class="content">
                    <div style="font-weight: bold; margin-bottom: 5px;">${toName}</div>
                    ${toEmail ? `<div>${toEmail}</div>` : ''}
                    ${toAddress ? `<div style="white-space: pre-line;">${toAddress}</div>` : ''}
                  </div>
                </div>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Qty</th>
                    <th style="text-align: right;">Rate</th>
                    <th style="text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.filter(item => item.description).map(item => `
                    <tr>
                      <td>${item.description}</td>
                      <td style="text-align: right;">${item.quantity}</td>
                      <td style="text-align: right;">${formatCurrency(item.unitPrice)}</td>
                      <td style="text-align: right;">${formatCurrency(item.quantity * item.unitPrice)}</td>
                    </tr>
                  `).join('')}
                  <tr style="border-top: 2px solid #ddd;">
                    <td colspan="3" style="text-align: right; font-weight: bold;">Subtotal:</td>
                    <td style="text-align: right; font-weight: bold;">${formatCurrency(subtotal)}</td>
                  </tr>
                  ${taxRate > 0 ? `
                    <tr>
                      <td colspan="3" style="text-align: right; font-weight: bold;">Tax (${taxRate}%):</td>
                      <td style="text-align: right; font-weight: bold;">${formatCurrency(tax)}</td>
                    </tr>
                  ` : ''}
                  <tr class="total-row">
                    <td colspan="3" style="text-align: right;">TOTAL:</td>
                    <td style="text-align: right;">${formatCurrency(total)}</td>
                  </tr>
                </tbody>
              </table>
              
              ${fullNotes ? `
                <div class="notes">
                  <div class="label">Notes</div>
                  <div class="content" style="white-space: pre-line;">${fullNotes}</div>
                </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 60px; color: #666;">
                <div style="font-size: 18px;">Thank you for your business!</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <AppNavbar />
      
      {/* Split Layout Container */}
      <div className="flex pt-16 h-screen">
        {/* Left Panel - Editor/Form */}
        <div className="w-1/2 overflow-auto border-r border-white/10 bg-[#0A0F1E]">
          <div className="p-6">
            {/* Time Entries Banner */}
            {unbilledTime.length > 0 && (
              <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl p-4 mb-6 flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#F59E0B]">
                    {unbilledTime.length} unbilled time{" "}
                    {unbilledTime.length === 1 ? "entry" : "entries"}
                  </div>
                  <div className="text-sm text-[#F59E0B]/80">
                    Worth $
                    {unbilledTime
                      .reduce(
                        (sum, e) => sum + (e.durationMinutes / 60) * e.hourlyRate,
                        0
                      )
                      .toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={() => setShowTimeEntries(true)}
                  className="bg-[#F59E0B] text-white px-4 py-2 rounded-lg hover:bg-[#F59E0B]/80 transition text-sm"
                >
                  Add to Invoice →
                </button>
              </div>
            )}

            {/* From */}
            <div className="bg-[#111827] p-6 rounded-xl border border-white/10 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white">
                  From (Your Details)
                </h2>
                {fromName && !businessInfoSaved && (
                  <button
                    onClick={handleSaveBusinessInfo}
                    className="text-sm text-[#6366F1] hover:text-[#818CF8]"
                  >
                    Save for next time
                  </button>
                )}
                {businessInfoSaved && (
                  <span className="text-sm text-[#34D399]">✓ Saved</span>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={fromName}
                    onChange={(e) => {
                      setFromName(e.target.value);
                      setBusinessInfoSaved(false);
                    }}
                    placeholder="Your Business Name"
                    className="w-full px-4 py-2 rounded-lg bg-[#1F2937] border border-white/20 text-white placeholder-[#6B7280] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={fromEmail}
                    onChange={(e) => {
                      setFromEmail(e.target.value);
                      setBusinessInfoSaved(false);
                    }}
                    placeholder="billing@yourbusiness.com"
                    className="w-full px-4 py-2 rounded-lg bg-[#1F2937] border border-white/20 text-white placeholder-[#6B7280] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-1">
                    Address
                  </label>
                  <textarea
                    value={fromAddress}
                    onChange={(e) => {
                      setFromAddress(e.target.value);
                      setBusinessInfoSaved(false);
                    }}
                    placeholder="123 Business St&#10;City, State 12345"
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg bg-[#1F2937] border border-white/20 text-white placeholder-[#6B7280] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* To */}
            <div className="bg-[#111827] p-6 rounded-xl border border-white/10 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white">
                  To (Client Details)
                </h2>
                {clients.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowClientDropdown(!showClientDropdown)}
                      className="text-sm text-[#6366F1] hover:text-[#818CF8]"
                    >
                      Select client ▾
                    </button>
                    {showClientDropdown && (
                      <div className="absolute right-0 top-8 bg-[#111827] border border-white/10 rounded-lg shadow-lg py-2 min-w-48 z-10">
                        {clients.map((client) => (
                          <button
                            key={client.id}
                            onClick={() => handleSelectClient(client)}
                            className="block w-full text-left px-4 py-2 hover:bg-[#0A0F1E] text-sm"
                          >
                            <div className="font-medium text-white">
                              {client.name}
                            </div>
                            <div className="text-[#9CA3AF] text-xs">
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
                  <label className="block text-sm text-[#9CA3AF] mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={toName}
                    onChange={(e) => setToName(e.target.value)}
                    placeholder="Client Company Name"
                    className="w-full px-4 py-2 rounded-lg bg-[#1F2937] border border-white/20 text-white placeholder-[#6B7280] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#9CA3AF] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                      placeholder="client@company.com"
                      className="w-full px-4 py-2 rounded-lg bg-[#1F2937] border border-white/20 text-white placeholder-[#6B7280] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#9CA3AF] mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={toPhone}
                      onChange={(e) => setToPhone(e.target.value)}
                      placeholder="+1 555 123 4567"
                      className="w-full px-4 py-2 rounded-lg bg-[#1F2937] border border-white/20 text-white placeholder-[#6B7280] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-1">
                    Address
                  </label>
                  <textarea
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    placeholder="123 Client St&#10;City, State 12345"
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg bg-[#1F2937] border border-white/20 text-white placeholder-[#6B7280] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none resize-none"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                  <input
                    type="checkbox"
                    checked={saveClientChecked}
                    onChange={(e) => setSaveClientChecked(e.target.checked)}
                    className="rounded border-white/20"
                  />
                  Save client for future invoices
                </label>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="bg-[#111827] p-6 rounded-xl border border-white/10 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white">Invoice Details</h2>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-sm text-[#9CA3AF] mr-2">Invoice #</label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="px-3 py-1 rounded border border-white/10 w-32 bg-[#1F2937] text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#9CA3AF] mr-2">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="px-3 py-1 rounded border border-white/10 bg-[#1F2937] text-white"
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

              {/* Payment Terms */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-[#0A0F1E] rounded-lg">
                <div>
                  <label className="text-sm text-[#9CA3AF] mr-2">Terms</label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="px-3 py-1 rounded border border-white/10 bg-[#1F2937] text-white"
                  >
                    <option value="due_on_receipt">Due on Receipt</option>
                    <option value="net_15">Net 15</option>
                    <option value="net_30">Net 30</option>
                    <option value="net_60">Net 60</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[#9CA3AF] mr-2">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="px-3 py-1 rounded border border-white/10 bg-[#1F2937] text-white"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="mb-6">
                <div className="grid grid-cols-12 gap-4 text-sm text-[#9CA3AF] mb-2">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-2 text-right">Rate</div>
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
                        placeholder="Service description"
                        className="w-full px-3 py-2 rounded bg-[#1F2937] border border-white/20 text-white placeholder-[#6B7280] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
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
                        className="w-full px-3 py-2 rounded border border-white/10 text-right bg-[#1F2937] text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
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
                        className="w-full px-3 py-2 rounded border border-white/10 text-right bg-[#1F2937] text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <span className="text-white">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </span>
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#F43F5E] hover:text-[#FB7185] text-lg"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  onClick={addItem}
                  className="mt-2 text-[#6366F1] hover:text-[#818CF8] text-sm font-medium"
                >
                  + Add Line Item
                </button>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-[#9CA3AF]">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#9CA3AF]">
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
                        className="w-16 px-2 py-1 rounded border border-white/10 text-right text-sm bg-[#1F2937] text-white"
                      />
                      <span className="text-sm">%</span>
                    </div>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-white pt-3 border-t border-white/10">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Feature: Stripe Payment Link */}
            <div className="bg-[#111827] p-6 rounded-xl border border-white/10 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#6366F1]/20 text-[#6366F1] rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <label className="text-lg font-semibold text-white">
                    Stripe Payment Links
                  </label>
                  {isPro && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-[#F59E0B]/20 text-[#F59E0B] rounded-full text-xs font-semibold">
                      <Crown className="w-3 h-3" />
                      Pro
                    </div>
                  )}
                </div>
                
                {!isPro && (
                  <Link
                    href="/upgrade"
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#6366F1] text-white rounded-lg text-sm font-semibold hover:bg-[#818CF8] transition-colors"
                  >
                    <Crown className="w-4 h-4" />
                    Upgrade
                  </Link>
                )}
              </div>

              {isPro ? (
                <>
                  <input
                    type="url"
                    value={stripePaymentLink}
                    onChange={(e) => setStripePaymentLink(e.target.value)}
                    placeholder="https://buy.stripe.com/... or paste your payment link"
                    className="w-full px-4 py-3 bg-[#1F2937] border border-white/20 text-white rounded-lg focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 outline-none"
                  />
                  <p className="text-sm text-[#9CA3AF] mt-3">
                    💳 Add a Stripe payment link so clients can pay online instantly.{" "}
                    <a
                      href="https://dashboard.stripe.com/payment-links"
                      target="_blank"
                      className="text-[#6366F1] hover:text-[#818CF8] transition-colors"
                    >
                      Create one in Stripe →
                    </a>
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <Lock className="w-12 h-12 text-[#374151] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Get Paid 3x Faster
                  </h3>
                  <p className="text-[#9CA3AF] mb-6 max-w-md mx-auto">
                    Add Stripe payment links to invoices so clients can pay instantly with credit cards, Apple Pay, or Google Pay.
                  </p>
                  <Link
                    href="/upgrade"
                    className="px-6 py-3 bg-[#6366F1] text-white rounded-lg font-semibold hover:bg-[#818CF8] hover:shadow-lg hover:shadow-[#6366F1]/25 transition-all"
                  >
                    Upgrade to Pro ($9/month)
                  </Link>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-[#111827] p-6 rounded-xl border border-white/10 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white">Notes & Terms</h2>
                <label className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                  <input
                    type="checkbox"
                    checked={includeContractTerms}
                    onChange={(e) => setIncludeContractTerms(e.target.checked)}
                    className="rounded border-white/20"
                  />
                  Include contract terms
                </label>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-[#1F2937] border border-white/20 text-white placeholder-[#6B7280] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Preview & Actions */}
        <div className="w-1/2 flex flex-col bg-[#111827]">
          {/* Preview Header */}
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold text-white">Invoice Preview</h2>
          </div>
          
          {/* Preview */}
          <div className="flex-1 overflow-hidden">
            <InvoicePreview
              invoiceNumber={invoiceNumber}
              fromName={fromName}
              fromEmail={fromEmail}
              fromAddress={fromAddress}
              toName={toName}
              toEmail={toEmail}
              toAddress={toAddress}
              dueDate={dueDate}
              items={items}
              taxRate={taxRate}
              notes={buildFullNotes()}
              currency={currency}
              stripePaymentLink={stripePaymentLink}
            />
          </div>
          
          {/* Actions Toolbar */}
          <div className="p-4 border-t border-white/10">
            <InvoiceActions
              invoiceNumber={invoiceNumber}
              fromName={fromName}
              toName={toName}
              toEmail={toEmail}
              toPhone={toPhone}
              total={formatCurrency(total)}
              dueDate={dueDate}
              stripePaymentLink={stripePaymentLink}
              onCopyReminder={copyPaymentReminder}
              onWhatsApp={shareWhatsApp}
              onSMS={shareSMS}
              onEmail={emailInvoice}
              onPrint={downloadPdf}
            />
          </div>
        </div>
      </div>

      {/* Time Entries Modal */}
      {showTimeEntries && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-semibold text-white">
                Add Time Entries
              </h3>
              <button
                onClick={() => setShowTimeEntries(false)}
                className="text-[#9CA3AF] hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-96">
              {unbilledTime.map((entry) => (
                <label
                  key={entry.id}
                  className="flex items-center gap-3 p-3 hover:bg-[#0A0F1E] rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTimeEntries.includes(entry.id)}
                    onChange={() => toggleTimeEntry(entry.id)}
                    className="rounded border-white/20"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">
                      {entry.description}
                    </div>
                    <div className="text-sm text-[#9CA3AF]">
                      {entry.clientName} •{" "}
                      {formatDuration(entry.durationMinutes)} • $
                      {((entry.durationMinutes / 60) * entry.hourlyRate).toFixed(2)}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="p-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setShowTimeEntries(false)}
                className="px-4 py-2 text-[#9CA3AF] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={addTimeEntriesToInvoice}
                disabled={selectedTimeEntries.length === 0}
                className="bg-[#6366F1] text-white px-4 py-2 rounded-lg hover:bg-[#818CF8] transition disabled:opacity-50"
              >
                Add {selectedTimeEntries.length} Entries
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}