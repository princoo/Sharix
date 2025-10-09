"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return { success: false, error: "Invalid credentials" };
      }

      return { success: true };
    } catch {
      return { success: false, error: "Network error occurred" };
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  const setupPassword = async (
    token: string,
    password: string,
    name: string,
  ) => {
    try {
      const response = await fetch("/api/auth/setup-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        // After successful password setup, sign in the user
        const loginResult = await signIn("credentials", {
          email: data.user.email,
          password: password,
          redirect: false,
        });

        if (loginResult?.error) {
          return { success: false, error: "Setup successful but login failed" };
        }

        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || "Password setup failed",
        };
      }
    } catch {
      return { success: false, error: "Network error occurred" };
    }
  };

  return {
    user: session?.user || null,
    loading: status === "loading",
    login,
    logout,
    setupPassword,
  };
}
