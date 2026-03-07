import { Button } from "@/components/ui/button";
import { Search, MapPin, ChevronDown } from "lucide-react";

export default function FilterBar() {
  return (
    <div className="flex w-full max-w-3xl items-center divide-x rounded-full border bg-background p-1.5 shadow-sm">
      <button className="flex flex-1 items-center justify-between px-5 py-2 text-sm font-medium hover:bg-muted/50 rounded-l-full transition-colors">
        <span className="truncate">New home</span>
        <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground shrink-0" />
      </button>
      <button className="flex flex-1 items-center justify-between px-5 py-2 text-sm font-medium hover:bg-muted/50 transition-colors">
        <span className="truncate">$800 000 - $900 000</span>
        <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground shrink-0" />
      </button>
      <button className="flex flex-1 items-center justify-between px-5 py-2 text-sm font-medium hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-2 truncate">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">Los Angeles</span>
        </div>
        <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground shrink-0" />
      </button>
      <div className="pl-1.5">
        <Button
          size="icon"
          className="h-10 w-10 rounded-full bg-black hover:bg-black/90 text-white shrink-0"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
