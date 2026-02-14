import { render, screen } from '@testing-library/react'

// Mock framer-motion to avoid client-side animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock Next.js components that might cause issues
jest.mock('next/link', () => {
  return ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>
})

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

// Import Home component after mocks are set up
import Home from '../app/page'

describe('Homepage', () => {
  it('renders without crashing', () => {
    const { container } = render(<Home />)
    expect(container).toBeInTheDocument()
  })

  it('contains main element', () => {
    render(<Home />)
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('min-h-screen')
  })

  it('contains InvoiceFlow branding text', () => {
    render(<Home />)
    // Look for the text content using getAllByText to handle multiple instances
    const invoiceElements = screen.getAllByText(/Invoice/)
    const flowElements = screen.getAllByText(/Flow/)
    
    expect(invoiceElements.length).toBeGreaterThan(0)
    expect(flowElements.length).toBeGreaterThan(0)
  })

  it('contains main heading with invoice-related text', () => {
    render(<Home />)
    // Look for heading that contains invoice-related text (the actual heading is "Professional invoices in 60 seconds")
    const headings = screen.getAllByRole('heading')
    const hasInvoiceHeading = headings.some(heading => 
      heading.textContent?.toLowerCase().includes('invoices') ||
      heading.textContent?.toLowerCase().includes('invoice')
    )
    expect(hasInvoiceHeading).toBe(true)
  })

  it('has navigation links', () => {
    render(<Home />)
    // Look for common navigation links
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    
    // Check for specific href values that should exist
    const linkHrefs = links.map(link => link.getAttribute('href'))
    expect(linkHrefs).toContain('/create')
  })

  it('displays pricing information', () => {
    render(<Home />)
    // Look for pricing-related text using getAllByText to handle multiple instances
    const freeElements = screen.queryAllByText(/free/i)
    const proElements = screen.queryAllByText(/pro/i)
    
    expect(freeElements.length > 0 || proElements.length > 0).toBe(true)
  })

  it('has call-to-action links', () => {
    render(<Home />)
    // Look for CTA links that go to /create
    const links = screen.getAllByRole('link')
    const createLinks = links.filter(link => link.getAttribute('href') === '/create')
    
    expect(createLinks.length).toBeGreaterThan(0)
  })
})