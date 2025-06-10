"use client";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

type DashboardSidebarProps = {
  type: "admin" | "profile";
};

export const DashboardSidebar = ({ type }: DashboardSidebarProps) => {
  const pathname = usePathname();

  const sideBarNavItems = {
    admin: [
      {
        title: "Hantera produkter",
        url: "/admin",
        icon: Home,
      },
      // {
      //   title: "Beställningar",
      //   url: "/admin/orders",
      //   icon: Inbox,
      // },
      // {
      //   title: "Hantera produkter",
      //   url: "/admin/products",
      //   icon: Calendar,
      // },
    ],
    profile: [
      {
        title: "Search",
        url: "#",
        icon: Search,
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings,
      },
    ],
  };

  const navItems = sideBarNavItems[type];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="h-20"
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
