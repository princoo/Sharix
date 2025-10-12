"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/hooks/use-auth"
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSession } from "next-auth/react";
import { RolesEnum } from "@/enum/role";

interface AuthCheckProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthCheck({ children, requireAuth = true }: AuthCheckProps) {
  // const { user, loading } = useAuth()
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // if (!loading && mounted) {
    if (requireAuth && !sessionData?.user) {
      router.push("/auth/login");
    } else if (!requireAuth && sessionData?.user) {
      // Redirect authenticated users to dashboard based on role
      if (sessionData?.user.role === RolesEnum.MANAGER) {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
    // }
  }, [mounted, requireAuth, router]);
  // }, [user, loading, mounted, requireAuth, router])
  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (requireAuth && !sessionData?.user) {
    return null; // Will redirect to login
  }

  if (!requireAuth && sessionData?.user) {
    return null; // Will redirect to dashboard
  }

  return <>{children}</>;
}
