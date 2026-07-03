import { Navbar } from "@/components/layout/navbar"
import { HeroSection } from "@/components/landing/hero"
import { FeaturesSection } from "@/components/landing/features"
import { HowItWorksSection } from "@/components/landing/how-it-works"
import { LiveDemoSection } from "@/components/landing/demo"
import { TestimonialsSection } from "@/components/landing/testimonials"
import { PricingSection } from "@/components/landing/pricing"
import { FAQSection } from "@/components/landing/faq"
import { FooterSection } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816]">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <LiveDemoSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FooterSection />
    </main>
  )
}
