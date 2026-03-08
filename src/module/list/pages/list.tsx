import { useLists } from "../hooks/list-hook";
import ListCard, { type ListingCardData } from "./component/list-card";
import TopNav from "./component/top-nav";
import Footer from "@/components/footer";
import SEO from "@/components/seo";
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
import { Card } from "@/components/ui/card";
import { Sparkles, ChevronRight } from "lucide-react";

import { useSearchParams } from "react-router";
import MainLayout from "@/components/main-layout";
import { Button } from "@/components/ui/button";

export default function ListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const rentAmount = Number(searchParams.get("rentAmount")) || 500000;
  const moveIn = searchParams.get("moveIn") || "1day";
  const location = searchParams.get("location") || undefined;
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading, isError } = useLists({
    search,
    rentAmount,
    moveIn,
    location,
    page,
  });

  const lists: ListingCardData[] = data?.data || [];

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Property Listings",
    description: "Available apartments and houses for rent.",
    itemListElement: lists.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: `https://rentlo.com/listings/${item.id || item._id}`,
    })),
  };

  const totalPages = data?.totalPages || 1;

  const updateParam = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1"); // Reset to page 1 on filter change
    setSearchParams(params);
  };

  return (
    <MainLayout>
      <SEO
        title="Find Your Perfect Home"
        description="Browse our curated list of apartments, houses, and luxury villas. Filter by price, location, and move-in availability."
        schema={listSchema}
      />
      <MainLayout.Title
        title="Find Your Perfect Home"
        description="Browse our curated list of apartments, houses, and luxury villas. Filter by price, location, and move-in availability."
      />

      <MainLayout.Header className="mt-4">
        <div className="flex items-center gap-4 flex-1">
          <MainLayout.Search placeholder="Search area, building, or city..." />
        </div>
        <MainLayout.Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => {
            const params = new URLSearchParams(searchParams);
            params.set("page", p.toString());
            setSearchParams(params);
          }}
        />
      </MainLayout.Header>

      <main className="mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Sidebar Filters */}
          <aside className="w-full lg:w-[300px] shrink-0 space-y-6">
            <Card className="p-6 border shadow-sm rounded-2xl bg-card">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-foreground">
                      Price Range
                    </label>
                    <span className="text-xs font-mono text-primary font-bold">
                      {formatCurrency(rentAmount)}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[500000]}
                    max={500000}
                    step={1000}
                    value={[rentAmount]}
                    onValueChange={(val) =>
                      updateParam("rentAmount", val[0].toString())
                    }
                  />
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <label className="text-sm font-bold text-foreground">
                    Availability
                  </label>
                  <Tabs
                    value={moveIn}
                    onValueChange={(val) => updateParam("moveIn", val)}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                      <TabsTrigger value="1day" className="text-xs">
                        1 Day
                      </TabsTrigger>
                      <TabsTrigger value="7day" className="text-xs">
                        7 Days
                      </TabsTrigger>
                      <TabsTrigger value="15day" className="text-xs">
                        15 Days
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <label className="text-sm font-bold text-foreground">
                    Preferred Location
                  </label>
                  <Select
                    value={location}
                    onValueChange={(val) =>
                      updateParam("location", val === "all" ? undefined : val)
                    }
                  >
                    <SelectTrigger className="w-full bg-muted/30 border-none shadow-none focus:ring-1">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="epsteinisland">
                        Epstein Island
                      </SelectItem>
                      <SelectItem value="jaipur">Jaipur</SelectItem>
                      <SelectItem value="patiala">Patiala</SelectItem>
                      <SelectItem value="chaicode">Chaicode HQ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <div className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/20 via-primary/5 to-transparent p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 border border-primary/20">
              <div className="absolute -right-8 -bottom-8 size-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
              <div className="relative space-y-4">
             
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">
                    Certified Expert
                  </h4>
                  <p className="text-[14px] text-foreground font-bold leading-tight italic">
                    "Still can't decide? Let's build your vision together. I'm
                    just one click away."
                  </p>
                </div>
                <Button
                  className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-md shadow-primary/20"
                  asChild
                >
                  <a
                    href="https://github.com/HimanshuTamoli24"
                    target="_blank"
                    rel="noopener"
                  >
                    Hire the Developer
                  </a>
                </Button>
              </div>
            </div>
          </aside>

          {/* Right Side: Property List Area */}
          <div className="flex-1 w-full min-w-0">
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
    </MainLayout>
  );
}
