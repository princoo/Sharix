import { HeroContent } from "./hero-content";
import { HeroImage } from "./hero-image";

export function HeroSection() {
  return (
    <section className="container py-16 lg:py-24 px-6 lg:px-8">
      <div className="grid gap-12 md:grid-cols-2 lg:gap-16 items-center">
        <HeroContent />
        <HeroImage />
      </div>
    </section>
  );
}
