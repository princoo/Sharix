import { ProtectedRoute } from "@/lib/types/routes";

export const protectedRoutes: ProtectedRoute[] = [
  // {
  //   title: "Dashboard",
  //   url: "/dashboard",
  //   icon: Home,
  //   role: [RolesEnum.MANAGER, RolesEnum.MEMBER, RolesEnum.BOARD],
  // },
  //   {
  //     title: "Productivity Scorecard",
  //     url: "/dashboard/productivity-scorecard",
  //     icon: ChartColumn,
  //     role: [RoleEnum.DEVELOPER],
  //   },
  //   {
  //     title: "AI Roadmap & Tests",
  //     url: "#",
  //     icon: Map,
  //     role: [RoleEnum.DEVELOPER],
  //   },
  //   {
  //     title: "Security Dashboard",
  //     url: "/dashboard/security",
  //     icon: UserCheck,
  //     role: [RoleEnum.ADMIN],
  //   },
  //   {
  //     title: "Self-assessment",
  //     url: "/dashboard/self-assessment",
  //     icon: FileText,
  //     role: [RoleEnum.DEVELOPER],
  //   },
  //   {
  //     title: "AI Score",
  //     url: "/dashboard/ai-scores",
  //     icon: Brain,
  //     role: [RoleEnum.DEVELOPER, RoleEnum.MANAGER],
  //   },
  //   {
  //     title: "Manager Feedback",
  //     url: "/dashboard/manager-feedback",
  //     icon: MessageSquare,
  //     role: [RoleEnum.MANAGER],
  //   },
  //   {
  //     title: "Notifications",
  //     url: "/dashboard/notifications",
  //     icon: Bell,
  //     role: [RoleEnum.DEVELOPER, RoleEnum.MANAGER, RoleEnum.ADMIN],
  //   },
  //   {
  //     title: "Developer Flow",
  //     url: "#",
  //     icon: GitBranch,
  //     role: [RoleEnum.DEVELOPER],
  //   },
  //   {
  //     title: "Micro services",
  //     url: "#",
  //     icon: ChartBarBig,
  //     role: [RoleEnum.DEVELOPER, RoleEnum.MANAGER, RoleEnum.ADMIN],
  //   },
  //   {
  //     title: "Settings",
  //     url: "#",
  //     icon: Settings,
  //     role: [RoleEnum.DEVELOPER, RoleEnum.MANAGER, RoleEnum.ADMIN],
  //   },
];

export const publicPaths = [
  "/",
  "/auth/login",
  "/auth/setup-password",
  "/unauthorized",
  "/dashboard",
  "/auth/setup-password",
];
