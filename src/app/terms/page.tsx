import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FileText, Scale, AlertCircle, CheckCircle, Mail, Shield } from "lucide-react";

export const metadata = {
  title: "Terms of Service | InvoiceFlow - Usage Terms & Conditions",
  description: "Review InvoiceFlow's terms of service covering acceptable use, service availability, user responsibilities, and legal agreements for professional invoice generation.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E]">
      <Navbar />
      
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6366F1]/10 rounded-xl mb-6">
              <Scale className="w-8 h-8 text-[#6366F1]" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto">
              These terms govern your use of InvoiceFlow and outline the rights and responsibilities of both users and our service.
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
              
              {/* Acceptance */}
              <div className="border-l-4 border-[#6366F1] pl-6 bg-[#6366F1]/5 py-4 rounded-r">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[#6366F1]" />
                  Acceptance of Terms
                </h2>
                <p className="text-[#9CA3AF] leading-relaxed">
                  By accessing or using InvoiceFlow ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                  If you do not agree to these terms, please do not use our service. These terms apply to all users, 
                  including those using both free and Pro tier features.
                </p>
              </div>
              
              {/* Service Description */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[#6366F1]" />
                  Service Description
                </h2>
                <p className="text-[#9CA3AF] mb-4 leading-relaxed">
                  InvoiceFlow is a web-based invoice generation platform that enables users to create professional invoices, 
                  track time, manage clients, and process payments. The service operates primarily in your browser with 
                  local data storage for privacy and security.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-lg font-medium text-white mb-2">Free Tier Features</h3>
                    <ul className="text-[#9CA3AF] space-y-1 text-sm">
                      <li>• Unlimited invoice creation</li>
                      <li>• Professional templates</li>
                      <li>• Client management</li>
                      <li>• Time tracking</li>
                      <li>• PDF export</li>
                      <li>• Local data storage</li>
                    </ul>
                  </div>
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-lg font-medium text-white mb-2">Pro Tier Features</h3>
                    <ul className="text-[#9CA3AF] space-y-1 text-sm">
                      <li>• Stripe payment links</li>
                      <li>• Recurring invoice automation</li>
                      <li>• Advanced branding options</li>
                      <li>• Priority support</li>
                      <li>• Enhanced analytics</li>
                      <li>• API access (future)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* User Responsibilities */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">User Responsibilities</h2>
                <p className="text-[#9CA3AF] mb-4 leading-relaxed">
                  As a user of InvoiceFlow, you are responsible for:
                </p>
                <div className="space-y-4">
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">📊 Accurate Information</h3>
                    <p className="text-[#9CA3AF] text-sm">Ensuring all invoice information, including amounts, dates, client details, and business information is accurate and up-to-date</p>
                  </div>
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">⚖️ Legal Compliance</h3>
                    <p className="text-[#9CA3AF] text-sm">Complying with all applicable laws, regulations, and tax requirements in your jurisdiction, including proper tax calculations and reporting</p>
                  </div>
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">🔐 Account Security</h3>
                    <p className="text-[#9CA3AF] text-sm">Maintaining the security of your browser session and protecting access to your local invoice data</p>
                  </div>
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">✅ Appropriate Use</h3>
                    <p className="text-[#9CA3AF] text-sm">Using InvoiceFlow only for legitimate business purposes and not for fraudulent, illegal, or harmful activities</p>
                  </div>
                </div>
              </div>

              {/* Acceptable Use */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-[#6366F1]" />
                  Acceptable Use Policy
                </h2>
                <p className="text-[#9CA3AF] mb-4 leading-relaxed">
                  You agree not to use InvoiceFlow for any of the following prohibited activities:
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-start gap-3 p-3 bg-red-900/10 border border-red-800 rounded">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-400 font-medium text-sm">Fraudulent Activity</p>
                      <p className="text-red-300 text-xs">Creating false invoices or engaging in fraudulent billing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-900/10 border border-red-800 rounded">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-400 font-medium text-sm">Illegal Content</p>
                      <p className="text-red-300 text-xs">Including illegal goods, services, or content in invoices</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-900/10 border border-red-800 rounded">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-400 font-medium text-sm">System Abuse</p>
                      <p className="text-red-300 text-xs">Attempting to hack, disrupt, or overload our systems</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-900/10 border border-red-800 rounded">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-400 font-medium text-sm">Spam or Abuse</p>
                      <p className="text-red-300 text-xs">Sending unsolicited invoices or harassing communications</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Tier Terms */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Pro Tier Subscription</h2>
                <p className="text-[#9CA3AF] mb-4 leading-relaxed">
                  InvoiceFlow Pro is a paid subscription service with the following terms:
                </p>
                <div className="space-y-3">
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">💳 Billing</h3>
                    <p className="text-[#9CA3AF] text-sm">Pro subscriptions are billed monthly through Stripe. You authorize automatic renewal unless cancelled before the next billing cycle.</p>
                  </div>
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">🔄 Cancellation</h3>
                    <p className="text-[#9CA3AF] text-sm">You may cancel your Pro subscription at any time. Cancellation takes effect at the end of your current billing period.</p>
                  </div>
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">💰 Refunds</h3>
                    <p className="text-[#9CA3AF] text-sm">No refunds are provided for partial months. All charges are final except where required by law.</p>
                  </div>
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">🎯 Feature Access</h3>
                    <p className="text-[#9CA3AF] text-sm">Pro features are available only during active subscription periods. Features may be modified with reasonable notice.</p>
                  </div>
                </div>
              </div>

              {/* Service Availability */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Service Availability</h2>
                <p className="text-[#9CA3AF] mb-4 leading-relaxed">
                  We strive to provide reliable service but cannot guarantee 100% uptime:
                </p>
                <ul className="text-[#9CA3AF] space-y-2 ml-6">
                  <li>• Planned maintenance may temporarily interrupt service with advance notice</li>
                  <li>• Emergency maintenance may occur without prior notification</li>
                  <li>• Third-party service dependencies (Stripe, hosting) may affect availability</li>
                  <li>• Your local data remains accessible even during service outages</li>
                </ul>
              </div>

              {/* Intellectual Property */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Intellectual Property</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">InvoiceFlow Rights</h3>
                    <ul className="text-[#9CA3AF] text-sm space-y-1">
                      <li>• All software, designs, and branding</li>
                      <li>• Service infrastructure and code</li>
                      <li>• Templates and formatting</li>
                      <li>• InvoiceFlow name and logo</li>
                    </ul>
                  </div>
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">Your Rights</h3>
                    <ul className="text-[#9CA3AF] text-sm space-y-1">
                      <li>• Full ownership of your invoice content</li>
                      <li>• Your business information and data</li>
                      <li>• Client relationships and communications</li>
                      <li>• Right to export and use your data</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
                <div className="bg-amber-900/10 border border-amber-700 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-amber-400 font-medium mb-2">Important Legal Notice</h3>
                      <p className="text-[#9CA3AF] text-sm leading-relaxed">
                        InvoiceFlow is provided "as-is" without warranties of any kind. To the maximum extent permitted by law, 
                        Astra Ventures (InvoiceFlow's developer) shall not be liable for:
                      </p>
                    </div>
                  </div>
                  <ul className="text-[#9CA3AF] text-sm space-y-1 ml-9">
                    <li>• Data loss or corruption (though we use local storage for your protection)</li>
                    <li>• Business interruption or lost revenue</li>
                    <li>• Errors in calculations or invoice formatting</li>
                    <li>• Third-party service failures (Stripe, hosting providers)</li>
                    <li>• Compliance with tax laws or regulations</li>
                    <li>• Disputes with clients or payment issues</li>
                  </ul>
                  <p className="text-[#9CA3AF] text-sm mt-4 font-medium">
                    Your total liability is limited to the amount paid for Pro subscription in the 12 months preceding any claim.
                  </p>
                </div>
              </div>

              {/* Termination */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Termination</h2>
                <p className="text-[#9CA3AF] mb-4 leading-relaxed">
                  Either party may terminate this agreement:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">You May Terminate</h3>
                    <ul className="text-[#9CA3AF] text-sm space-y-1">
                      <li>• At any time by discontinuing use</li>
                      <li>• Cancel Pro subscription anytime</li>
                      <li>• Delete local data to remove all traces</li>
                    </ul>
                  </div>
                  <div className="bg-[#0A0F1E] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-white font-medium mb-2">We May Terminate</h3>
                    <ul className="text-[#9CA3AF] text-sm space-y-1">
                      <li>• For violations of these terms</li>
                      <li>• For abusive or fraudulent behavior</li>
                      <li>• With 30 days notice for any reason</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Changes to Terms */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Changes to These Terms</h2>
                <p className="text-[#9CA3AF] leading-relaxed">
                  We may update these terms periodically to reflect changes in our services, legal requirements, or business practices. 
                  Significant changes will be announced through our website or service notifications. Continued use of InvoiceFlow 
                  after changes constitutes acceptance of the updated terms.
                </p>
              </div>

              {/* Governing Law */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Governing Law</h2>
                <p className="text-[#9CA3AF] leading-relaxed">
                  These terms are governed by the laws of the jurisdiction where Astra Ventures operates, without regard to conflict of law provisions. 
                  Any disputes shall be resolved through binding arbitration or in courts of competent jurisdiction.
                </p>
              </div>

              {/* Contact */}
              <div className="border-t border-[#374151] pt-8">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-[#6366F1]" />
                  Questions & Contact
                </h2>
                <div className="bg-[#0A0F1E] rounded-lg p-6 border border-[#374151]">
                  <p className="text-[#9CA3AF] mb-4">
                    <strong>InvoiceFlow</strong> is developed and operated by <strong>Astra Ventures</strong>
                  </p>
                  <p className="text-[#9CA3AF] mb-4">
                    For questions about these terms, service issues, or legal concerns:
                  </p>
                  <div className="space-y-2">
                    <p className="text-[#6366F1]">📧 legal@invoiceflow.app</p>
                    <p className="text-[#9CA3AF] text-sm">Business inquiries and support: support@invoiceflow.app</p>
                    <p className="text-[#9CA3AF] text-sm">We aim to respond within 2-3 business days</p>
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