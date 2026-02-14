import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Navigation */}
      <header className="relative z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          <div className="flex lg:flex-1">
            <div className="text-2xl font-bold text-white">
              Invoice<span className="text-[#6366F1]">Flow</span>
            </div>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <Link href="/create" className="text-sm font-semibold leading-6 text-[#9CA3AF] hover:text-white transition-colors">
              Create
            </Link>
            <Link href="/time" className="text-sm font-semibold leading-6 text-[#9CA3AF] hover:text-white transition-colors">
              Time Tracking
            </Link>
            <Link href="/analytics" className="text-sm font-semibold leading-6 text-[#9CA3AF] hover:text-white transition-colors">
              Analytics
            </Link>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              href="/create"
              className="rounded-lg bg-[#6366F1] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4F46E5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1] transition-colors"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#6366F1] to-[#F59E0B] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#F9FAFB] sm:text-6xl">
              Free Invoice Generator:{" "}
              <span className="text-[#6366F1]">Professional Invoices in 60 Seconds</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#9CA3AF]">
              No signup required. Create, download, send instantly. The fastest way to get paid with professional invoices that work on any device.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/create"
                className="rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#4F46E5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1] transition-colors"
              >
                Create Free Invoice
              </Link>
              <button className="text-sm font-semibold leading-6 text-[#9CA3AF] hover:text-white transition-colors">
                Learn more <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#F59E0B] to-[#6366F1] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </section>

      {/* Temporary placeholder - building section by section */}
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#9CA3AF] text-center">
          Additional sections will be built following proper design workflow.<br />
          Hero section complete and ready for review.
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#374151] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[#6B7280]">
            © 2026 InvoiceFlow. Part of Astra Ventures.
          </div>
          <div className="flex gap-6 text-[#6B7280]">
            <a href="#" className="hover:text-[#9CA3AF] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[#9CA3AF] transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-[#9CA3AF] transition-colors">
              API Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
