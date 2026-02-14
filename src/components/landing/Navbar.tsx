"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0F1E]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Invoice<span className="text-[#6366F1]">Flow</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm text-[#9CA3AF] transition-colors hover:text-white">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm text-[#9CA3AF] transition-colors hover:text-white">
            How It Works
          </Link>
          <Link href="#pricing" className="text-sm text-[#9CA3AF] transition-colors hover:text-white">
            Pricing
          </Link>
          <Link
            href="/create"
            className="rounded-lg bg-[#6366F1] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#818CF8] hover:shadow-lg hover:shadow-[#6366F1]/25"
          >
            Create Invoice — Free
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5 bg-[#0A0F1E] md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              <Link href="#features" className="text-[#9CA3AF] hover:text-white" onClick={() => setMobileOpen(false)}>Features</Link>
              <Link href="#how-it-works" className="text-[#9CA3AF] hover:text-white" onClick={() => setMobileOpen(false)}>How It Works</Link>
              <Link href="#pricing" className="text-[#9CA3AF] hover:text-white" onClick={() => setMobileOpen(false)}>Pricing</Link>
              <Link
                href="/create"
                className="mt-2 rounded-lg bg-[#6366F1] px-5 py-3 text-center text-sm font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                Create Invoice — Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
