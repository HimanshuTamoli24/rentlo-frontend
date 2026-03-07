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

const ALL_MENU_ITEMS = [
  {
    title: "t",
    href: "/",
    icon: UserRound,
  },
  {
    title: "BigBoss",
    href: "/bigboss",
    icon: UserRound,
    roles: ["BIGBOSS"],
  },
  {
    title: "Create List",
    href: "/listings/create",
    icon: Building2,
    roles: ["OWNER", "ADMIN", "BIGBOSS"],
  },
  {
    title: "Users",
    href: "/users",
    icon: UserRound,
    roles: ["ADMIN", "BIGBOSS"],
  },
];

import { useAuth } from "@/context/state.context.tsx";

export function AppSidebar() {
  const location = useLocation();
  const { role } = useAuth();

  const normalizedRole = (role || "").toUpperCase();

  const menuItems = ALL_MENU_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(normalizedRole),
  );

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
              <SidebarMenuItem className="flex gap-0.5" key={item.title}>
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
