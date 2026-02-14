"use client";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Fill in the details",
    description: "Add your business info, client details, and line items. Auto-calculates totals and tax.",
  },
  {
    number: "02",
    title: "Customize & preview",
    description: "Choose your template, add your logo, adjust colors. See a live preview as you build.",
  },
  {
    number: "03",
    title: "Download or send",
    description: "Export as professional PDF or send directly via email. Add Stripe for instant payments.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-[#0A0F1E] py-24 sm:py-32">
      {/* Subtle divider gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/20 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[#6366F1]">How it works</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Three steps. Sixty seconds.
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-[#6366F1]/30 to-transparent sm:block" />
              )}

              <div className="text-5xl font-bold text-[#6366F1]/20">{step.number}</div>
              <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#9CA3AF]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
