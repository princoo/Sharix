import Image from "next/image";

export function HeroImage() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 p-8 shadow-2xl lg:p-12">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-white shadow-xl">
          <Image
            src="/images/hero.png"
            alt="Sharix Dashboard Preview"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
