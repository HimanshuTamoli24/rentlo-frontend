import { useState } from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router";
import { formatCurrency } from "@/utils/format-currency";
import { CalendarDays } from "lucide-react";
import { formatDate } from "@/utils/format-date";
import { Facehash } from "facehash";

import image1 from "@/assets/property/1.png";
import image2 from "@/assets/property/2.png";
import image3 from "@/assets/property/3.png";
import image4 from "@/assets/property/4.png";
import image5 from "@/assets/property/5.png";
import image6 from "@/assets/property/6.png";

const propertyImages = [image1, image2, image3, image4, image5, image6];

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
  const [imgError, setImgError] = useState(false);

  // Deterministic random image based on ID or title
  const idStr = listing._id || listing.id || listing.title || "";
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const imgSeed = Math.abs(hash) % propertyImages.length;
  const imageUrl = propertyImages[imgSeed];

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
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Facehash
              name={listing.title + (listing._id || listing.id || "")}
              size={300}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`Exterior of ${listing.title}`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
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
