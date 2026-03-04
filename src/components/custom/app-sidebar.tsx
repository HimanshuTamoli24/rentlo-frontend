import {
  Building2,
  CalendarClock,
  List,
  LogOut,
  UserRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";

const menuItems = [
  {
    title: "Lists",
    href: "/",
    icon: List,
  },
  {
    title: "Users",
    href: "/users",
    icon: UserRound,
  },
  {
    title: "Visits",
    href: "/visits",
    icon: CalendarClock,
  },
];

export function AppSidebar() {
  const location =  useLocation();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="md:justify-center">
              <Link to="/">
                <Building2 className="size-4" />
                <span className="md:hidden">Rentlo</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-col justify-center items-center h-full">
        <SidebarGroup>
          <SidebarGroupLabel className="md:hidden">Main Menu</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem  className="flex gap-0.5" key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`${location.pathname === item.href ? "bg-primary  hover:bg-primary/90" : ""} md:justify-center`}
                >
                  <Link to={item.href}>
                    <item.icon />
                    <span className="md:hidden">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="md:justify-center text-red-500 hover:text-red-600"
            >
              <Link to="/">
                <LogOut />
                <span className="md:hidden">Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
