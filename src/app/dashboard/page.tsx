"use client";
import type React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/custom/logo";
import Lottie from "lottie-react";
import constructionAnimation from "../../../public/animations/website-maintenance.json";
export default function UnderConstructionPage() {
  return (
    <div className="min-h-screen bg-white p-4 flex justify-center">
      <div className="w-full relative">
        <div className="flex flex-row-reverse justify-between items-center">
          {/* Back to Home Button */}
          <div>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground bg-transparent"
              >
                Back to Home
              </Button>
            </Link>
          </div>
          {/* Brand/Logo */}
          <div className="flex gap-2 items-center text-primary">
            <Link href="/" className="flex items-center gap-2">
              <Logo size={32} />
              <span className="text-xl font-bold">Sharix</span>
            </Link>
          </div>
        </div>

        {/* Construction Illustration */}
        <div className="bg-rd-500 flex flex-col items-center justify-center">
          <div className="flex justify-center">
            <div className="w-64 h-64 md:w-96 md:h-96">
              <Lottie animationData={constructionAnimation} loop={true} />;
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              Under Development!
            </h2>
            <p className="text-muted-foreground text-lg text-balance">
              To make things right we need some time to rebuild
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
