import ErrorPage from "@/components/error-page";
import LoadingPage from "@/components/loading";
import { useLists } from "../hooks/list-hook";
import ListCard, { type ListingCardData } from "./component/list-card";
import TopNav from "./component/top-nav";
import FilterBar from "./component/filter-bar";

export default function ListPage() {
  const { data, isLoading, isError } = useLists();

  const lists: ListingCardData[] = data?.data || [];

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <TopNav />

      <main className="flex-1 px-4 py-8 md:px-8 max-w-[1600px] mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
          Find your dream apartment
        </h1>

        <div className="mb-8">
          <FilterBar />
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Side: Property Grid */}
          <div className="w-full xl:w-[60%] 2xl:w-[65%]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {lists.length === 0 ? (
                <div className="col-span-full rounded-2xl border bg-card p-12 text-center text-muted-foreground shadow-sm">
                  No listings available right now.
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

          {/* Right Side: Map */}
          <div className="hidden xl:block w-full xl:w-[40%] 2xl:w-[35%] relative">
            <div className="sticky top-[100px] h-[calc(100vh-140px)] w-full overflow-hidden rounded-[2rem] bg-muted/30 border shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200&h=1600"
                alt="Map view"
                className="h-full w-full object-cover opacity-60 grayscale-30 mix-blend-multiply"
              />

              {/* Map Pins / Markers to match the design style */}
              <div className="absolute top-[25%] left-[30%] flex h-6 w-6 items-center justify-center rounded-full bg-[#2563eb] shadow-lg ring-4 ring-white">
                <span className="h-2 w-2 rounded-full bg-white"></span>
              </div>
              <div className="absolute top-[40%] right-[30%] flex h-6 w-6 items-center justify-center rounded-full bg-[#2563eb] shadow-lg ring-4 ring-white">
                <span className="h-2 w-2 rounded-full bg-white"></span>
              </div>
              <div className="absolute bottom-[20%] left-[45%] flex h-6 w-6 items-center justify-center rounded-full bg-[#2563eb] shadow-lg ring-4 ring-white">
                <span className="h-2 w-2 rounded-full bg-white"></span>
              </div>
              <div className="absolute top-[60%] right-[55%] flex h-6 w-6 items-center justify-center rounded-full bg-[#2563eb] shadow-lg ring-4 ring-white">
                <span className="h-2 w-2 rounded-full bg-white"></span>
              </div>

              <div className="absolute inset-0 bg-linear-to-t from-background/40 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
