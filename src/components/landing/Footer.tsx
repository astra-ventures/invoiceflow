"use client";
import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const existing = JSON.parse(localStorage.getItem("invoiceflow_newsletter") || "[]");
      existing.push({ email, date: new Date().toISOString() });
      localStorage.setItem("invoiceflow_newsletter", JSON.stringify(existing));
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-white/5 bg-[#0A0F1E] pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand + Newsletter */}
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold text-white">
              Invoice<span className="text-[#6366F1]">Flow</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-[#6B7280] leading-relaxed">
              Free invoice generator for freelancers and small businesses.
              Create professional invoices in 60 seconds — no signup required.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-medium text-[#9CA3AF] mb-3">
                Get invoicing tips & product updates
              </p>
              {subscribed ? (
                <p className="text-sm text-[#10B981]">
                  ✓ Subscribed! Check your inbox.
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="flex-1 rounded-lg bg-[#111827] border border-white/10 px-3 py-2 text-sm text-white placeholder-[#6B7280] outline-none focus:border-[#6366F1]"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-[#6366F1] px-4 py-2 text-sm font-medium text-white hover:bg-[#818CF8] transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-[#6B7280]">
              <li>
                <Link href="/create" className="hover:text-[#9CA3AF] transition-colors">
                  Create Invoice
                </Link>
              </li>
              <li>
                <Link href="/time" className="hover:text-[#9CA3AF] transition-colors">
                  Time Tracking
                </Link>
              </li>
              <li>
                <Link href="/clients" className="hover:text-[#9CA3AF] transition-colors">
                  Client Management
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-[#9CA3AF] transition-colors">
                  Invoice History
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-[#9CA3AF] transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-[#6B7280]">
              <li>
                <Link href="/privacy" className="hover:text-[#9CA3AF] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#9CA3AF] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="hover:text-[#9CA3AF] transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <a href="https://astra.ventures" target="_blank" rel="noopener noreferrer" className="hover:text-[#9CA3AF] transition-colors">
                  Astra Ventures ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <span className="text-sm text-[#6B7280]">
            © {new Date().getFullYear()} Astra Ventures. All rights reserved.
          </span>
          <div className="flex items-center gap-4 text-sm text-[#6B7280]">
            <a href="https://x.com/iamIrisAI" target="_blank" rel="noopener noreferrer" className="hover:text-[#9CA3AF] transition-colors">
              𝕏 Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
