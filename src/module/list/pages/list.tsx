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
import { useState } from "react";

export default function ListPage() {
  const { data, isLoading, isError } = useLists();

  // States for filter control (stubbed out since backend filter might not be connected yet)
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([5000]);

  const rawLists: ListingCardData[] = data?.data || [];

  // Local Filtering logic just as a placeholder to make UI reactive based on the stub features
  const lists = rawLists.filter(
    (list) =>
      list.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      list.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <TopNav />

      <main className="flex-1 px-4 py-8 md:px-8 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Sidebar Filters */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-8 rounded-2xl border bg-card p-6 shadow-sm h-fit sticky top-24">
            {/* INPUT SEARCH */}
            <div className="space-y-3">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Input Search
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
                <span className="text-sm font-medium">${priceRange[0]}</span>
              </div>
              <Slider
                defaultValue={[5000]}
                max={10000}
                step={100}
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
              <Tabs defaultValue="1day" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="1day">1 DAY</TabsTrigger>
                  <TabsTrigger value="2day">2 DAY</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* LOCATION SELECT */}
            <div className="space-y-3 pt-4 border-t">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Location Select
              </label>
              <Select>
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="la">Los Angeles</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="sf">San Francisco</SelectItem>
                  <SelectItem value="mia">Miami</SelectItem>
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
