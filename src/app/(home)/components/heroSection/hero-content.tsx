import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroContent() {
  return (
    <div className="flex flex-col justify-center space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-balance lg:text-5xl">
          Simplify How Your Team Contributes
        </h1>
        <p className="text-lg text-muted-foreground text-pretty max-w-xl">
          Manage your group contributions with ease and transparency.
          <br /> Sharix provides the tools you need for a seamless financial
          collaboration.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
          <Link href="#get-started">Get Started</Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="bg-muted hover:bg-muted/80"
          asChild
        >
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
