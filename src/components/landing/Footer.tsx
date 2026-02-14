import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0A0F1E] py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-white">
            Invoice<span className="text-[#6366F1]">Flow</span>
          </Link>
          <span className="text-sm text-[#6B7280]">© 2026 Astra Ventures</span>
        </div>
        <div className="flex gap-6 text-sm text-[#6B7280]">
          <Link href="/privacy" className="transition-colors hover:text-[#9CA3AF]">Privacy</Link>
          <Link href="/terms" className="transition-colors hover:text-[#9CA3AF]">Terms</Link>
          <Link href="/api-docs" className="transition-colors hover:text-[#9CA3AF]">API</Link>
        </div>
      </div>
    </footer>
  );
}
