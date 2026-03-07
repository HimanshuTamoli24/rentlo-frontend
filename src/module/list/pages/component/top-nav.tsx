import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function TopNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6 md:gap-10">
          <a href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-2xl tracking-tight">
              Rento
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
          <Button
            variant="outline"
            className="hidden sm:flex rounded-full px-5 font-semibold"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Place an ad
          </Button>
          <Button className="rounded-full px-6 font-semibold" variant="outline">
            Log in
          </Button>
        </div>
      </div>
    </header>
  );
}
