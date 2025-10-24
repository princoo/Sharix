"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  // SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
// import { NavUser } from "./nav-user";
import Link from "next/link";
import Logo from "@/components/custom/logo";
import { usePathname } from "next/navigation";
import { items } from "@/utils/sidebarNavItems";
export function AppSidebar() {
  const path = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="p-4 bg-sidebar">
        <div className="flex gap-2 items-center text-primary">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="text-xl font-bold">Sharix</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={path === item.url}
                    className="text-muted-foreground hover:bg-primary-light dark:hover:bg-sidebar-accent dark:hover:text-muted-foreground"
                  >
                    <Link href={item.url}>
                      <item.icon size={20} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      {/* {sessionData?.user && (
        <SidebarFooter className="bg-sidebar">
          <NavUser
            user={{
              name: sessionData?.user.username,
              email: sessionData?.user.email,
              avatar: "https://via.placeholder.com/150",
              role: sessionData?.user.role,
            }}
          />
        </SidebarFooter>
      )} */}
    </Sidebar>
  );
}
