import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NavActions() {
  return (
    <div className="flex items-center gap-4">
      <Button
        asChild
        className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"
      >
        <Link href="/auth/login">Get Started</Link>
      </Button>
    </div>
  );
}
