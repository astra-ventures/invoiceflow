"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Crown, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { hasProAccess } from "@/lib/stripe";

const navLinks = [
  { href: "/create", label: "Create" },
  { href: "/history", label: "History" },
  { href: "/time", label: "Time" },
  { href: "/recurring", label: "Recurring" },
  { href: "/clients", label: "Clients" },
  { href: "/settings", label: "Settings" },
];

export function AppNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsPro(hasProAccess());
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Invoice<span className="text-[#6366F1]">Flow</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "font-medium text-[#6366F1]"
                  : "text-[#9CA3AF] hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Pro Status / Upgrade */}
          {isPro ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#6366F1]/20 to-[#F59E0B]/20 border border-[#6366F1]/30 rounded-full">
              <Crown className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-sm font-semibold text-white">Pro</span>
            </div>
          ) : (
            <Link
              href="/upgrade"
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-[#6366F1]/25 transition-all"
            >
              <Zap className="w-4 h-4" />
              Upgrade
            </Link>
          )}
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
            className="overflow-hidden border-t border-white/10 bg-[#0A0F1E] md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    pathname === link.href
                      ? "font-medium text-[#6366F1]"
                      : "text-[#9CA3AF] hover:text-white"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Pro Status / Upgrade */}
              <div className="border-t border-white/10 pt-4 mt-2">
                {isPro ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#6366F1]/20 to-[#F59E0B]/20 border border-[#6366F1]/30 rounded-lg">
                    <Crown className="w-4 h-4 text-[#F59E0B]" />
                    <span className="font-semibold text-white">Pro Member</span>
                  </div>
                ) : (
                  <Link
                    href="/upgrade"
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white rounded-lg font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Zap className="w-4 h-4" />
                    Upgrade to Pro
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}