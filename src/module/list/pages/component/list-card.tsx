import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router";

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

import { formatCurrency } from "@/utils/format-currency";

export default function ListCard({ listing }: ListCardProps) {
  const navigate = useNavigate();

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
  const imageUrl = `https://images.unsplash.com/${imageIds[imgSeed % imageIds.length]}?auto=format&fit=crop&q=80&w=800&h=600`;

  // Mocks based on description length for variety since original model lacks beds/baths
  const beds = Math.max(1, Math.ceil(listing.description?.length / 50 || 1));
  const baths = Math.max(1, Math.ceil(listing.description?.length / 100 || 1));
  const sqft = listing.rentAmount * 1.5;

  return (
    <div
      onClick={() => navigate(`/property/${listing._id || listing.id}`)}
      className="group flex cursor-pointer flex-col gap-3"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-muted">
        <img
          src={imageUrl}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {listing.status === "PUBLISHED" && (
          <div className="absolute left-4 top-4">
            <Badge
              variant="secondary"
              className="bg-white/95 text-black hover:bg-white backdrop-blur-sm font-medium shadow-sm"
            >
              Ready to move
            </Badge>
          </div>
        )}
      </div>
      <div className="space-y-1.5 px-1 relative">
        <h3 className="text-2xl font-bold tracking-tight text-foreground">
          {formatCurrency(listing.rentAmount)}
        </h3>
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{listing.location}</span>
        </div>
        <div className="text-sm font-medium text-muted-foreground pt-1 flex items-center gap-1.5">
          <span>{beds} beds</span>
          <span className="text-muted-foreground/40">•</span>
          <span>{baths} baths</span>
          <span className="text-muted-foreground/40">•</span>
          <span>{sqft.toLocaleString()} sqft</span>
        </div>
      </div>
    </div>
  );
}
