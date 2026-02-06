/**
 * Local storage utilities for InvoiceFlow
 */

export interface BusinessInfo {
  name: string;
  email: string;
  address: string;
  phone?: string;
  paymentTerms?: string; // "due_on_receipt" | "net_15" | "net_30" | "net_60"
  lateFeePercent?: number;
  defaultNotes?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  total: number;
  currency: string;
  createdAt: string;
  dueDate?: string;
  status: "draft" | "sent" | "viewed" | "paid" | "overdue";
  html?: string; // Store the generated HTML for resending
}

const KEYS = {
  BUSINESS_INFO: "invoiceflow_business",
  CLIENTS: "invoiceflow_clients",
  INVOICES: "invoiceflow_invoices",
  LAST_INVOICE_NUMBER: "invoiceflow_last_invoice_num",
};

// Business Info
export function saveBusinessInfo(info: BusinessInfo): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.BUSINESS_INFO, JSON.stringify(info));
}

export function getBusinessInfo(): BusinessInfo | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(KEYS.BUSINESS_INFO);
  return data ? JSON.parse(data) : null;
}

// Clients
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

// Invoice History
export function saveInvoice(invoice: Omit<InvoiceRecord, "id" | "createdAt">): InvoiceRecord {
  const invoices = getInvoices();
  const newInvoice: InvoiceRecord = {
    ...invoice,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  invoices.unshift(newInvoice); // Most recent first
  localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices.slice(0, 100))); // Keep last 100
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
  updateInvoice(id, { status });
}

// Check and update overdue invoices
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

// Invoice Number Generation
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

// Payment Terms Helpers
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

// Late Fee Calculator
export function calculateLateFee(
  total: number,
  dueDate: Date,
  lateFeePercent: number = 1.5, // Default 1.5% per month
  asOfDate: Date = new Date()
): { daysLate: number; fee: number; newTotal: number } {
  if (asOfDate <= dueDate) {
    return { daysLate: 0, fee: 0, newTotal: total };
  }
  
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLate = Math.floor((asOfDate.getTime() - dueDate.getTime()) / msPerDay);
  const monthsLate = Math.max(1, Math.ceil(daysLate / 30)); // At least 1 month
  const fee = total * (lateFeePercent / 100) * monthsLate;
  
  return {
    daysLate,
    fee: Math.round(fee * 100) / 100,
    newTotal: Math.round((total + fee) * 100) / 100,
  };
}

// Payment terms presets for notes
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
