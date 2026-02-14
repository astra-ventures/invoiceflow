"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Calculator() {
  const [invoicesPerMonth, setInvoicesPerMonth] = useState(10);
  const [minutesPerInvoice, setMinutesPerInvoice] = useState(15);
  const [hourlyRate, setHourlyRate] = useState(75);

  const oldTimeHours = (invoicesPerMonth * minutesPerInvoice) / 60;
  const newTimeHours = (invoicesPerMonth * 1) / 60; // 1 minute per invoice
  const savedHours = oldTimeHours - newTimeHours;
  const savedMoney = savedHours * hourlyRate;
  const savedYearly = savedMoney * 12;

  return (
    <section id="calculator" className="relative bg-[#0A0F1E] py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/20 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[#6366F1]">
            ROI Calculator
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            How much time are you wasting?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#9CA3AF]">
            Freelancers spend an average of 15 minutes per invoice. With
            InvoiceFlow, it takes 60 seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-12 max-w-4xl"
        >
          <div className="grid gap-8 md:grid-cols-2">
            {/* Inputs */}
            <div className="space-y-6 rounded-2xl border border-white/5 bg-[#111827] p-8">
              <div>
                <label className="flex items-center justify-between text-sm text-[#9CA3AF] mb-3">
                  <span>Invoices per month</span>
                  <span className="font-semibold text-white text-lg">{invoicesPerMonth}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={invoicesPerMonth}
                  onChange={(e) => setInvoicesPerMonth(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#1F2937] accent-[#6366F1]"
                />
              </div>
              <div>
                <label className="flex items-center justify-between text-sm text-[#9CA3AF] mb-3">
                  <span>Minutes per invoice (current)</span>
                  <span className="font-semibold text-white text-lg">{minutesPerInvoice} min</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={minutesPerInvoice}
                  onChange={(e) => setMinutesPerInvoice(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#1F2937] accent-[#6366F1]"
                />
              </div>
              <div>
                <label className="flex items-center justify-between text-sm text-[#9CA3AF] mb-3">
                  <span>Your hourly rate</span>
                  <span className="font-semibold text-white text-lg">${hourlyRate}/hr</span>
                </label>
                <input
                  type="range"
                  min="25"
                  max="300"
                  step="25"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#1F2937] accent-[#6366F1]"
                />
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#6366F1]/30 bg-gradient-to-b from-[#6366F1]/10 to-[#111827] p-8">
              <div>
                <div className="text-sm font-medium text-[#9CA3AF] mb-6">
                  With InvoiceFlow, you save:
                </div>
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[#9CA3AF]">Hours saved / month</span>
                    <span className="text-3xl font-bold text-white">
                      {savedHours.toFixed(1)}h
                    </span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex items-baseline justify-between">
                    <span className="text-[#9CA3AF]">Money saved / month</span>
                    <span className="text-3xl font-bold text-[#10B981]">
                      ${savedMoney.toFixed(0)}
                    </span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex items-baseline justify-between">
                    <span className="text-[#9CA3AF]">Yearly savings</span>
                    <span className="text-4xl font-bold text-[#F59E0B]">
                      ${savedYearly.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/create"
                className="group mt-8 flex items-center justify-center gap-2 rounded-xl bg-[#6366F1] px-6 py-4 text-base font-semibold text-white shadow-xl shadow-[#6366F1]/25 transition-all hover:bg-[#818CF8]"
              >
                Start Saving Time Now
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
