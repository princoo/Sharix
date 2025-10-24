import { AppSidebar } from "@/components/custom/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex items-center justify-between py-3 px-5 border-b dark:bg-sidebar">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            {/* <SearchForm /> */}
          </div>
        </header>
        <main className="bg-background-neutral dark:bg-sidebar min-h-screen px-5 py-2">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
