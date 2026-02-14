"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative bg-[#0A0F1E] py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/20 to-transparent" />

      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#6366F1]/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to get paid faster?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[#9CA3AF]">
            Join thousands of freelancers and small businesses creating professional invoices in seconds. No signup. No credit card. Just results.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/create"
              className="group flex items-center gap-2 rounded-xl bg-[#F59E0B] px-8 py-4 text-base font-semibold text-[#0A0F1E] shadow-xl shadow-[#F59E0B]/20 transition-all hover:bg-[#FBBF24] hover:shadow-2xl hover:shadow-[#F59E0B]/30"
            >
              Create Your First Invoice
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-[#6B7280]">Free forever · No account needed · PDF in 60 seconds</p>
        </motion.div>
      </div>
    </section>
  );
}
