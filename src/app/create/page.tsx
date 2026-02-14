"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Crown, Zap, Lock } from "lucide-react";
import { hasProAccess } from "@/lib/stripe";
import { AppNavbar } from "@/app/_components/AppNavbar";
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
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
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
          phone: toPhone,
        });
        setClients([...clients, newClient]);
        setSaveClientChecked(false);
      }

      // Mark time entries as billed
      const timeEntryIds = items
        .filter((i) => i.timeEntryId)
        .map((i) => i.timeEntryId!);

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
        stripePaymentLink: stripePaymentLink
          ? formatStripePaymentLink(stripePaymentLink)
          : undefined,
        timeEntryIds: timeEntryIds.length > 0 ? timeEntryIds : undefined,
      });

      // Mark time entries as billed after saving invoice
      if (timeEntryIds.length > 0) {
        markTimeEntriesAsBilled(timeEntryIds, invoice.id);
      }
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

    const subject = encodeURIComponent(
      `Invoice ${invoiceNumber} from ${fromName}`
    );
    const body = encodeURIComponent(
      `Hi ${toName},\n\nPlease find attached invoice ${invoiceNumber} for ${formatCurrency(total)}.\n\nDue Date: ${new Date(dueDate).toLocaleDateString()}${stripePaymentLink ? `\n\nPay online: ${formatStripePaymentLink(stripePaymentLink)}` : ""}\n\nThank you for your business!\n\nBest regards,\n${fromName}`
    );

    window.open(`mailto:${toEmail}?subject=${subject}&body=${body}`, "_blank");
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

  if (previewHtml) {
    return (
      <div className="min-h-screen bg-[#0A0F1E]">
        <div className="bg-[#111827] border-b border-white/10 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setPreviewHtml(null)}
              className="text-[#9CA3AF] hover:text-white flex items-center gap-2"
            >
              ← Back to Editor
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={copyPaymentReminder}
                className="text-[#9CA3AF] hover:text-white px-3 py-2 rounded-lg border border-white/10 hover:bg-[#0A0F1E] transition text-sm"
              >
                📋 Copy Reminder
              </button>
              <button
                onClick={shareWhatsApp}
                className="text-green-600 hover:text-green-700 px-3 py-2 rounded-lg border border-green-200 hover:bg-green-50 transition text-sm"
              >
                💬 WhatsApp
              </button>
              <button
                onClick={shareSMS}
                className="text-[#6366F1] hover:text-[#818CF8] px-3 py-2 rounded-lg border border-[#6366F1]/30 hover:bg-[#6366F1]/10 transition text-sm"
              >
                📱 SMS
              </button>
              <button
                onClick={emailInvoice}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm"
              >
                ✉️ Email
              </button>
              <button
                onClick={downloadPdf}
                className="bg-[#6366F1] text-white px-4 py-2 rounded-lg hover:bg-[#818CF8] transition flex items-center gap-2 text-sm"
              >
                🖨️ Print / PDF
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div
            className="bg-[#111827] shadow-xl rounded-lg overflow-hidden"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <AppNavbar />
      
      {/* Generate Button - Fixed Position */}
      <div className="fixed top-20 right-6 z-40">
        <button
          onClick={generateInvoice}
          disabled={
            loading ||
            !fromName ||
            !toName ||
            items.every((i) => !i.description)
          }
          className="bg-[#6366F1] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#818CF8] hover:shadow-lg hover:shadow-[#6366F1]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Preview Invoice →"}
        </button>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8 pt-24">
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

        <div className="grid md:grid-cols-2 gap-8">
          {/* From */}
          <div className="bg-[#111827] p-6 rounded-xl border border-white/10">
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
                <span className="text-sm text-green-600">✓ Saved</span>
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
                  placeholder="Acme Corp"
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
                  placeholder="billing@acme.com"
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
                  placeholder="123 Business St&#10;New York, NY 10001"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg bg-[#1F2937] border border-white/20 text-white placeholder-[#6B7280] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* To */}
          <div className="bg-[#111827] p-6 rounded-xl border border-white/10">
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
                    Select saved client ▾
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
                  placeholder="Client Inc"
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
                    placeholder="accounts@client.com"
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
                  placeholder="456 Client Ave&#10;Los Angeles, CA 90001"
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
        </div>

        {/* Invoice Details */}
        <div className="mt-8 bg-[#111827] p-6 rounded-xl border border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="font-semibold text-white">Invoice Details</h2>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="text-sm text-[#9CA3AF] mr-2">Invoice #</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="px-3 py-1 rounded border border-white/10 w-36"
                />
              </div>
              <div>
                <label className="text-sm text-[#9CA3AF] mr-2">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-3 py-1 rounded border border-white/10"
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
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-[#0A0F1E] rounded-lg">
            <div>
              <label className="text-sm text-[#9CA3AF] mr-2">
                Payment Terms
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="px-3 py-1 rounded border border-white/10"
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
                className="px-3 py-1 rounded border border-white/10"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                <input
                  type="checkbox"
                  checked={includeLateFee}
                  onChange={(e) => setIncludeLateFee(e.target.checked)}
                  className="rounded border-white/20"
                />
                Late fee
              </label>
              {includeLateFee && (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={lateFeePercent}
                    onChange={(e) =>
                      setLateFeePercent(parseFloat(e.target.value) || 0)
                    }
                    min="0"
                    max="10"
                    step="0.5"
                    className="w-16 px-2 py-1 rounded border border-white/10 text-sm"
                  />
                  <span className="text-sm text-[#9CA3AF]">%/mo</span>
                </div>
              )}
            </div>
          </div>

          {/* Pro Feature: Stripe Payment Link */}
          <div className="mb-6 p-6 bg-[#111827] rounded-xl border border-white/10 relative">
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
                  Add Stripe payment links to invoices so clients can pay instantly with credit cards, Apple Pay, or Google Pay. No more waiting for checks!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/upgrade"
                    className="px-6 py-3 bg-[#6366F1] text-white rounded-lg font-semibold hover:bg-[#818CF8] hover:shadow-lg hover:shadow-[#6366F1]/25 transition-all"
                  >
                    Upgrade to Pro ($9/month)
                  </Link>
                  <button
                    type="button"
                    className="px-6 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-[#111827]/5 transition-colors"
                    onClick={() => alert('Demo: This would show a preview of how Stripe payment links appear on invoices')}
                  >
                    See Demo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className="mt-4">
            <div className="grid grid-cols-12 gap-4 text-sm text-[#9CA3AF] mb-2">
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
                    className="w-full px-3 py-2 rounded border border-white/10 text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
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
                    className="w-full px-3 py-2 rounded border border-white/10 text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
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
          <div className="mt-8 flex justify-end">
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
                    className="w-16 px-2 py-1 rounded border border-white/10 text-right text-sm"
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

        {/* Notes */}
        <div className="mt-8 bg-[#111827] p-6 rounded-xl border border-white/10">
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
            placeholder="Additional notes (payment terms and late fee clause will be auto-added)..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-[#1F2937] border border-white/20 text-white placeholder-[#6B7280] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none resize-none"
          />
          <p className="mt-2 text-xs text-[#9CA3AF]">
            Payment terms ({paymentTerms.replace("_", " ")})
            {includeLateFee && ` and ${lateFeePercent}% late fee clause`}
            {includeContractTerms && " and contract terms"}
            {stripePaymentLink && " and payment link"} will be automatically
            included.
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
            className="bg-[#6366F1] text-white px-12 py-4 rounded-xl text-lg font-semibold hover:bg-[#818CF8] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25"
          >
            {loading ? "Generating..." : "Generate Invoice →"}
          </button>
        </div>
      </main>
    </div>
  );
}
