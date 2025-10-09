import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="bg-gradient-to-r from-primary to-cyan-600 py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
          Start managing your contributions smarter today.
        </h2>
        <p className="text-lg text-white/90 mb-8">
          Join now and experience the future of collaborative finance.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-white text-primary hover:bg-white/90 font-semibold"
        >
          <Link href="/auth/login">Create Your Free Account</Link>
        </Button>
      </div>
    </section>
  );
}
