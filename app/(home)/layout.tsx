import DynamicBreadCrumb from "@/components/dynamic-breadcrumb";
import AppSidebar from "@/components/sidebar/app-sidebar";
import { ModeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between px-4">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadCrumb />
            </div>
            <ModeToggle />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <main>{children}</main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
