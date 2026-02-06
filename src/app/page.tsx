import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="text-2xl font-bold text-slate-900">
          Invoice<span className="text-blue-600">Flow</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/create" className="text-slate-600 hover:text-slate-900">
            Create Invoice
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
            Create professional invoices in{" "}
            <span className="text-blue-600">60 seconds</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            No signup required. No bloated software. Just fast, beautiful
            invoices that help you get paid.
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
              💎
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              Professional Design
            </h3>
            <p className="mt-2 text-slate-600">
              Clean, modern templates that make you look professional. Impress
              your clients.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
              🔌
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              API for Developers
            </h3>
            <p className="mt-2 text-slate-600">
              Generate invoices programmatically. Perfect for SaaS, marketplaces,
              and automation.
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
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 3 invoices/month
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> PDF download
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> All templates
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
                MOST POPULAR
              </div>
              <h3 className="text-lg font-semibold">Pro</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">$12</span>
                <span className="text-blue-200">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-blue-100">
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span> Unlimited invoices
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span> Client management
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span> Invoice tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span> Custom branding
                </li>
              </ul>
              <button className="mt-8 block w-full text-center py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition">
                Start Free Trial
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
