import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/state.context.tsx";
import { Facehash } from "facehash";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, PaintBucket } from "lucide-react";
import { useLogout } from "@/module/auth/hooks/use-auth";
import { confirm } from "@/components/alert-box";
import { ThemeSettingsDialog } from "@/components/setting";
import { useState } from "react";

export default function TopNav() {
  const navigate = useNavigate();
  const { isAuth, user } = useAuth();
  const { mutateAsync: logoutUser } = useLogout();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (user) {
        const ok = await confirm.warning({
          message: "Are you sure you want to log out?",
        });
        if (ok) await logoutUser(user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6 md:gap-10">
          <a href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-2xl tracking-tight">
              Rentlo
            </span>
          </a>
          <nav className="hidden gap-6 md:flex">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              New house
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-semibold text-foreground transition-colors hover:text-foreground"
            >
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
              Apartment
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Construction
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              My house
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Services
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isAuth ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="cursor-pointer transition-transform hover:scale-105 active:scale-95">
                  <Facehash
                    name={user?.name || user?.email || "Guest"}
                    size={40}
                    colorClasses={["bg-primary"]}
                    className="rounded-xl ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer font-medium"
                  onClick={() =>
                    navigate(
                      `/${user?.role.toLowerCase() === "bigboss" ? "bigboss" : user?.role.toLowerCase()==="owner"?"owner-tenant":"/"}`,
                    )
                  }
                >
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer font-medium"
                  onClick={() => setSettingsOpen(true)}
                >
                  <PaintBucket className="mr-2 h-4 w-4" />
                  Appearance Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 font-medium"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              className="rounded-full px-6 font-semibold"
              variant="outline"
            >
              Log in
            </Button>
          )}
        </div>
      </div>

      <ThemeSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
}
