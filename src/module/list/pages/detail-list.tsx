import { useParams, useNavigate } from "react-router";
import { useList } from "../hooks/list-hook";
import LoadingPage from "@/components/loading";
import ErrorPage from "@/components/error-page";
import TopNav from "./component/top-nav";
import SEO from "@/components/seo";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  MapPin,
  Check,
  FileWarning,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/state.context.tsx";
import { useRequestVisit } from "../../visit/hooks/visit-hook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/utils/format-date";
import { formatCurrency } from "@/utils/format-currency";
import { cn } from "@/lib/utils";
import { confirm } from "@/components/alert-box";

import { Facehash } from "facehash";
import image1 from "@/assets/property/1.png";
import image2 from "@/assets/property/2.png";
import image3 from "@/assets/property/3.png";
import image4 from "@/assets/property/4.png";
import image5 from "@/assets/property/5.png";
import image6 from "@/assets/property/6.png";

const propertyImages = [image1, image2, image3, image4, image5, image6];

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const { data, isLoading, isError } = useList(id || "");
  const { mutateAsync: requestVisit, isPending } = useRequestVisit();

  const [visitModal, setVisitModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (isLoading) return <LoadingPage />;
  if (isError || !data?.data) return <ErrorPage />;

  const listing = data.data;

  const isLoggedIn = isAuth;

  const handleRequestVisit = async () => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }

    const ok = await confirm.create({
      title: "Request Visit",
      message: "Are you sure you want to request a visit for this property?",
      confirmText: "Request Tour",
    });
    if (!ok) return;

    await requestVisit({
      listingId: listing._id || listing.id,
      notes,
    });

    setIsSubmitted(true);
    setVisitModal(false);
    setNotes("");
  };

  const detailSchema = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: listing.title,
    description: listing.description,
    image: propertyImages[(listing.rentAmount || 0) % propertyImages.length],
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.location,
    },
    offers: {
      "@type": "Offer",
      price: listing.rentAmount,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <SEO
        title={listing.title}
        description={
          listing.description ||
          "View details for this premium property on Rentlo."
        }
        schema={detailSchema}
      />
      <TopNav />
      <main className="flex-1 px-4 py-8 md:px-8 max-w-[1200px] mx-auto w-full">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-4 hover:bg-transparent text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Visual Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="aspect-video w-full rounded-3xl overflow-hidden bg-muted relative flex items-center justify-center">
              {imgError ? (
                <Facehash
                  name={listing.title + (listing._id || listing.id || "")}
                  size={600}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={
                    propertyImages[
                      (listing.rentAmount || 0) % propertyImages.length
                    ]
                  }
                  alt={listing.title}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2 text-primary font-medium">
                <MapPin className="h-4 w-4" />
                <span>{listing.location}</span>
                {listing.status === "PUBLISHED" && !isSubmitted && (
                  <span className="ml-auto bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    Published
                  </span>
                )}
                {isSubmitted && (
                  <span className="ml-auto bg-primary/10 text-primary text-xs px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                    SUBMITTED
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                {listing.title}
              </h1>

              <p className="text-muted-foreground leading-relaxed text-lg">
                {listing.description ||
                  "A beautiful property available for rent. Come discover modern amenities and comfortable living spaces designed for your lifestyle."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
              <div>
                <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                <ul className="space-y-3">
                  {listing.amenities?.length ? (
                    listing.amenities.map((amenity: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <span>{amenity}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground italic">
                      None specified
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Rules & Guidelines
                </h3>
                <ul className="space-y-3">
                  {listing.rules?.length ? (
                    listing.rules.map((rule: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <FileWarning className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground italic">
                      None specified
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Sidebar Booking Context */}
          <div className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border bg-card p-6 shadow-sm">
              <div className="mb-6">
                <span className="text-3xl font-bold">
                  {formatCurrency(listing.rentAmount || 5000)}
                </span>
                <span className="text-muted-foreground"> / month</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <span className="font-medium">Available From</span>
                  </div>
                  <span className="font-semibold">
                    {listing.availableFrom
                      ? formatDate(listing.availableFrom, "MMM do, yyyy")
                      : "Immediately"}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setVisitModal(true)}
                disabled={isSubmitted}
                className={cn(
                  "w-full h-12 text-base rounded-2xl group",
                  isSubmitted && "bg-muted text-muted-foreground",
                )}
              >
                {isSubmitted ? "Request Submitted" : "Request a Visit"}
                {!isSubmitted && (
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={visitModal} onOpenChange={setVisitModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request a Property Tour</DialogTitle>
            <DialogDescription>
              Let the owner know you're interested. You can optionally include
              notes about your availability or ask questions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Message to Owner (Optional)
              </label>
              <Textarea
                placeholder="Hi! I'm interested in viewing this property in the upcoming week..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVisitModal(false)}>
              Cancel
            </Button>
            <Button disabled={isPending} onClick={handleRequestVisit}>
              {isPending ? "Submitting..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
