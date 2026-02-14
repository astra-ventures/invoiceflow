import { AppNavbar } from "@/app/_components/AppNavbar";

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <AppNavbar />
      
      <main className="max-w-4xl mx-auto px-6 py-8 pt-24">
        <h1 className="text-3xl font-bold text-white mb-8">API Documentation</h1>
        
        <div className="bg-[#111827] rounded-xl border border-white/10 p-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-[#9CA3AF] mb-6">
              InvoiceFlow is designed as a client-side application for privacy and simplicity.
            </p>
            
            <h2 className="text-xl font-semibold text-white mb-4">Architecture</h2>
            <p className="text-[#9CA3AF] mb-6">
              InvoiceFlow operates entirely in your browser using localStorage for data persistence. 
              This ensures your invoice data never leaves your device.
            </p>
            
            <h2 className="text-xl font-semibold text-white mb-4">Data Export</h2>
            <p className="text-[#9CA3AF] mb-6">
              All invoices are exported as PDF files. You can also access your data through 
              browser developer tools via localStorage.
            </p>
            
            <h2 className="text-xl font-semibold text-white mb-4">Integration</h2>
            <p className="text-[#9CA3AF] mb-6">
              For business integrations, consider our Pro tier which offers advanced features 
              including Stripe payment links and recurring invoice automation.
            </p>
            
            <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
            <p className="text-[#9CA3AF]">
              For technical questions or enterprise integrations, contact us at api@invoiceflow.app
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}