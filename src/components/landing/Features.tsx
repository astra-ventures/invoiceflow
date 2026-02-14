"use client";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  BarChart3,
  CreditCard,
  RefreshCw,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Instant Invoices",
    description: "Fill in the details, hit generate. Professional PDF ready in under 60 seconds.",
    gradient: "from-[#6366F1] to-[#818CF8]",
  },
  {
    icon: Clock,
    title: "Built-in Time Tracker",
    description: "Track billable hours per project and auto-populate invoices from your timesheets.",
    gradient: "from-[#F59E0B] to-[#FBBF24]",
  },
  {
    icon: BarChart3,
    title: "Revenue Analytics",
    description: "See your earnings at a glance. Track paid vs outstanding across all clients.",
    gradient: "from-[#10B981] to-[#34D399]",
  },
  {
    icon: CreditCard,
    title: "Stripe Payments",
    description: "Accept credit card payments directly on your invoices. Get paid faster, automatically.",
    gradient: "from-[#6366F1] to-[#A78BFA]",
  },
  {
    icon: RefreshCw,
    title: "Recurring Invoices",
    description: "Set it and forget it. Schedule invoices to auto-generate on any cadence you need.",
    gradient: "from-[#EC4899] to-[#F472B6]",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Create and manage invoices from any device. Responsive design that just works.",
    gradient: "from-[#F59E0B] to-[#F97316]",
  },
];

export function Features() {
  return (
    <section id="features" className="relative bg-[#0A0F1E] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[#6366F1]">Features</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Everything you need to get paid
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#9CA3AF]">
            From creating your first invoice to managing recurring clients — InvoiceFlow handles it all.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#111827] p-8 transition-all hover:border-white/10 hover:bg-[#1a2235]"
            >
              {/* Subtle gradient glow on hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-10 blur-2xl`} />
              </div>

              <div className={`inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3`}>
                <feature.icon size={22} className="text-white" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#9CA3AF]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
