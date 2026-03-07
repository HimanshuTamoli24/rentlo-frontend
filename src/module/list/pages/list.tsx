import { useLists } from "../hooks/list-hook";
import ListCard, { type ListingCardData } from "./component/list-card";
import TopNav from "./component/top-nav";
import ListSkeleton from "./component/list-skeleton";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/utils/format-currency";

export default function ListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priceRange, setPriceRange] = useState([69000]);
  const [moveInOption, setMoveInOption] = useState("1day");
  const [locationCode, setLocationCode] = useState<string | undefined>(
    undefined,
  );

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading, isError } = useLists({
    search: debouncedSearch,
    rentAmount: priceRange[0],
    moveIn: moveInOption,
    location: locationCode,
  });

  const lists: ListingCardData[] = data?.data || [];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <TopNav />

      <main className="flex-1 px-4 py-8 md:px-8 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Sidebar Filters */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-8 rounded-2xl border bg-card p-6 shadow-sm h-fit sticky top-24">
            {/* INPUT SEARCH */}
            <div className="space-y-3">
              <label className="text-sm font-semibold tracking-wider text-muted-foreground">
                Please Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bar"
                  className="pl-9 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* PROGRESS BAR (SLIDER) */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Progress Bar (Price)
                </label>
                <span className="text-sm font-medium">
                  {" "}
                  {formatCurrency(0)} -{formatCurrency(priceRange[0])}
                </span>
              </div>
              <Slider
                defaultValue={[69000]}
                max={500000}
                step={1000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mt-2"
              />
            </div>

            {/* MOVE IN DATE OPTION / TABS */}
            <div className="space-y-3 pt-4 border-t">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Move In Date Option
              </label>
              <Tabs
                value={moveInOption}
                onValueChange={setMoveInOption}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="1day">1 D</TabsTrigger>
                  <TabsTrigger value="7day">7 D</TabsTrigger>
                  <TabsTrigger value="15day">15 D</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* LOCATION SELECT */}
            <div className="space-y-3 pt-4 border-t">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Location Select
              </label>
              <Select value={locationCode} onValueChange={setLocationCode}>
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="epsteinisland">Epstein island</SelectItem>
                  <SelectItem value="jaipur">Jaipur </SelectItem>
                  <SelectItem value="patiala">Patiala </SelectItem>
                  <SelectItem value="chaicode">Chaicode HeadQuater</SelectItem>
                  <SelectItem value="more">
                    More option buy our 69dollar plan :)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </aside>

          {/* Right Side: Property List Area */}
          <div className="flex-1 w-full min-w-0">
            <h1 className="text-2xl font-bold tracking-tight mb-6">
              Our Filter List Here
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isError ? (
                <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-12 text-center text-red-600 shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">
                    Something went wrong
                  </h3>
                  <p>Failed to load listings. Please try again later.</p>
                </div>
              ) : isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <ListSkeleton key={i} />
                ))
              ) : lists.length === 0 ? (
                <div className="col-span-full rounded-2xl border bg-card p-16 flex flex-col items-center justify-center text-center text-muted-foreground shadow-sm">
                  <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    No Listings Found
                  </h3>
                  <p>Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                lists.map((listing, index) => (
                  <ListCard
                    key={
                      listing.id ?? listing._id ?? `${listing.title}-${index}`
                    }
                    listing={listing}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
