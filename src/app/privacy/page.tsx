import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Shield, Lock, Eye, Database, Globe, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | InvoiceFlow - Your Data Stays Private",
  description: "Learn how InvoiceFlow protects your privacy with local-first data storage, no tracking, and transparent privacy practices for professional invoice generation.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E]">
      <Navbar />
      
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6366F1]/10 rounded-xl mb-6">
              <Shield className="w-8 h-8 text-[#6366F1]" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto">
              Your privacy is fundamental to how we built InvoiceFlow. Learn about our commitment to keeping your data secure and private.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="bg-[#111827] rounded-xl border border-white/10 p-8 mb-8">
            <p className="text-[#9CA3AF] mb-8 text-center">
              <strong>Last updated:</strong> February 16, 2026 • <strong>Effective:</strong> February 16, 2026
            </p>
            
            <div className="prose prose-invert max-w-none space-y-8">
              
              {/* Privacy-First Approach */}
              <div className="border-l-4 border-[#6366F1] pl-6 bg-[#6366F1]/5 py-4 rounded-r">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-[#6366F1]" />
                  Privacy-First Design
                </h2>
                <p className="text-[#9CA3AF] leading-relaxed">
                  InvoiceFlow is built with privacy as a core principle. <strong>Your invoice data never leaves your device</strong> unless you explicitly choose to share it. We use local browser storage to ensure your business information remains completely private and under your control.
                </p>
              </div>
              
              {/* Data Collection */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                  <Database className="w-6 h-6 text-[#6366F1]" />
                  What Data We Collect
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-lg font-medium text-white mb-2">❌ We DON'T Collect</h3>
                    <ul className="text-[#9CA3AF] space-y-1 text-sm">
                      <li>• Invoice content or data</li>
                      <li>• Client information</li>
                      <li>• Business details</li>
                      <li>• Time tracking data</li>
                      <li>• Payment information</li>
                    </ul>
                  </div>
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-lg font-medium text-white mb-2">✅ We MAY Collect</h3>
                    <ul className="text-[#9CA3AF] space-y-1 text-sm">
                      <li>• Anonymous usage analytics</li>
                      <li>• Feature usage patterns</li>
                      <li>• Error reports (no personal data)</li>
                      <li>• Page views and performance metrics</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Local Storage */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-[#6366F1]" />
                  Local Data Storage
                </h2>
                <p className="text-[#9CA3AF] mb-4 leading-relaxed">
                  All your invoice data, client information, time tracking, and settings are stored locally in your browser using secure localStorage technology. This means:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-[#10B981] font-medium">✓ Complete Privacy</p>
                    <p className="text-[#9CA3AF] text-sm">Data never transmitted to our servers</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#10B981] font-medium">✓ You Control Your Data</p>
                    <p className="text-[#9CA3AF] text-sm">Export or delete anytime</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#10B981] font-medium">✓ Works Offline</p>
                    <p className="text-[#9CA3AF] text-sm">No internet required for core features</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#10B981] font-medium">✓ Device Specific</p>
                    <p className="text-[#9CA3AF] text-sm">Data tied to your browser only</p>
                  </div>
                </div>
              </div>

              {/* Pro Tier and Stripe */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Pro Tier & Payment Processing</h2>
                <p className="text-[#9CA3AF] mb-4 leading-relaxed">
                  InvoiceFlow Pro users who enable payment links and billing features interact with Stripe, our payment processor:
                </p>
                <ul className="text-[#9CA3AF] space-y-2 ml-6">
                  <li>• Stripe handles all payment processing and credit card data</li>
                  <li>• We never store or access your financial information</li>
                  <li>• Stripe's privacy policy governs payment data: <a href="https://stripe.com/privacy" className="text-[#6366F1] hover:underline">stripe.com/privacy</a></li>
                  <li>• Recurring invoices use Stripe's secure billing infrastructure</li>
                </ul>
              </div>

              {/* Analytics */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-[#6366F1]" />
                  Website Analytics
                </h2>
                <p className="text-[#9CA3AF] mb-4 leading-relaxed">
                  We use privacy-focused analytics to improve InvoiceFlow without compromising your privacy:
                </p>
                <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                  <p className="text-[#9CA3AF] text-sm mb-3"><strong>Vercel Analytics</strong> (privacy-first web analytics):</p>
                  <ul className="text-[#9CA3AF] space-y-1 text-sm ml-4">
                    <li>• No cookies or personal identifiers</li>
                    <li>• Aggregate usage patterns only</li>
                    <li>• GDPR and CCPA compliant</li>
                    <li>• No tracking across websites</li>
                  </ul>
                </div>
              </div>

              {/* Third-Party Services */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
                <p className="text-[#9CA3AF] mb-4 leading-relaxed">
                  InvoiceFlow integrates with minimal third-party services to enhance functionality:
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-[#0A0F1E] rounded border border-[#374151]">
                    <span className="text-white font-medium">Stripe</span>
                    <span className="text-[#9CA3AF] text-sm">Payment processing (Pro tier only)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#0A0F1E] rounded border border-[#374151]">
                    <span className="text-white font-medium">Vercel</span>
                    <span className="text-[#9CA3AF] text-sm">Hosting and privacy-first analytics</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#0A0F1E] rounded border border-[#374151]">
                    <span className="text-white font-medium">Google Fonts</span>
                    <span className="text-[#9CA3AF] text-sm">Typography (self-hosted for privacy)</span>
                  </div>
                </div>
              </div>

              {/* Your Rights */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Your Privacy Rights</h2>
                <p className="text-[#9CA3AF] mb-4 leading-relaxed">
                  Since your data is stored locally, you have complete control:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">Data Export</h3>
                    <p className="text-[#9CA3AF] text-sm">Download all your invoices as PDFs or export data through browser tools</p>
                  </div>
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">Data Deletion</h3>
                    <p className="text-[#9CA3AF] text-sm">Clear browser data or use InvoiceFlow's reset option to delete everything</p>
                  </div>
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">Data Portability</h3>
                    <p className="text-[#9CA3AF] text-sm">Your data is never locked in—export and move to any system anytime</p>
                  </div>
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">Access Control</h3>
                    <p className="text-[#9CA3AF] text-sm">Only you can access your data through your browser session</p>
                  </div>
                </div>
              </div>

              {/* Updates to Policy */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Policy Updates</h2>
                <p className="text-[#9CA3AF] leading-relaxed">
                  We may update this privacy policy to reflect changes in our practices or legal requirements. 
                  Significant changes will be announced on our website. Continued use of InvoiceFlow after changes 
                  indicates acceptance of the updated policy.
                </p>
              </div>

              {/* Contact */}
              <div className="border-t border-[#374151] pt-8">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-[#6366F1]" />
                  Contact & Questions
                </h2>
                <div className="bg-[#0A0F1E] rounded-lg p-6 border border-[#374151]">
                  <p className="text-[#9CA3AF] mb-4">
                    <strong>InvoiceFlow</strong> is developed by <strong>Astra Ventures</strong>
                  </p>
                  <p className="text-[#9CA3AF] mb-4">
                    For privacy questions, data requests, or concerns about this policy:
                  </p>
                  <div className="space-y-2">
                    <p className="text-[#6366F1]">📧 privacy@invoiceflow.app</p>
                    <p className="text-[#9CA3AF] text-sm">We typically respond within 48 hours</p>
                  </div>
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