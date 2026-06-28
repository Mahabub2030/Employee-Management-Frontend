import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    // Added min-h-screen and matching neubrutalist background
    <SidebarProvider className="min-h-screen bg-neo-bg">
      <AppSidebar />

      {/*
        SidebarInset holds the main window area.
        Replaced default background and added clear borders if needed
      */}
      <SidebarInset className="bg-neo-bg flex flex-col min-h-screen">
        {/* HEADER: Added thick neubrutalist black bottom border */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b-4 border-black bg-white px-6">
          <SidebarTrigger className="-ml-1 border-2 border-black bg-white hover:bg-zinc-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" />

          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4 bg-black w-[2px]" // Made separator matching black
          />
        </header>

        {/* MAIN BODY: Adjusted padding and structure to match your Next.js layout */}
        <div className="flex-1 p-6 md:p-10 flex flex-col gap-6 bg-neo-bg overflow-y-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
