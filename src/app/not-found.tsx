import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-[#6366F1] mb-4">404</p>
        <h1 className="text-2xl font-semibold text-[#F9FAFB] mb-3">
          Page not found
        </h1>
        <p className="text-[#9CA3AF] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-6 py-3 font-medium text-white transition-all hover:bg-[#818CF8]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
