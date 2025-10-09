import Link from "next/link";
import { NavLinks } from "./nav-links";
import { NavActions } from "./nav-actions";
import Logo from "@/components/custom/logo";

export function Navbar() {
  return (
    <nav className="border-b bg-white fixed top-0 w-full z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="text-cyan-500" size={32} />
            <span className="text-xl font-semibold text-gray-900">Sharix</span>
          </Link>

          <div className="hidden md:block">
            <NavLinks />
          </div>

          <NavActions />
        </div>
      </div>
    </nav>
  );
}
