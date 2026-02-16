import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Code, Globe, Key, Database, Zap, Mail, ExternalLink } from "lucide-react";

export const metadata = {
  title: "API Documentation | InvoiceFlow - Developer Integration Guide",
  description: "InvoiceFlow API documentation for developers. Learn how to integrate invoice generation, templates, and automation into your applications and workflows.",
};

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E]">
      <Navbar />
      
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6366F1]/10 rounded-xl mb-6">
              <Code className="w-8 h-8 text-[#6366F1]" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">API Documentation</h1>
            <p className="text-xl text-[#9CA3AF] max-w-3xl mx-auto">
              Integrate InvoiceFlow's powerful invoice generation capabilities into your applications, 
              workflows, and business systems with our developer-friendly API.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-6">
          
          {/* API Status Notice */}
          <div className="bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 rounded-lg p-6 border border-[#6366F1]/20 mb-8">
            <div className="flex items-start gap-4">
              <Zap className="w-6 h-6 text-[#6366F1] mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">API Coming Soon</h2>
                <p className="text-[#9CA3AF] mb-4">
                  InvoiceFlow's REST API is currently in development and will be available to Pro tier users in Q2 2026. 
                  This documentation provides a preview of planned endpoints and capabilities.
                </p>
                <p className="text-[#6366F1] font-medium">
                  Join the waitlist below to get early access and development updates.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            
            {/* Overview */}
            <div className="bg-[#111827] rounded-xl border border-white/10 p-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <Globe className="w-6 h-6 text-[#6366F1]" />
                API Overview
              </h2>
              
              <p className="text-[#9CA3AF] mb-6 leading-relaxed">
                The InvoiceFlow API will provide RESTful endpoints for programmatic invoice generation, 
                client management, and business automation. Built with developer experience in mind, 
                the API emphasizes simplicity, reliability, and comprehensive documentation.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#6366F1]" />
                    Authentication
                  </h3>
                  <p className="text-[#9CA3AF] text-sm">API key-based authentication with rate limiting and usage monitoring</p>
                </div>
                <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#6366F1]" />
                    Data Format
                  </h3>
                  <p className="text-[#9CA3AF] text-sm">JSON request/response with comprehensive error handling and validation</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#0A0F1E] rounded border border-[#374151]">
                <h3 className="text-white font-medium mb-2">Base URL (Planned)</h3>
                <code className="text-[#6366F1] bg-[#111827] px-3 py-1 rounded font-mono text-sm">
                  https://api.invoiceflow.app/v1
                </code>
              </div>
            </div>

            {/* Authentication */}
            <div className="bg-[#111827] rounded-xl border border-white/10 p-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <Key className="w-6 h-6 text-[#6366F1]" />
                Authentication
              </h2>
              
              <p className="text-[#9CA3AF] mb-6">
                API access requires a valid API key included in request headers. API keys will be available 
                to InvoiceFlow Pro subscribers through the dashboard settings.
              </p>
              
              <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151] mb-4">
                <h3 className="text-white font-medium mb-3">Header Authentication</h3>
                <pre className="bg-[#111827] rounded p-3 overflow-x-auto">
                  <code className="text-sm text-[#6366F1]">
{`curl -X GET "https://api.invoiceflow.app/v1/invoices" \\
     -H "Authorization: Bearer your-api-key" \\
     -H "Content-Type: application/json"`}
                  </code>
                </pre>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                  <h3 className="text-white font-medium mb-2">Rate Limits</h3>
                  <ul className="text-[#9CA3AF] text-sm space-y-1">
                    <li>• 100 requests per minute</li>
                    <li>• 10,000 requests per day</li>
                    <li>• Burst allowance: 200 requests</li>
                  </ul>
                </div>
                <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                  <h3 className="text-white font-medium mb-2">Response Headers</h3>
                  <ul className="text-[#9CA3AF] text-sm space-y-1">
                    <li>• <code>X-RateLimit-Remaining</code></li>
                    <li>• <code>X-RateLimit-Reset</code></li>
                    <li>• <code>X-Request-ID</code></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Endpoints */}
            <div className="bg-[#111827] rounded-xl border border-white/10 p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">API Endpoints</h2>
              
              {/* Generate Invoice */}
              <div className="space-y-6">
                <div className="border-l-4 border-[#10B981] pl-6 bg-[#10B981]/5 py-4 rounded-r">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-[#10B981] text-white px-3 py-1 rounded text-sm font-mono">POST</span>
                    <code className="text-[#10B981] font-mono">/api/generate-invoice</code>
                  </div>
                  <p className="text-[#9CA3AF] mb-4">
                    Generate a professional invoice with customizable templates, automatic calculations, 
                    and PDF export. Supports line items, taxes, discounts, and payment terms.
                  </p>
                  
                  <h4 className="text-white font-medium mb-3">Request Body Example</h4>
                  <pre className="bg-[#0A0F1E] rounded p-4 overflow-x-auto border border-[#374151]">
                    <code className="text-sm text-[#9CA3AF]">
{`{
  "invoice": {
    "number": "INV-2026-001",
    "date": "2026-02-16",
    "due_date": "2026-03-16",
    "currency": "USD",
    "status": "draft"
  },
  "from": {
    "name": "Your Company",
    "email": "hello@company.com", 
    "address": "123 Business St\\nCity, State 12345",
    "logo": "https://company.com/logo.png"
  },
  "to": {
    "name": "Client Company",
    "email": "billing@client.com",
    "address": "456 Client Ave\\nCity, State 67890"
  },
  "items": [
    {
      "description": "Web Development Services",
      "quantity": 40,
      "rate": 125.00,
      "amount": 5000.00
    },
    {
      "description": "Project Management", 
      "quantity": 10,
      "rate": 100.00,
      "amount": 1000.00
    }
  ],
  "subtotal": 6000.00,
  "tax_rate": 8.25,
  "tax_amount": 495.00,
  "total": 6495.00,
  "notes": "Payment due within 30 days",
  "payment_terms": "Net 30"
}`}
                    </code>
                  </pre>
                  
                  <h4 className="text-white font-medium mb-3 mt-6">Response</h4>
                  <pre className="bg-[#0A0F1E] rounded p-4 overflow-x-auto border border-[#374151]">
                    <code className="text-sm text-[#9CA3AF]">
{`{
  "success": true,
  "invoice": {
    "id": "inv_2026_abc123",
    "number": "INV-2026-001", 
    "status": "generated",
    "pdf_url": "https://api.invoiceflow.app/v1/invoices/inv_2026_abc123/pdf",
    "public_url": "https://invoice.link/inv_2026_abc123",
    "created_at": "2026-02-16T10:30:00Z"
  }
}`}
                    </code>
                  </pre>
                </div>

                {/* Get Templates */}
                <div className="border-l-4 border-[#0EA5E9] pl-6 bg-[#0EA5E9]/5 py-4 rounded-r">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-[#0EA5E9] text-white px-3 py-1 rounded text-sm font-mono">GET</span>
                    <code className="text-[#0EA5E9] font-mono">/api/templates</code>
                  </div>
                  <p className="text-[#9CA3AF] mb-4">
                    Retrieve available invoice templates with preview images and customization options. 
                    Use template IDs with the generate-invoice endpoint for consistent branding.
                  </p>
                  
                  <h4 className="text-white font-medium mb-3">Response</h4>
                  <pre className="bg-[#0A0F1E] rounded p-4 overflow-x-auto border border-[#374151]">
                    <code className="text-sm text-[#9CA3AF]">
{`{
  "templates": [
    {
      "id": "modern",
      "name": "Modern Professional",
      "description": "Clean, minimalist design for modern businesses",
      "preview_url": "https://api.invoiceflow.app/templates/modern/preview.png",
      "features": ["logo_support", "color_customization", "payment_links"],
      "pro_only": false
    },
    {
      "id": "classic", 
      "name": "Classic Business",
      "description": "Traditional invoice layout with professional styling",
      "preview_url": "https://api.invoiceflow.app/templates/classic/preview.png", 
      "features": ["letterhead", "terms_section", "tax_breakdown"],
      "pro_only": false
    },
    {
      "id": "branded",
      "name": "Premium Branded",
      "description": "Full branding customization with advanced features",
      "preview_url": "https://api.invoiceflow.app/templates/branded/preview.png",
      "features": ["custom_fonts", "advanced_layouts", "recurring_setup"],
      "pro_only": true
    }
  ]
}`}
                    </code>
                  </pre>
                </div>

                {/* Additional Endpoints (Preview) */}
                <div className="bg-[#0A0F1E] rounded-lg p-6 border border-[#374151]">
                  <h3 className="text-white font-medium mb-4">Additional Planned Endpoints</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-[#111827] rounded border border-[#374151]">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#0EA5E9] text-white px-2 py-1 rounded text-xs font-mono">GET</span>
                        <code className="text-[#9CA3AF] font-mono text-sm">/api/invoices</code>
                      </div>
                      <span className="text-[#9CA3AF] text-sm">List all invoices with filtering</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#111827] rounded border border-[#374151]">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#0EA5E9] text-white px-2 py-1 rounded text-xs font-mono">GET</span>
                        <code className="text-[#9CA3AF] font-mono text-sm">/api/invoices/{'{id}'}</code>
                      </div>
                      <span className="text-[#9CA3AF] text-sm">Retrieve specific invoice details</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#111827] rounded border border-[#374151]">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#F59E0B] text-white px-2 py-1 rounded text-xs font-mono">PUT</span>
                        <code className="text-[#9CA3AF] font-mono text-sm">/api/invoices/{'{id}'}</code>
                      </div>
                      <span className="text-[#9CA3AF] text-sm">Update invoice details and status</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#111827] rounded border border-[#374151]">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#10B981] text-white px-2 py-1 rounded text-xs font-mono">POST</span>
                        <code className="text-[#9CA3AF] font-mono text-sm">/api/clients</code>
                      </div>
                      <span className="text-[#9CA3AF] text-sm">Create and manage client records</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#111827] rounded border border-[#374151]">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#10B981] text-white px-2 py-1 rounded text-xs font-mono">POST</span>
                        <code className="text-[#9CA3AF] font-mono text-sm">/api/recurring</code>
                      </div>
                      <span className="text-[#9CA3AF] text-sm">Set up recurring invoice automation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Handling */}
            <div className="bg-[#111827] rounded-xl border border-white/10 p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Error Handling</h2>
              
              <p className="text-[#9CA3AF] mb-6">
                The API uses conventional HTTP response codes to indicate success or failure. 
                Error responses include detailed messages and error codes for programmatic handling.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                  <h3 className="text-white font-medium mb-3">HTTP Status Codes</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <code className="text-[#10B981]">200</code>
                      <span className="text-[#9CA3AF]">Success</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-[#F59E0B]">400</code>
                      <span className="text-[#9CA3AF]">Bad Request</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-[#EF4444]">401</code>
                      <span className="text-[#9CA3AF]">Unauthorized</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-[#EF4444]">429</code>
                      <span className="text-[#9CA3AF]">Rate Limited</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-[#EF4444]">500</code>
                      <span className="text-[#9CA3AF]">Server Error</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                  <h3 className="text-white font-medium mb-3">Error Response Format</h3>
                  <pre className="bg-[#111827] rounded p-3 text-xs overflow-x-auto">
                    <code className="text-[#9CA3AF]">
{`{
  "error": {
    "code": "validation_error",
    "message": "Invalid invoice data",
    "details": {
      "field": "due_date",
      "issue": "Date must be in future"
    },
    "request_id": "req_abc123"
  }
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Webhooks */}
            <div className="bg-[#111827] rounded-xl border border-white/10 p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Webhooks (Planned)</h2>
              
              <p className="text-[#9CA3AF] mb-6">
                Receive real-time notifications about invoice events, payment status changes, 
                and client interactions through secure webhook endpoints.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                  <h3 className="text-white font-medium mb-2">Supported Events</h3>
                  <ul className="text-[#9CA3AF] text-sm space-y-1">
                    <li>• <code>invoice.created</code></li>
                    <li>• <code>invoice.sent</code></li>
                    <li>• <code>payment.received</code></li>
                    <li>• <code>invoice.overdue</code></li>
                  </ul>
                </div>
                <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                  <h3 className="text-white font-medium mb-2">Security</h3>
                  <ul className="text-[#9CA3AF] text-sm space-y-1">
                    <li>• HMAC-SHA256 signatures</li>
                    <li>• Retry logic with backoff</li>
                    <li>• Event deduplication</li>
                    <li>• IP allowlist support</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SDK and Libraries */}
            <div className="bg-[#111827] rounded-xl border border-white/10 p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">SDKs & Libraries (Planned)</h2>
              
              <p className="text-[#9CA3AF] mb-6">
                Official SDKs and community libraries will be available for popular programming languages and frameworks.
              </p>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151] text-center">
                  <h3 className="text-white font-medium mb-2">JavaScript/Node.js</h3>
                  <p className="text-[#9CA3AF] text-sm">npm install @invoiceflow/sdk</p>
                </div>
                <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151] text-center">
                  <h3 className="text-white font-medium mb-2">Python</h3>
                  <p className="text-[#9CA3AF] text-sm">pip install invoiceflow</p>
                </div>
                <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151] text-center">
                  <h3 className="text-white font-medium mb-2">PHP</h3>
                  <p className="text-[#9CA3AF] text-sm">composer require invoiceflow/php</p>
                </div>
              </div>
            </div>

            {/* Early Access */}
            <div className="bg-gradient-to-r from-[#10B981]/10 to-[#0EA5E9]/10 rounded-lg p-8 border border-[#10B981]/20">
              <h2 className="text-2xl font-semibold text-white mb-4">Get Early Access</h2>
              <p className="text-[#9CA3AF] mb-6">
                Join our developer waitlist to get early access to the InvoiceFlow API, beta testing opportunities, 
                and priority support during the initial rollout phase.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <a 
                  href="mailto:api@invoiceflow.app?subject=API Early Access Request"
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#10B981] px-6 py-3 font-medium text-white transition-all hover:bg-[#059669] hover:shadow-lg hover:shadow-[#10B981]/25"
                >
                  <Mail size={20} />
                  Join API Waitlist
                </a>
                <a 
                  href="/create"
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#374151] px-6 py-3 font-medium text-white transition-all hover:bg-[#111827]"
                >
                  <ExternalLink size={20} />
                  Try InvoiceFlow Now
                </a>
              </div>

              <div className="grid gap-4 md:grid-cols-3 text-sm">
                <div className="text-center">
                  <div className="text-white font-medium mb-1">Beta Access</div>
                  <div className="text-[#9CA3AF]">Test endpoints before public release</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-medium mb-1">Priority Support</div>
                  <div className="text-[#9CA3AF]">Direct line to our development team</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-medium mb-1">No Setup Fees</div>
                  <div className="text-[#9CA3AF]">Free API access during beta period</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}