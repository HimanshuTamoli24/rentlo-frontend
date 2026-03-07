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
    title: "Lists (Admin)",
    href: "/admin",
    icon: List,
    roles: ["ADMIN", "BIGBOSS"],
  },
  {
    title: "My Listings",
    href: "/owner", // Assuming an owner dashboard will be here
    icon: List,
    roles: ["OWNER", "ADMIN"],
  },
  {
    title: "Users",
    href: "/users",
    icon: UserRound,
    roles: ["ADMIN", "BIGBOSS"],
  },
  {
    title: "Visits",
    href: "/visits",
    icon: CalendarClock,
    roles: ["ADMIN", "BIGBOSS", "TENANT", "OWNER"],
  },
];

export function AppSidebar() {
  const location = useLocation();

  // Parse user role
  const userStr = localStorage.getItem("user");
  let userRole = localStorage.getItem("role") || "";
  try {
    if (userStr) {
      const user = JSON.parse(userStr);
      userRole = user?.role || user?.data?.role || userRole;
    }
  } catch (e) {}

  const normalizedRole = userRole.toUpperCase();

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
