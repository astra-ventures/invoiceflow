/**
 * @jest-environment jsdom
 */

import {
  saveBusinessInfo,
  getBusinessInfo,
  saveClient,
  getClients,
  deleteClient,
  updateClient,
  saveInvoice,
  getInvoices,
  deleteInvoice,
  saveTimeEntry,
  getTimeEntries,
  deleteTimeEntry,
  saveRecurringInvoice,
  getRecurringInvoices,
  deleteRecurringInvoice,
  type BusinessInfo,
  type Client,
  type InvoiceRecord,
  type TimeEntry,
  type RecurringInvoice
} from '../lib/storage';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Storage Library', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Business Info', () => {
    test('saves business info to localStorage', () => {
      const businessInfo: BusinessInfo = {
        name: 'Test Company',
        email: 'test@company.com',
        address: '123 Main St',
        phone: '555-0123',
        paymentTerms: 'Net 30',
        lateFeePercent: 5,
        defaultNotes: 'Thank you for your business',
        logo: 'data:image/png;base64,test',
        brandColor: '#007bff',
        website: 'https://test.com'
      };

      saveBusinessInfo(businessInfo);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'invoiceflow_business',
        JSON.stringify(businessInfo)
      );
    });

    test('retrieves business info from localStorage', () => {
      const businessInfo: BusinessInfo = {
        name: 'Test Company',
        email: 'test@company.com',
        address: '123 Main St'
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(businessInfo));

      const result = getBusinessInfo();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('invoiceflow_business');
      expect(result).toEqual(businessInfo);
    });

    test('returns null when no business info exists', () => {
      const result = getBusinessInfo();
      expect(result).toBeNull();
    });
  });

  describe('Clients', () => {
    test('saves new client to localStorage', () => {
      const existingClients: Client[] = [];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingClients));

      const newClientData = {
        name: 'John Doe',
        email: 'john@example.com',
        address: '456 Oak St',
        phone: '555-0456'
      };

      const savedClient = saveClient(newClientData);

      expect(savedClient).toMatchObject({
        ...newClientData,
        id: expect.any(String),
        createdAt: expect.any(String)
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'invoiceflow_clients',
        expect.any(String)
      );
    });

    test('updates existing client using updateClient', () => {
      const existingClient: Client = {
        id: 'client-1',
        name: 'John Doe',
        email: 'john@example.com',
        address: '456 Oak St',
        createdAt: '2026-02-13T12:00:00.000Z'
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify([existingClient]));

      updateClient('client-1', { name: 'John Smith', phone: '555-0789' });

      const expectedClient = {
        ...existingClient,
        name: 'John Smith',
        phone: '555-0789'
      };

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'invoiceflow_clients',
        JSON.stringify([expectedClient])
      );
    });

    test('retrieves all clients', () => {
      const clients: Client[] = [
        {
          id: 'client-1',
          name: 'John Doe',
          email: 'john@example.com',
          address: '456 Oak St',
          createdAt: '2026-02-13T12:00:00.000Z'
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(clients));

      const result = getClients();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('invoiceflow_clients');
      expect(result).toEqual(clients);
    });

    test('deletes client by ID', () => {
      const clients: Client[] = [
        {
          id: 'client-1',
          name: 'John Doe',
          email: 'john@example.com',
          address: '456 Oak St',
          createdAt: '2026-02-13T12:00:00.000Z'
        },
        {
          id: 'client-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          address: '789 Pine St',
          createdAt: '2026-02-13T12:00:00.000Z'
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(clients));

      deleteClient('client-1');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'invoiceflow_clients',
        JSON.stringify([clients[1]])
      );
    });
  });

  describe('Invoices', () => {
    test('saves new invoice', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([]));

      const invoiceData = {
        invoiceNumber: 'INV-001',
        clientId: 'client-1',
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        total: 1500.00,
        currency: 'USD',
        dueDate: '2026-03-15T12:00:00.000Z',
        status: 'draft' as const,
        html: '<p>Invoice HTML</p>',
        stripePaymentLink: 'https://pay.stripe.com/test'
      };

      const savedInvoice = saveInvoice(invoiceData);

      expect(savedInvoice).toMatchObject({
        ...invoiceData,
        id: expect.any(String),
        createdAt: expect.any(String)
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'invoiceflow_invoices',
        expect.any(String)
      );
    });

    test('retrieves all invoices', () => {
      const invoices: InvoiceRecord[] = [
        {
          id: 'invoice-1',
          invoiceNumber: 'INV-001',
          clientName: 'John Doe',
          total: 1500.00,
          currency: 'USD',
          createdAt: '2026-02-13T12:00:00.000Z',
          status: 'paid'
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(invoices));

      const result = getInvoices();

      expect(result).toEqual(invoices);
    });

    test('deletes invoice by ID', () => {
      const invoices: InvoiceRecord[] = [
        {
          id: 'invoice-1',
          invoiceNumber: 'INV-001',
          clientName: 'John Doe',
          total: 1500.00,
          currency: 'USD',
          createdAt: '2026-02-13T12:00:00.000Z',
          status: 'paid'
        },
        {
          id: 'invoice-2',
          invoiceNumber: 'INV-002',
          clientName: 'Jane Smith',
          total: 2000.00,
          currency: 'USD',
          createdAt: '2026-02-13T12:00:00.000Z',
          status: 'draft'
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(invoices));

      deleteInvoice('invoice-1');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'invoiceflow_invoices',
        JSON.stringify([invoices[1]])
      );
    });
  });

  describe('Time Entries', () => {
    test('saves new time entry', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([]));

      const timeEntryData = {
        clientId: 'client-1',
        clientName: 'John Doe',
        projectName: 'Website Development',
        description: 'Frontend Coding',
        startTime: '2026-02-13T09:00:00.000Z',
        endTime: '2026-02-13T17:00:00.000Z',
        durationMinutes: 480, // 8 hours in minutes
        hourlyRate: 100,
        isBilled: false
      };

      const savedEntry = saveTimeEntry(timeEntryData);

      expect(savedEntry).toMatchObject({
        ...timeEntryData,
        id: expect.any(String),
        createdAt: expect.any(String)
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'invoiceflow_time_entries',
        expect.any(String)
      );
    });

    test('retrieves all time entries', () => {
      const timeEntries: TimeEntry[] = [
        {
          id: 'time-1',
          clientId: 'client-1',
          clientName: 'John Doe',
          project: 'Website Development',
          task: 'Frontend Coding',
          startTime: '2026-02-13T09:00:00.000Z',
          endTime: '2026-02-13T17:00:00.000Z',
          duration: 28800,
          hourlyRate: 100,
          billed: false,
          createdAt: '2026-02-13T09:00:00.000Z'
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(timeEntries));

      const result = getTimeEntries();

      expect(result).toEqual(timeEntries);
    });
  });

  describe('Recurring Invoices', () => {
    test('saves new recurring invoice template', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([]));

      const recurringData = {
        name: 'Monthly Retainer - John Doe',
        clientId: 'client-1',
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        items: [
          {
            description: 'Monthly Development Retainer',
            quantity: 1,
            unitPrice: 5000
          }
        ],
        currency: 'USD',
        taxRate: 0,
        frequency: 'monthly' as const,
        startDate: '2026-02-13T00:00:00.000Z',
        nextDueDate: '2026-03-13T00:00:00.000Z',
        paymentTerms: 'net_30',
        includeLateFee: false,
        lateFeePercent: 0,
        isActive: true
      };

      const savedRecurring = saveRecurringInvoice(recurringData);

      expect(savedRecurring).toMatchObject({
        ...recurringData,
        id: expect.any(String),
        createdAt: expect.any(String),
        generatedCount: 0
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'invoiceflow_recurring',
        expect.any(String)
      );
    });

    test('retrieves all recurring invoices', () => {
      const recurringInvoices: RecurringInvoice[] = [
        {
          id: 'recurring-1',
          name: 'Monthly Retainer',
          clientId: 'client-1',
          clientName: 'John Doe',
          frequency: 'monthly',
          nextDueDate: '2026-03-13T00:00:00.000Z',
          amount: 5000,
          currency: 'USD',
          isActive: true,
          createdAt: '2026-02-13T12:00:00.000Z',
          invoiceTemplate: {
            items: [],
            taxRate: 0,
            discount: 0
          }
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(recurringInvoices));

      const result = getRecurringInvoices();

      expect(result).toEqual(recurringInvoices);
    });
  });

  describe('Edge Cases', () => {
    test('returns empty arrays for getter functions when no data exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      expect(getClients()).toEqual([]);
      expect(getInvoices()).toEqual([]);
      expect(getTimeEntries()).toEqual([]);
      expect(getRecurringInvoices()).toEqual([]);
    });

    test('returns null for getBusinessInfo when no data exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      expect(getBusinessInfo()).toBeNull();
    });
  });
});