import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminLists,
  useAcceptListing,
  useRejectListing,
} from "../hooks/list-hook";
import LoadingPage from "@/components/loading";
import ErrorPage from "@/components/error-page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminListPage() {
  const { data, isLoading, isError } = useAdminLists();
  const { mutateAsync: acceptListing, isPending: isAccepting } =
    useAcceptListing();
  const { mutateAsync: rejectListing, isPending: isRejecting } =
    useRejectListing();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState("");

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  const listings = data?.data || [];

  const handleAccept = async (id: string) => {
    try {
      await acceptListing(id);
      toast.success("Listing approved successfully");
    } catch (err) {
      toast.error("Failed to approve listing");
    }
  };

  const openRejectModal = (id: string) => {
    setSelectedListingId(id);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!selectedListingId) return;
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await rejectListing({
        listId: selectedListingId,
        payload: { reason: rejectReason },
      });
      toast.success("Listing rejected successfully");
      setRejectModalOpen(false);
    } catch (err) {
      toast.error("Failed to reject listing");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-500/20">
            <CheckCircle2 className="mr-1 size-3" /> Published
          </Badge>
        );
      case "REVIEW":
        return (
          <Badge className="bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25 border-yellow-500/20">
            <Clock className="mr-1 size-3" /> Under Review
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge variant="secondary" className="text-muted-foreground">
            Draft
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Manage, approve, or reject property listings.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Listings</CardTitle>
          <CardDescription>
            {listings.length} total properties found in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No listings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  listings.map((listing: any) => {
                    const id = listing.id || listing._id;
                    return (
                      <TableRow key={id}>
                        <TableCell>
                          <div className="font-medium">{listing.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">
                            {listing.description}
                          </div>
                          {listing.status === "DRAFT" &&
                            listing.rejectionReason && (
                              <div className="mt-2 rounded-md bg-red-50 p-2 text-xs text-red-800 flex items-start gap-1">
                                <AlertCircle className="size-3 mt-0.5 shrink-0" />
                                <span>Reason: {listing.rejectionReason}</span>
                              </div>
                            )}
                        </TableCell>
                        <TableCell>{listing.location}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          }).format(listing.rentAmount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(listing.status)}</TableCell>
                        <TableCell className="text-right">
                          {listing.status === "REVIEW" && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                                onClick={() => handleAccept(id)}
                                disabled={isAccepting}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openRejectModal(id)}
                                disabled={isRejecting}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Listing</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this listing. The creator
              will see this reason allowing them to fix the issues.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reason" className="text-right">
              Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="e.g. The images provided are too low quality..."
              className="mt-2 min-h-[100px]"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
