import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="text-2xl font-bold text-slate-900">
          Invoice<span className="text-blue-600">Flow</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/create" className="text-slate-600 hover:text-slate-900">
            Create
          </Link>
          <Link href="/history" className="text-slate-600 hover:text-slate-900">
            History
          </Link>
          <Link href="/time" className="text-slate-600 hover:text-slate-900">
            Time Tracking
          </Link>
          <Link href="/recurring" className="text-slate-600 hover:text-slate-900">
            Recurring
          </Link>
          <Link href="/analytics" className="text-slate-600 hover:text-slate-900">
            Analytics
          </Link>
          <a
            href="https://rapidapi.com/astra-ventures/api/invoice-generator"
            target="_blank"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            API Access
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
            Free Invoice Generator:{" "}
            <span className="text-blue-600">Professional Invoices in 60 Seconds</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            The best free invoice generator for freelancers and small businesses. 
            Create professional invoices online with no signup required. 
            Fast, beautiful, and completely free forever.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/25"
            >
              Create Free Invoice →
            </Link>
            <a
              href="#pricing"
              className="bg-white text-slate-700 px-8 py-4 rounded-xl text-lg font-semibold border border-slate-200 hover:border-slate-300 transition"
            >
              View Pricing
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
              ⚡
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              Lightning Fast
            </h3>
            <p className="mt-2 text-slate-600">
              Create a complete invoice in under a minute. No learning curve, no
              complex menus.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
              💳
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              Stripe Payments
            </h3>
            <p className="mt-2 text-slate-600">
              Add payment links to invoices. Get paid instantly with Stripe — no chasing clients.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
              ⏱️
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              Time Tracking
            </h3>
            <p className="mt-2 text-slate-600">
              Track your hours, convert to invoices instantly. Never miss billable time.
            </p>
          </div>
        </div>

        {/* V2 Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
              🔄
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              Recurring Invoices
            </h3>
            <p className="mt-2 text-slate-600">
              Set up retainers and subscriptions. Auto-generate invoices on schedule.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">
              📊
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              Analytics Dashboard
            </h3>
            <p className="mt-2 text-slate-600">
              Track revenue, payment times, and top clients. Make smarter business decisions.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-2xl">
              💬
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              WhatsApp & SMS
            </h3>
            <p className="mt-2 text-slate-600">
              Send invoices via WhatsApp or SMS. Reach clients where they actually are.
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="mt-32">
          <h2 className="text-3xl font-bold text-center text-slate-900">
            Simple Pricing
          </h2>
          <p className="mt-4 text-center text-slate-600">
            Start free, upgrade when you need more
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Free</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500">/forever</span>
              </div>
              <ul className="mt-6 space-y-3 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Unlimited invoices
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Time tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Analytics dashboard
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> WhatsApp & SMS sharing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Late fee calculator
                </li>
              </ul>
              <Link
                href="/create"
                className="mt-8 block w-full text-center py-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-blue-600 p-8 rounded-2xl text-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                COMING SOON
              </div>
              <h3 className="text-lg font-semibold">Pro</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">$12</span>
                <span className="text-blue-200">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-blue-100">
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span> Everything in Free
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span> Stripe payment links
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span> Recurring invoices
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span> Custom branding
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span> Cloud sync
                </li>
              </ul>
              <button className="mt-8 block w-full text-center py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition">
                Join Waitlist
              </button>
            </div>

            {/* API */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">API</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-slate-900">$9</span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 500 API calls/month
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> JSON → HTML/PDF
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Multi-currency
                </li>
              </ul>
              <a
                href="https://rapidapi.com/astra-ventures/api/invoice-generator"
                target="_blank"
                className="mt-8 block w-full text-center py-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                View on RapidAPI
              </a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Ready to get paid faster?
          </h2>
          <p className="mt-4 text-slate-600">
            Join thousands of freelancers who trust InvoiceFlow
          </p>
          <Link
            href="/create"
            className="mt-8 inline-block bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/25"
          >
            Create Your First Invoice →
          </Link>
        </div>

        {/* FAQ Section for SEO */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600 mt-4">
              Everything you need to know about our free invoice generator
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Is InvoiceFlow really a free invoice generator?
              </h3>
              <p className="text-slate-600">
                Yes! InvoiceFlow is completely free forever. Create unlimited professional invoices, 
                track your time, and access analytics with no hidden fees or signup requirements. 
                Our free invoice generator helps freelancers and small businesses get paid faster.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Do I need to sign up to create invoices?
              </h3>
              <p className="text-slate-600">
                No signup required! Our invoice generator works immediately without creating an account. 
                Just visit our invoice maker, fill in your details, and download your professional invoice in PDF format. 
                It's the fastest way to create invoices online.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                What makes this the best free invoice generator?
              </h3>
              <p className="text-slate-600">
                InvoiceFlow combines speed, professional design, and powerful features. Unlike other invoice software, 
                we focus on getting you from idea to invoice in 60 seconds. Plus, you get time tracking, 
                recurring invoices, and payment links - all free forever.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Can I add payment links to my invoices?
              </h3>
              <p className="text-slate-600">
                Yes! Our invoice generator includes Stripe payment integration. Add secure payment buttons 
                to your invoices so clients can pay instantly with credit cards, bank transfers, or digital wallets. 
                Get paid faster with one-click payments.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                What file formats are supported?
              </h3>
              <p className="text-slate-600">
                Our free invoice generator creates professional PDF invoices that look great on any device. 
                You can also share invoices via WhatsApp, SMS, or email directly from the platform. 
                All invoices are mobile-friendly and print-ready.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Is there an invoice template library?
              </h3>
              <p className="text-slate-600">
                InvoiceFlow uses modern, professional invoice templates that work for any business. 
                Our templates are optimized for freelancers, consultants, and small businesses. 
                No more struggling with Word templates or Excel spreadsheets.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500">
            © 2026 InvoiceFlow. Part of Astra Ventures.
          </div>
          <div className="flex gap-6 text-slate-500">
            <a href="#" className="hover:text-slate-700">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-700">
              Terms
            </a>
            <a href="#" className="hover:text-slate-700">
              API Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
