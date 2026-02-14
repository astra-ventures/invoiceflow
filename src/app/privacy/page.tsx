import { AppNavbar } from "@/app/_components/AppNavbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <AppNavbar />
      
      <main className="max-w-4xl mx-auto px-6 py-8 pt-24">
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="bg-[#111827] rounded-xl border border-white/10 p-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-[#9CA3AF] mb-6">
              Last updated: February 14, 2026
            </p>
            
            <h2 className="text-xl font-semibold text-white mb-4">Data Collection</h2>
            <p className="text-[#9CA3AF] mb-6">
              InvoiceFlow operates on a privacy-first principle. All invoice data is stored locally in your browser. 
              We do not collect, store, or transmit your invoice information to our servers.
            </p>
            
            <h2 className="text-xl font-semibold text-white mb-4">Local Storage</h2>
            <p className="text-[#9CA3AF] mb-6">
              Your invoices, clients, and time tracking data are stored locally using browser localStorage. 
              This data remains on your device and is not shared with third parties.
            </p>
            
            <h2 className="text-xl font-semibold text-white mb-4">Analytics</h2>
            <p className="text-[#9CA3AF] mb-6">
              We may use privacy-focused analytics to understand usage patterns, but no personal 
              information or invoice data is collected.
            </p>
            
            <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
            <p className="text-[#9CA3AF]">
              For privacy questions, contact us at privacy@invoiceflow.app
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}