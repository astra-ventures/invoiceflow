"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0A0F1E] pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#6366F1]/20 blur-[120px]" />
        <div className="absolute top-1/2 -right-32 h-[400px] w-[400px] rounded-full bg-[#F59E0B]/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-1.5 text-sm text-[#A5B4FC]">
            <Zap size={14} className="text-[#F59E0B]" />
            100% Free — No signup required
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-8 max-w-4xl text-center text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Professional invoices{" "}
          <span className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] bg-clip-text text-transparent">
            in 60 seconds
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-[#9CA3AF]"
        >
          Create, download, and send beautiful invoices instantly. Track time, manage clients, and get paid faster — all without creating an account.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/create"
            className="group flex items-center gap-2 rounded-xl bg-[#6366F1] px-8 py-4 text-base font-semibold text-white shadow-xl shadow-[#6366F1]/25 transition-all hover:bg-[#818CF8] hover:shadow-2xl hover:shadow-[#6366F1]/30"
          >
            Create Free Invoice
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#features"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-medium text-[#9CA3AF] transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            See how it works
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8 border-t border-white/5 pt-10"
        >
          {[
            { value: "60s", label: "Average creation time" },
            { value: "$0", label: "Forever free" },
            { value: "PDF", label: "Instant download" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
              <div className="mt-1 text-sm text-[#6B7280]">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
