/**
 * Local storage utilities for InvoiceFlow
 * V2: Added recurring invoices, time tracking, analytics, branding
 */

export interface BusinessInfo {
  name: string;
  email: string;
  address: string;
  phone?: string;
  paymentTerms?: string;
  lateFeePercent?: number;
  defaultNotes?: string;
  // V2: Branding
  logo?: string; // Base64 data URL
  brandColor?: string; // Hex color
  website?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  phone?: string;
  createdAt: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  clientId?: string;
  clientName: string;
  clientEmail?: string;
  total: number;
  currency: string;
  createdAt: string;
  dueDate?: string;
  paidDate?: string;
  status: "draft" | "sent" | "viewed" | "paid" | "overdue";
  html?: string;
  // V2: New fields
  stripePaymentLink?: string;
  recurringId?: string; // Links to RecurringInvoice if auto-generated
  timeEntryIds?: string[]; // Links to TimeEntry records
}

// V2: Recurring Invoices
export interface RecurringInvoice {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  currency: string;
  taxRate: number;
  notes?: string;
  frequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
  startDate: string;
  nextDueDate: string;
  endDate?: string;
  paymentTerms: string;
  includeLateFee: boolean;
  lateFeePercent: number;
  isActive: boolean;
  createdAt: string;
  lastGeneratedAt?: string;
  generatedCount: number;
}

// V2: Time Tracking
export interface TimeEntry {
  id: string;
  clientId?: string;
  clientName: string;
  projectName: string;
  description: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  hourlyRate: number;
  isBilled: boolean;
  invoiceId?: string;
  createdAt: string;
}

// V2: Analytics
export interface InvoiceAnalytics {
  totalInvoiced: number;
  totalPaid: number;
  totalOutstanding: number;
  totalOverdue: number;
  averageTimeToPayDays: number;
  invoiceCount: number;
  paidCount: number;
  overdueCount: number;
  currencyBreakdown: Record<string, number>;
  monthlyRevenue: Array<{ month: string; amount: number }>;
  topClients: Array<{ name: string; total: number }>;
}

const KEYS = {
  BUSINESS_INFO: "invoiceflow_business",
  CLIENTS: "invoiceflow_clients",
  INVOICES: "invoiceflow_invoices",
  LAST_INVOICE_NUMBER: "invoiceflow_last_invoice_num",
  RECURRING: "invoiceflow_recurring",
  TIME_ENTRIES: "invoiceflow_time_entries",
};

// ============ Business Info ============
export function saveBusinessInfo(info: BusinessInfo): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.BUSINESS_INFO, JSON.stringify(info));
}

export function getBusinessInfo(): BusinessInfo | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(KEYS.BUSINESS_INFO);
  return data ? JSON.parse(data) : null;
}

// ============ Clients ============
export function saveClient(client: Omit<Client, "id" | "createdAt">): Client {
  const clients = getClients();
  const newClient: Client = {
    ...client,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  clients.push(newClient);
  localStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
  return newClient;
}

export function getClients(): Client[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(KEYS.CLIENTS);
  return data ? JSON.parse(data) : [];
}

export function getClient(id: string): Client | undefined {
  return getClients().find((c) => c.id === id);
}

export function deleteClient(id: string): void {
  const clients = getClients().filter((c) => c.id !== id);
  localStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
}

export function updateClient(id: string, updates: Partial<Client>): void {
  const clients = getClients().map((c) =>
    c.id === id ? { ...c, ...updates } : c
  );
  localStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
}

// ============ Invoice History ============
export function saveInvoice(invoice: Omit<InvoiceRecord, "id" | "createdAt">): InvoiceRecord {
  const invoices = getInvoices();
  const newInvoice: InvoiceRecord = {
    ...invoice,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  invoices.unshift(newInvoice);
  localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices.slice(0, 500)));
  return newInvoice;
}

export function getInvoices(): InvoiceRecord[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(KEYS.INVOICES);
  return data ? JSON.parse(data) : [];
}

export function getInvoice(id: string): InvoiceRecord | undefined {
  return getInvoices().find((inv) => inv.id === id);
}

export function updateInvoice(id: string, updates: Partial<InvoiceRecord>): void {
  const invoices = getInvoices().map((inv) =>
    inv.id === id ? { ...inv, ...updates } : inv
  );
  localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
}

export function updateInvoiceStatus(id: string, status: InvoiceRecord["status"]): void {
  const updates: Partial<InvoiceRecord> = { status };
  if (status === "paid") {
    updates.paidDate = new Date().toISOString();
  }
  updateInvoice(id, updates);
}

export function deleteInvoice(id: string): void {
  const invoices = getInvoices().filter((inv) => inv.id !== id);
  localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
}

export function checkOverdueInvoices(): void {
  const invoices = getInvoices();
  const now = new Date();
  let hasChanges = false;

  const updated = invoices.map((inv) => {
    if (inv.dueDate && inv.status !== "paid" && inv.status !== "overdue") {
      const dueDate = new Date(inv.dueDate);
      if (now > dueDate) {
        hasChanges = true;
        return { ...inv, status: "overdue" as const };
      }
    }
    return inv;
  });

  if (hasChanges) {
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(updated));
  }
}

// ============ Invoice Number Generation ============
export function getNextInvoiceNumber(): string {
  if (typeof window === "undefined") {
    return `INV-${new Date().getFullYear()}-001`;
  }

  const lastNum = localStorage.getItem(KEYS.LAST_INVOICE_NUMBER);
  const year = new Date().getFullYear();

  let nextNum = 1;
  if (lastNum) {
    const [, lastYear, lastSeq] = lastNum.match(/INV-(\d+)-(\d+)/) || [];
    if (lastYear === year.toString()) {
      nextNum = parseInt(lastSeq, 10) + 1;
    }
  }

  const invoiceNumber = `INV-${year}-${String(nextNum).padStart(3, "0")}`;
  localStorage.setItem(KEYS.LAST_INVOICE_NUMBER, invoiceNumber);
  return invoiceNumber;
}

// ============ V2: Recurring Invoices ============
export function saveRecurringInvoice(
  recurring: Omit<RecurringInvoice, "id" | "createdAt" | "generatedCount">
): RecurringInvoice {
  const all = getRecurringInvoices();
  const newRecurring: RecurringInvoice = {
    ...recurring,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    generatedCount: 0,
  };
  all.push(newRecurring);
  localStorage.setItem(KEYS.RECURRING, JSON.stringify(all));
  return newRecurring;
}

export function getRecurringInvoices(): RecurringInvoice[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(KEYS.RECURRING);
  return data ? JSON.parse(data) : [];
}

export function getRecurringInvoice(id: string): RecurringInvoice | undefined {
  return getRecurringInvoices().find((r) => r.id === id);
}

export function updateRecurringInvoice(id: string, updates: Partial<RecurringInvoice>): void {
  const all = getRecurringInvoices().map((r) =>
    r.id === id ? { ...r, ...updates } : r
  );
  localStorage.setItem(KEYS.RECURRING, JSON.stringify(all));
}

export function deleteRecurringInvoice(id: string): void {
  const all = getRecurringInvoices().filter((r) => r.id !== id);
  localStorage.setItem(KEYS.RECURRING, JSON.stringify(all));
}

export function getNextRecurringDate(frequency: RecurringInvoice["frequency"], fromDate: Date): Date {
  const next = new Date(fromDate);
  switch (frequency) {
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "biweekly":
      next.setDate(next.getDate() + 14);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "quarterly":
      next.setMonth(next.getMonth() + 3);
      break;
    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

export function getDueRecurringInvoices(): RecurringInvoice[] {
  const now = new Date();
  return getRecurringInvoices().filter((r) => {
    if (!r.isActive) return false;
    if (r.endDate && new Date(r.endDate) < now) return false;
    return new Date(r.nextDueDate) <= now;
  });
}

// ============ V2: Time Tracking ============
export function saveTimeEntry(entry: Omit<TimeEntry, "id" | "createdAt">): TimeEntry {
  const entries = getTimeEntries();
  const newEntry: TimeEntry = {
    ...entry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  entries.unshift(newEntry);
  localStorage.setItem(KEYS.TIME_ENTRIES, JSON.stringify(entries.slice(0, 1000)));
  return newEntry;
}

export function getTimeEntries(): TimeEntry[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(KEYS.TIME_ENTRIES);
  return data ? JSON.parse(data) : [];
}

export function getTimeEntry(id: string): TimeEntry | undefined {
  return getTimeEntries().find((e) => e.id === id);
}

export function updateTimeEntry(id: string, updates: Partial<TimeEntry>): void {
  const entries = getTimeEntries().map((e) =>
    e.id === id ? { ...e, ...updates } : e
  );
  localStorage.setItem(KEYS.TIME_ENTRIES, JSON.stringify(entries));
}

export function deleteTimeEntry(id: string): void {
  const entries = getTimeEntries().filter((e) => e.id !== id);
  localStorage.setItem(KEYS.TIME_ENTRIES, JSON.stringify(entries));
}

export function getUnbilledTimeEntries(clientId?: string): TimeEntry[] {
  let entries = getTimeEntries().filter((e) => !e.isBilled);
  if (clientId) {
    entries = entries.filter((e) => e.clientId === clientId);
  }
  return entries;
}

export function markTimeEntriesAsBilled(ids: string[], invoiceId: string): void {
  const entries = getTimeEntries().map((e) =>
    ids.includes(e.id) ? { ...e, isBilled: true, invoiceId } : e
  );
  localStorage.setItem(KEYS.TIME_ENTRIES, JSON.stringify(entries));
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

// ============ V2: Analytics ============
export function getInvoiceAnalytics(): InvoiceAnalytics {
  const invoices = getInvoices();
  const now = new Date();

  let totalInvoiced = 0;
  let totalPaid = 0;
  let totalOutstanding = 0;
  let totalOverdue = 0;
  let paidCount = 0;
  let overdueCount = 0;
  let totalDaysToPayment = 0;
  let paymentCount = 0;

  const currencyBreakdown: Record<string, number> = {};
  const monthlyRevenueMap: Record<string, number> = {};
  const clientTotals: Record<string, number> = {};

  invoices.forEach((inv) => {
    totalInvoiced += inv.total;
    currencyBreakdown[inv.currency] = (currencyBreakdown[inv.currency] || 0) + inv.total;
    clientTotals[inv.clientName] = (clientTotals[inv.clientName] || 0) + inv.total;

    if (inv.status === "paid") {
      totalPaid += inv.total;
      paidCount++;
      // Calculate days to payment
      if (inv.paidDate && inv.createdAt) {
        const created = new Date(inv.createdAt);
        const paid = new Date(inv.paidDate);
        const days = Math.floor((paid.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        totalDaysToPayment += days;
        paymentCount++;
      }
      // Monthly revenue tracking (by paid date)
      if (inv.paidDate) {
        const month = inv.paidDate.substring(0, 7); // YYYY-MM
        monthlyRevenueMap[month] = (monthlyRevenueMap[month] || 0) + inv.total;
      }
    } else if (inv.status === "overdue") {
      totalOverdue += inv.total;
      totalOutstanding += inv.total;
      overdueCount++;
    } else if (inv.status !== "draft") {
      totalOutstanding += inv.total;
    }
  });

  // Sort monthly revenue by month
  const monthlyRevenue = Object.entries(monthlyRevenueMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12) // Last 12 months
    .map(([month, amount]) => ({ month, amount }));

  // Top clients by total invoiced
  const topClients = Object.entries(clientTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, total]) => ({ name, total }));

  return {
    totalInvoiced,
    totalPaid,
    totalOutstanding,
    totalOverdue,
    averageTimeToPayDays: paymentCount > 0 ? Math.round(totalDaysToPayment / paymentCount) : 0,
    invoiceCount: invoices.length,
    paidCount,
    overdueCount,
    currencyBreakdown,
    monthlyRevenue,
    topClients,
  };
}

// ============ Payment Terms Helpers ============
export function getPaymentTermsLabel(terms: string): string {
  const labels: Record<string, string> = {
    due_on_receipt: "Due on Receipt",
    net_15: "Net 15 (Due in 15 days)",
    net_30: "Net 30 (Due in 30 days)",
    net_60: "Net 60 (Due in 60 days)",
  };
  return labels[terms] || terms;
}

export function getDueDateFromTerms(terms: string, issueDate: Date = new Date()): Date {
  const daysMap: Record<string, number> = {
    due_on_receipt: 0,
    net_15: 15,
    net_30: 30,
    net_60: 60,
  };
  const days = daysMap[terms] || 0;
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + days);
  return dueDate;
}

export function calculateLateFee(
  total: number,
  dueDate: Date,
  lateFeePercent: number = 1.5,
  asOfDate: Date = new Date()
): { daysLate: number; fee: number; newTotal: number } {
  if (asOfDate <= dueDate) {
    return { daysLate: 0, fee: 0, newTotal: total };
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLate = Math.floor((asOfDate.getTime() - dueDate.getTime()) / msPerDay);
  const monthsLate = Math.max(1, Math.ceil(daysLate / 30));
  const fee = total * (lateFeePercent / 100) * monthsLate;

  return {
    daysLate,
    fee: Math.round(fee * 100) / 100,
    newTotal: Math.round((total + fee) * 100) / 100,
  };
}

export const PAYMENT_TERMS_NOTES: Record<string, string> = {
  due_on_receipt: "Payment is due upon receipt of this invoice.",
  net_15: "Payment is due within 15 days of the invoice date.",
  net_30: "Payment is due within 30 days of the invoice date.",
  net_60: "Payment is due within 60 days of the invoice date.",
};

export const LATE_FEE_CLAUSE = (percent: number) =>
  `A late fee of ${percent}% per month will be applied to overdue invoices.`;

export const DEFAULT_CONTRACT_TERMS = `
TERMS AND CONDITIONS:
1. Payment is due as specified above. Late payments may incur additional fees.
2. All work remains the property of the service provider until full payment is received.
3. By paying this invoice, the client agrees to these terms.
`.trim();

// ============ V2: Sharing Helpers ============
export function generateWhatsAppLink(phone: string, invoiceNumber: string, total: string, dueDate: string): string {
  const message = encodeURIComponent(
    `Hi! Invoice ${invoiceNumber} for ${total} is ready. Due: ${dueDate}. Please let me know if you have any questions!`
  );
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${message}`;
}

export function generateSMSLink(phone: string, invoiceNumber: string, total: string, dueDate: string): string {
  const message = encodeURIComponent(
    `Invoice ${invoiceNumber} for ${total} is due ${dueDate}. Please let me know if you have questions.`
  );
  const cleanPhone = phone.replace(/\D/g, "");
  return `sms:${cleanPhone}?body=${message}`;
}

// ============ V2: Stripe Payment Link Helper ============
export function formatStripePaymentLink(link: string): string {
  // Ensure it's a valid Stripe link
  if (!link) return "";
  if (link.includes("buy.stripe.com") || link.includes("checkout.stripe.com")) {
    return link;
  }
  // Try to format as payment link ID
  if (link.startsWith("plink_")) {
    return `https://buy.stripe.com/${link}`;
  }
  return link;
}
