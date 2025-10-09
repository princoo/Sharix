import { ProtectedRoute } from "@/lib/types/routes";

export const protectedRoutes: ProtectedRoute[] = [];

export const publicPaths = [
  "/",
  "/auth/login",
  "/auth/setup-password",
  "/unauthorized",
  "/dashboard",
  "/auth/setup-password",
];
