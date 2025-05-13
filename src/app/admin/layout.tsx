import { DashboardSidebar } from "@/components/common/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="w-full">
      <DashboardSidebar type="admin" />
      <main className="flex-1">
        <SidebarTrigger className="mb-4 cursor-pointer" />
        <div>{children}</div>
      </main>
    </SidebarProvider>
  );
}
