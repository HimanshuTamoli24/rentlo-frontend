import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/state.context.tsx";

export default function TopNav() {
  const navigate = useNavigate();
  const { isAuth } = useAuth();
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
          {!isAuth && (
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
    </header>
  );
}
