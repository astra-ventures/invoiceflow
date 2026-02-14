import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustedBy } from "@/components/landing/TrustedBy";
import { Features } from "@/components/landing/Features";
import { Calculator } from "@/components/landing/Calculator";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0F1E]">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <Calculator />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
