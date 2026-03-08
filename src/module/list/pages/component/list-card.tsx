import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Link } from "react-router";
import { formatCurrency } from "@/utils/format-currency";
import { CalendarDays } from "lucide-react";
import { formatDate } from "@/utils/format-date";

export type ListingCardData = {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  location: string;
  rentAmount: number;
  amenities?: string[];
  rules?: string[];
  availableFrom?: string | Date;
  status?: "DRAFT" | "REVIEW" | "PUBLISHED" | string;
};

type ListCardProps = {
  listing: ListingCardData;
};

export default function ListCard({ listing }: ListCardProps) {
  // Deterministic random image based on rentAmount or title length
  const imgSeed = (listing.rentAmount % 10) + 1;
  const imageIds = [
    "photo-1600596542815-ffad4c1539a9",
    "photo-1512917774080-9991f1c4c750",
    "photo-1600607687920-4e2a09c15468",
    "photo-1600585154340-be6161a56a0c",
    "photo-1600566753190-17f0baa2a6c3",
    "photo-1518780664697-55e3ad937233",
    "photo-1513584684374-8bab748fbf90",
    "photo-1583608205776-bfd35f0d9f83",
    "photo-1502672260266-1c1de2d966ca",
    "photo-1598228723793-52759bba239c",
  ];
  const imageUrl = `https://images.unsplash.com/${
    imageIds[imgSeed % imageIds.length]
  }?auto=format&fit=crop&q=80&w=800&h=600`;

  // Deterministic but "random-looking" stats based on ID or title
  const seed =
    (listing.id || listing._id || "default").length +
    (listing.rentAmount % 100);
  const beds = (seed % 4) + 1; // 1-5 beds
  const baths = (seed % 3) + 1; // 1-4 baths
  const sqft = 400 + ((seed * 15) % 1500); // 400-1900 sqft

  const moveInDate = listing.availableFrom
    ? formatDate(listing.availableFrom, "MMM dd")
    : "Immediate";

  return (
    <Link
      to={`/property/${listing._id || listing.id}`}
      aria-label={`View details for ${listing.title} in ${listing.location}`}
      className="group flex flex-col gap-3 bg-muted p-2 rounded-md transition-all hover:bg-muted/80"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-muted">
        <img
          src={imageUrl}
          alt={`Exterior of ${listing.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-1.5 px-1 relative bg-white/65 rounded-sm p-2">
        <h3 className="text-sm font-semibold text-foreground truncate">
          {listing.title}
        </h3>
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {formatCurrency(listing.rentAmount)}
        </p>
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{listing.location}</span>
        </div>
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground pt-1">
          <div className="flex gap-2">
            <span>{beds} beds</span>
            <span>{baths} baths</span>
            <span>{sqft} sqft</span>
          </div>
          <div className="flex items-center gap-1 text-primary/80 font-bold">
            <CalendarDays className="size-3" />
            <span>{moveInDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
