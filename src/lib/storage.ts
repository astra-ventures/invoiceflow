/**
 * Local storage utilities for InvoiceFlow
 */

export interface BusinessInfo {
  name: string;
  email: string;
  address: string;
  phone?: string;
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
  total: number;
  currency: string;
  createdAt: string;
  status: "draft" | "sent" | "paid";
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

export function updateInvoiceStatus(id: string, status: InvoiceRecord["status"]): void {
  const invoices = getInvoices().map((inv) =>
    inv.id === id ? { ...inv, status } : inv
  );
  localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
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
