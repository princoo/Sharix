import { Navbar } from "@/components/custom/navigation/navbar";
import { HeroSection } from "./components/heroSection/hero-section";
import { HowItWorksSection } from "./components/heroSection/how-it-works-section";
import { FeaturesSection } from "./components/heroSection/feature-section";
import { TestimonialsSection } from "./components/heroSection/testimonials-section";
import { CtaSection } from "./components/heroSection/cta-section";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
    </div>
  );
}
