import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateInvoice from '../app/create/page'

// Mock the storage module
jest.mock('../lib/storage', () => ({
  getBusinessInfo: () => null,
  saveBusinessInfo: jest.fn(),
  getClients: () => [],
  saveClient: jest.fn(),
  getNextInvoiceNumber: () => 'INV-001',
  saveInvoice: jest.fn(),
  getDueDateFromTerms: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  getUnbilledTimeEntries: () => [],
  markTimeEntriesAsBilled: jest.fn(),
  formatDuration: jest.fn(),
  generateWhatsAppLink: jest.fn(),
  generateSMSLink: jest.fn(),
  formatStripePaymentLink: (link: string) => link,
  PAYMENT_TERMS_NOTES: { net_30: 'Payment due within 30 days' },
  LATE_FEE_CLAUSE: (percent: number) => `${percent}% late fee applies`,
  DEFAULT_CONTRACT_TERMS: 'Standard contract terms apply',
}))

// Mock fetch globally
global.fetch = jest.fn()

describe('Create Invoice Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the main form elements', () => {
    render(<CreateInvoice />)
    
    expect(screen.getByText(/From \(Your Details\)/i)).toBeInTheDocument()
    expect(screen.getByText(/To \(Client Details\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Invoice Details/i)).toBeInTheDocument()
    expect(screen.getByText(/Notes & Terms/i)).toBeInTheDocument()
    
    expect(screen.getByPlaceholderText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Client Inc')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Web Development')).toBeInTheDocument()
  })

  it('shows InvoiceFlow branding and navigation', () => {
    render(<CreateInvoice />)
    
    expect(screen.getByText('Invoice')).toBeInTheDocument()
    expect(screen.getByText('Flow')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /history/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /time/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /clients/i })).toBeInTheDocument()
  })

  it('validates required fields', () => {
    render(<CreateInvoice />)
    
    const generateButton = screen.getByRole('button', { name: /preview invoice/i })
    expect(generateButton).toBeDisabled()
  })

  it('enables generate button when required fields are filled', async () => {
    const user = userEvent.setup()
    render(<CreateInvoice />)
    
    // Fill required fields
    await user.type(screen.getByPlaceholderText('Acme Corp'), 'My Business')
    await user.type(screen.getByPlaceholderText('Client Inc'), 'Test Client')
    await user.type(screen.getByPlaceholderText('Web Development'), 'Consulting Services')
    
    const generateButton = screen.getByRole('button', { name: /preview invoice/i })
    expect(generateButton).not.toBeDisabled()
  })

  it('allows adding and removing line items', async () => {
    const user = userEvent.setup()
    render(<CreateInvoice />)
    
    // Initially should have 1 line item
    expect(screen.getAllByPlaceholderText('Web Development')).toHaveLength(1)
    
    // Add a line item
    await user.click(screen.getByText('+ Add Line Item'))
    expect(screen.getAllByPlaceholderText('Web Development')).toHaveLength(2)
    
    // Remove button should appear only when we have multiple items
    const removeButtons = screen.queryAllByText('×')
    expect(removeButtons.length).toBeGreaterThan(0)
  })

  it('calculates totals correctly', async () => {
    const user = userEvent.setup()
    render(<CreateInvoice />)
    
    // Fill in a line item with quantity and price
    const quantityInput = screen.getByDisplayValue('1')
    const priceInput = screen.getAllByDisplayValue('0')[0] // First price input
    
    await user.clear(quantityInput)
    await user.type(quantityInput, '2')
    
    await user.clear(priceInput)
    await user.type(priceInput, '100')
    
    // Check if total is calculated - should show $200.00 in multiple places
    await waitFor(() => {
      const amounts = screen.getAllByText('$200.00')
      expect(amounts.length).toBeGreaterThanOrEqual(2) // Line item + subtotal + total
    })
  })

  it('shows payment terms and due date options', () => {
    render(<CreateInvoice />)
    
    // Look for the payment terms select by checking for the options
    expect(screen.getByText('Payment Terms')).toBeInTheDocument()
    expect(screen.getByText('Due Date')).toBeInTheDocument()
    expect(screen.getByLabelText(/late fee/i)).toBeInTheDocument()
    
    // Check if Net 30 option exists in select dropdown
    const selects = screen.getAllByRole('combobox')
    expect(selects.length).toBeGreaterThan(0)
    
    // At least one select should have the net_30 value (payment terms)
    const hasNet30 = selects.some(select => select.value === 'net_30')
    expect(hasNet30).toBe(true)
  })

  it('has Stripe payment link input', () => {
    render(<CreateInvoice />)
    
    expect(screen.getByText(/💳 Stripe Payment Link/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/https:\/\/buy\.stripe\.com/)).toBeInTheDocument()
  })

  it('allows saving business info', async () => {
    const user = userEvent.setup()
    render(<CreateInvoice />)
    
    // Fill business info
    await user.type(screen.getByPlaceholderText('Acme Corp'), 'My Business')
    await user.type(screen.getByPlaceholderText('billing@acme.com'), 'test@business.com')
    
    // Save button should appear
    const saveButton = screen.getByText('Save for next time')
    expect(saveButton).toBeInTheDocument()
    
    await user.click(saveButton)
    
    // Should show saved status
    await waitFor(() => {
      expect(screen.getByText('✓ Saved')).toBeInTheDocument()
    })
  })

  it('allows saving client info', async () => {
    const user = userEvent.setup()
    render(<CreateInvoice />)
    
    // Fill client info
    await user.type(screen.getByPlaceholderText('Client Inc'), 'Test Client')
    await user.type(screen.getByPlaceholderText('accounts@client.com'), 'client@test.com')
    
    // Check the save client checkbox
    const saveClientCheckbox = screen.getByLabelText(/save client for future invoices/i)
    await user.click(saveClientCheckbox)
    
    expect(saveClientCheckbox).toBeChecked()
  })
})