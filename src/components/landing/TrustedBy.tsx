"use client";
import { motion } from "framer-motion";

export function TrustedBy() {
  return (
    <section className="relative bg-[#0A0F1E] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-medium text-[#6B7280] mb-8">
            Built for freelancers, agencies, and small businesses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {[
              { icon: "🎨", label: "Designers" },
              { icon: "💻", label: "Developers" },
              { icon: "📸", label: "Photographers" },
              { icon: "✍️", label: "Writers" },
              { icon: "📊", label: "Consultants" },
              { icon: "🎥", label: "Videographers" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-[#4B5563] transition-colors hover:text-[#9CA3AF]"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
