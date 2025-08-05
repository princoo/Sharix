import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
  interface User {
    role: string;
  }
  interface JWT {
    id: string;
    role: string;
  }
}
