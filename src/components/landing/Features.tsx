"use client";
import { motion } from "framer-motion";

const features = [
  {
    title: "Instant Invoices",
    description: "Fill in the details, hit generate. Professional PDF ready in under 60 seconds. No signup, no friction.",
    accent: "#6366F1",
  },
  {
    title: "Built-in Time Tracker",
    description: "Track billable hours per project and auto-populate invoices from your timesheets. Every minute counts.",
    accent: "#F59E0B",
  },
  {
    title: "Revenue Analytics",
    description: "See your earnings at a glance. Track paid vs outstanding invoices across all your clients in real time.",
    accent: "#10B981",
  },
  {
    title: "Stripe Payments",
    description: "Accept credit card payments directly on your invoices. Get paid faster with one-click payment links.",
    accent: "#818CF8",
  },
  {
    title: "Recurring Invoices",
    description: "Set it and forget it. Schedule invoices to auto-generate and send on any cadence you need.",
    accent: "#EC4899",
  },
  {
    title: "Works Everywhere",
    description: "Create and manage invoices from any device. Fully responsive — desktop, tablet, or phone.",
    accent: "#F59E0B",
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
              {/* Accent glow on hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                <div
                  className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-[0.07] blur-2xl"
                  style={{ backgroundColor: feature.accent }}
                />
              </div>

              {/* Accent dot */}
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: feature.accent }}
              />

              <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#9CA3AF]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
