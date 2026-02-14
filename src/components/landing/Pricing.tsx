"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to create professional invoices.",
    cta: "Start Creating",
    ctaHref: "/create",
    featured: false,
    features: [
      "Unlimited invoices",
      "PDF download",
      "Client management",
      "Time tracking",
      "Revenue analytics",
      "Mobile optimized",
    ],
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For growing businesses that need more power.",
    cta: "Coming Soon",
    ctaHref: "#",
    featured: true,
    features: [
      "Everything in Free",
      "Stripe payment links",
      "Recurring invoices",
      "Custom branding",
      "Email delivery",
      "Priority support",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative bg-[#0A0F1E] py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/20 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[#6366F1]">Pricing</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Start free. Scale when ready.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#9CA3AF]">
            No credit card required. No hidden fees. Just invoices.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-2">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-2xl border p-8 ${
                plan.featured
                  ? "border-[#6366F1]/50 bg-gradient-to-b from-[#6366F1]/10 to-[#111827]"
                  : "border-white/5 bg-[#111827]"
              }`}
            >
              {plan.featured && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6366F1] to-transparent" />
              )}

              <div className="text-sm font-medium text-[#9CA3AF]">{plan.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-[#6B7280]">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-[#9CA3AF]">{plan.description}</p>

              <Link
                href={plan.ctaHref}
                className={`mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                  plan.featured
                    ? "bg-[#6366F1] text-white hover:bg-[#818CF8] shadow-lg shadow-[#6366F1]/25"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-[#9CA3AF]">
                    <Check size={16} className="shrink-0 text-[#10B981]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
