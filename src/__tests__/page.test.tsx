import { render, screen } from '@testing-library/react'
import Home from '../app/page'

describe('Homepage', () => {
  it('renders the main heading', () => {
    render(<Home />)
    
    expect(screen.getByText(/Create professional invoices in/i)).toBeInTheDocument()
    expect(screen.getByText(/60 seconds/i)).toBeInTheDocument()
  })

  it('displays InvoiceFlow branding', () => {
    render(<Home />)
    
    expect(screen.getByText('Invoice')).toBeInTheDocument()
    expect(screen.getByText('Flow')).toBeInTheDocument()
  })

  it('shows navigation links', () => {
    render(<Home />)
    
    // Look for navigation links by checking for specific href values
    expect(screen.getByRole('link', { name: 'Create' })).toHaveAttribute('href', '/create')
    expect(screen.getByRole('link', { name: 'History' })).toHaveAttribute('href', '/history')
    expect(screen.getByRole('link', { name: 'Recurring' })).toHaveAttribute('href', '/recurring')
    expect(screen.getByRole('link', { name: 'Analytics' })).toHaveAttribute('href', '/analytics')
    expect(screen.getByRole('link', { name: 'API Access' })).toBeInTheDocument()
    
    // Check Time Tracking nav link specifically
    const timeLinks = screen.getAllByRole('link', { name: 'Time Tracking' })
    expect(timeLinks.length).toBeGreaterThanOrEqual(1)
    expect(timeLinks.find(link => link.getAttribute('href') === '/time')).toBeInTheDocument()
  })

  it('displays feature cards', () => {
    render(<Home />)
    
    // Use getAllByText for duplicated text and verify count
    expect(screen.getByText('Lightning Fast')).toBeInTheDocument()
    expect(screen.getByText('Stripe Payments')).toBeInTheDocument()
    expect(screen.getAllByText('Time Tracking')).toHaveLength(2) // nav + feature
    expect(screen.getByText('Recurring Invoices')).toBeInTheDocument()
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument()
    expect(screen.getByText('WhatsApp & SMS')).toBeInTheDocument()
  })

  it('shows pricing tiers', () => {
    render(<Home />)
    
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('API')).toBeInTheDocument()
  })

  it('displays primary CTA button', () => {
    render(<Home />)
    
    const ctaButton = screen.getByRole('link', { name: /create free invoice/i })
    expect(ctaButton).toBeInTheDocument()
    expect(ctaButton).toHaveAttribute('href', '/create')
  })
})