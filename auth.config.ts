import type { NextAuthConfig } from "next-auth";

export const authConfig = {
session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.profile = user.Profile;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.Profile = token.profile as { id: string };
      }
      return session;
    },
  },
  providers:[]
} satisfies NextAuthConfig;
