import {
  Building2,
  LogOut,
  LayoutDashboard,
  CalendarRange,
  Users as UsersIcon,
  Home,
  Plus,
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

interface MenuItem {
  title: string;
  href: string;
  icon: any;
  roles?: string[];
}

const ALL_MENU_ITEMS: MenuItem[] = [
  {
    title: "Browse",
    href: "/",
    icon: Home,
  },
  {
    title: "BigBoss",
    href: "/bigboss",
    icon: LayoutDashboard,
    roles: ["BIGBOSS"],
  },
  {
    title: "Create Listing",
    href: "/listings/create",
    icon: Plus,
    roles: ["BIGBOSS", "OWNER"],
  },
  {
    title: "Users",
    href: "/users",
    icon: UsersIcon,
    roles: ["BIGBOSS"],
  },
  {
    title: "Tour Requests",
    href: "/owner-tenant",
    icon: CalendarRange,
    roles: ["TENANT", "OWNER"],
  },
];

import { useAuth } from "@/context/state.context.tsx";
import { useLogout } from "@/module/auth/hooks/use-auth";
import { confirm } from "@/components/alert-box";

export function AppSidebar() {
  const location = useLocation();
  const { role, user } = useAuth();
  const { mutateAsync: logout } = useLogout();

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
                <Building2 className="size-10" />
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
            {menuItems.map((item) => {
              const isCreate = item.title === "Create Listing";
              return (
                <SidebarMenuItem className="flex gap-0.5" key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`
                      ${location.pathname === item.href ? "bg-primary text-white hover:bg-primary/90 shadow-md" : ""} 
                      ${isCreate ? "scale-110 mx-auto rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-300 shadow-lg hover:rotate-90 hover:scale-125 active:scale-95 my-2" : ""}
                      md:justify-center
                    `}
                  >
                    <Link to={item.href}>
                      <item.icon className={isCreate ? "size-5" : ""} />
                      <span className="md:hidden font-bold">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="md:justify-center text-red-500 hover:text-red-600"
              onClick={async () => {
                if (user) {
                  const ok = await confirm.warning({
                    message: "Are you sure you want to log out?",
                  });
                  if (ok) logout(user);
                }
              }}
            >
              <LogOut />
              <span className="md:hidden">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
