"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  CalendarDaysIcon,
  CircleCheckBigIcon,
  HourglassIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
} from "lucide-react";
import AddTaskDialog from "../(features)/tasks/components/AddTaskDialog";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { title: "Dashboard", url: "/", icon: <LayoutDashboardIcon /> },
  { title: "Tasks", url: "/tasks", icon: <CircleCheckBigIcon /> },
  { title: "Habits", url: "/habits", icon: <ListChecksIcon /> },
  { title: "Deep Work", url: "/deepwork", icon: <HourglassIcon /> },
  { title: "Schedule", url: "/schedule", icon: <CalendarDaysIcon /> },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent>
        {/* NAVIGATION LINKS */}
        <SidebarGroup>
          <SidebarGroupLabel>NavLinks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.url;
                return (
                  <SidebarMenuItem key={link.title}>
                    <SidebarMenuButton
                      asChild
                      className={`flex items-center gap-2 p-3 rounded-lg h-8
            ${
              isActive
                ? "bg-blue-500 text-white font-bold shadow-md pointer-events-none"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }
          `}
                    >
                      <Link href={link.url}>
                        {link.icon}
                        <span>{link.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        {/* QUICK ACTION BUTTONS */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <AddTaskDialog />
              {/* TODO: Add Deepwork button and/or current timer view (like toggl app) */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
