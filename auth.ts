import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  // set up sign in page
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email as string },
          include: { role: true, Profile: { select: { id: true } } },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials!.password as string,
          user.password
        );

        if (!isValid) return null;
        return {
          id: user.id,
          email: user.email,
          role: user.role.name,
          Profile: user.Profile ?? { id: "" },
        };
      },
    }),
  ],
});
