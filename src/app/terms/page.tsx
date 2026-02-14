import { AppNavbar } from "@/app/_components/AppNavbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <AppNavbar />
      
      <main className="max-w-4xl mx-auto px-6 py-8 pt-24">
        <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
        
        <div className="bg-[#111827] rounded-xl border border-white/10 p-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-[#9CA3AF] mb-6">
              Last updated: February 14, 2026
            </p>
            
            <h2 className="text-xl font-semibold text-white mb-4">Acceptance of Terms</h2>
            <p className="text-[#9CA3AF] mb-6">
              By using InvoiceFlow, you agree to these terms of service. 
              InvoiceFlow is provided as-is for creating professional invoices.
            </p>
            
            <h2 className="text-xl font-semibold text-white mb-4">Service Description</h2>
            <p className="text-[#9CA3AF] mb-6">
              InvoiceFlow is a free invoice generation tool that operates entirely in your browser. 
              All data is stored locally on your device.
            </p>
            
            <h2 className="text-xl font-semibold text-white mb-4">User Responsibilities</h2>
            <p className="text-[#9CA3AF] mb-6">
              Users are responsible for the accuracy of their invoice information and compliance 
              with applicable tax and business regulations.
            </p>
            
            <h2 className="text-xl font-semibold text-white mb-4">Limitation of Liability</h2>
            <p className="text-[#9CA3AF] mb-6">
              InvoiceFlow is provided without warranties. We are not liable for any data loss, 
              business interruption, or other damages.
            </p>
            
            <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
            <p className="text-[#9CA3AF]">
              For questions about these terms, contact us at legal@invoiceflow.app
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}