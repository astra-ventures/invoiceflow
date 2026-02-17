import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";
import { FileText, Palette, Briefcase, Hammer, ArrowRight, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Invoice Templates | InvoiceFlow - Professional Invoice Designs",
  description: "Choose from beautiful, professional invoice templates designed for different business types. Minimal, professional, creative, and contractor-focused designs.",
};

export default function TemplatesPage() {
  const templates = [
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean, simple design focused on clarity and professionalism",
      icon: FileText,
      color: "#6366F1",
      features: ["Clean typography", "Essential information only", "Fast to complete"],
      mockup: {
        header: "INVOICE #001",
        from: "Your Business Name",
        to: "Client Company",
        items: [
          { desc: "Web Development", qty: "40 hrs", rate: "$125", amount: "$5,000" },
          { desc: "Project Management", qty: "10 hrs", rate: "$100", amount: "$1,000" }
        ],
        total: "$6,000"
      }
    },
    {
      id: "professional", 
      name: "Professional",
      description: "Polished business design with comprehensive details and branding",
      icon: Briefcase,
      color: "#0EA5E9",
      features: ["Company branding", "Detailed breakdowns", "Professional layout"],
      mockup: {
        header: "INVOICE",
        number: "#INV-2026-001",
        from: "Your Company Inc.",
        to: "Client Corporation",
        items: [
          { desc: "Consulting Services", qty: "20", rate: "$150", amount: "$3,000" },
          { desc: "Strategy Planning", qty: "15", rate: "$175", amount: "$2,625" }
        ],
        subtotal: "$5,625",
        tax: "$450",
        total: "$6,075"
      }
    },
    {
      id: "creative",
      name: "Creative", 
      description: "Modern, visually striking design for creative professionals",
      icon: Palette,
      color: "#10B981",
      features: ["Creative styling", "Visual emphasis", "Perfect for agencies"],
      mockup: {
        header: "CREATIVE INVOICE",
        from: "Design Studio",
        to: "Brand Client", 
        items: [
          { desc: "Logo Design Package", qty: "1", rate: "$2,500", amount: "$2,500" },
          { desc: "Brand Guidelines", qty: "1", rate: "$1,500", amount: "$1,500" }
        ],
        total: "$4,000"
      }
    },
    {
      id: "contractor",
      name: "Contractor",
      description: "Detailed format perfect for construction and trade professionals", 
      icon: Hammer,
      color: "#F59E0B",
      features: ["Itemized materials", "Labor breakdown", "Trade-specific fields"],
      mockup: {
        header: "CONTRACTOR INVOICE",
        from: "ABC Construction LLC", 
        to: "Property Owner",
        items: [
          { desc: "Flooring Installation", qty: "500 sqft", rate: "$8", amount: "$4,000" },
          { desc: "Materials & Supplies", qty: "1", rate: "$1,200", amount: "$1,200" }
        ],
        total: "$5,200"
      }
    }
  ];

  return (
    <main className="min-h-screen bg-[#0A0F1E]">
      <Navbar />
      
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6366F1]/10 rounded-xl mb-6">
              <FileText className="w-8 h-8 text-[#6366F1]" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Professional Invoice Templates
            </h1>
            <p className="text-xl text-[#9CA3AF] max-w-3xl mx-auto">
              Choose from beautifully designed templates crafted for different business types and industries. 
              Each template is professionally designed and instantly ready to use.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {templates.map((template) => {
              const IconComponent = template.icon;
              return (
                <div key={template.id} className="bg-[#111827] rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all">
                  {/* Template Header */}
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${template.color}20` }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: template.color }} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{template.name}</h3>
                          <p className="text-sm text-[#9CA3AF]">{template.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {template.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-[#0A0F1E] rounded text-xs text-[#9CA3AF]"
                        >
                          <CheckCircle className="w-3 h-3 text-[#10B981]" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Template Mockup */}
                  <div className="p-6 bg-white text-black">
                    <div className="border border-gray-200 rounded-lg p-4 text-sm">
                      {/* Invoice Header */}
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="text-lg font-bold mb-1" style={{ color: template.color }}>
                            {template.mockup.header}
                          </h4>
                          {template.mockup.number && (
                            <p className="text-gray-600 text-sm">{template.mockup.number}</p>
                          )}
                        </div>
                        <div className="text-right text-xs text-gray-600">
                          <p>Date: Feb 16, 2026</p>
                          <p>Due: Mar 16, 2026</p>
                        </div>
                      </div>

                      {/* From/To */}
                      <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                        <div>
                          <p className="font-medium text-gray-800 mb-1">From:</p>
                          <p className="text-gray-600">{template.mockup.from}</p>
                          <p className="text-gray-600">123 Business St</p>
                          <p className="text-gray-600">City, ST 12345</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 mb-1">To:</p>
                          <p className="text-gray-600">{template.mockup.to}</p>
                          <p className="text-gray-600">456 Client Ave</p>
                          <p className="text-gray-600">City, ST 67890</p>
                        </div>
                      </div>

                      {/* Line Items */}
                      <div className="mb-6">
                        <div className="border-b border-gray-200 pb-2 mb-2">
                          <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-800">
                            <div>Description</div>
                            <div className="text-center">Qty</div>
                            <div className="text-center">Rate</div>
                            <div className="text-right">Amount</div>
                          </div>
                        </div>
                        {template.mockup.items.map((item, index) => (
                          <div key={index} className="grid grid-cols-4 gap-2 text-xs text-gray-600 py-1">
                            <div>{item.desc}</div>
                            <div className="text-center">{item.qty}</div>
                            <div className="text-center">{item.rate}</div>
                            <div className="text-right">{item.amount}</div>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="border-t border-gray-200 pt-2">
                        <div className="text-right text-xs">
                          {template.mockup.subtotal && (
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="text-gray-600">{template.mockup.subtotal}</span>
                            </div>
                          )}
                          {template.mockup.tax && (
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-gray-600">Tax:</span>
                              <span className="text-gray-600">{template.mockup.tax}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center font-bold text-sm">
                            <span style={{ color: template.color }}>Total:</span>
                            <span style={{ color: template.color }}>{template.mockup.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-6 bg-[#111827] border-t border-white/10">
                    <Link
                      href={`/create?template=${template.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white transition-all hover:shadow-lg"
                      style={{ 
                        backgroundColor: template.color,
                        boxShadow: `0 0 0 0 ${template.color}50`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 10px 25px -3px ${template.color}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0 0 ${template.color}50`;
                      }}
                    >
                      Use {template.name} Template
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 rounded-lg p-8 border border-[#6366F1]/20">
              <h2 className="text-2xl font-bold text-white mb-4">Can't decide? Start with Minimal</h2>
              <p className="text-[#9CA3AF] mb-6 max-w-2xl mx-auto">
                Our most popular template works great for any business type. Clean, professional, 
                and quick to fill out. You can always switch templates later.
              </p>
              <Link
                href="/create?template=minimal"
                className="inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-6 py-3 font-medium text-white transition-all hover:bg-[#818CF8] hover:shadow-lg hover:shadow-[#6366F1]/25"
              >
                Start with Minimal Template
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}