import { RolesEnum } from "@/enum/role";

export interface ProtectedRoute {
  title: string;
  url: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  icon?: any;
  role: RolesEnum[];
}
