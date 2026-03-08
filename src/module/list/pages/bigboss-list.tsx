import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis } from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { AlertCircle, Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminLists,
  useAcceptListing,
  useRejectListing,
} from "../hooks/list-hook";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import MainLayout from "@/components/main-layout";
import SEO from "@/components/seo";

export default function BigBossListPage() {
  const navigate = useNavigate();
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
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (isLoading) return <MainLayout.Loading />;
  if (isError) return <MainLayout.Error />;

  const listings = data?.data || [];

  // Calculate Stats
  const stats = {
    approved: listings.filter((l: any) => l.status === "APPROVED").length,
    rejected: listings.filter((l: any) => l.status === "REJECTED").length,
    draft: listings.filter((l: any) => l.status === "DRAFT").length,
    total: listings.length,
  };

  const filteredListings = listings.filter((l: any) => {
    if (!statusFilter) return true;
    return l.status === statusFilter;
  });

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const chartData = [
    { status: "Approved", count: stats.approved },
    { status: "Draft", count: stats.draft },
    { status: "Rejected", count: stats.rejected },
  ];

  const chartConfig = {
    count: { label: "Count", color: "hsl(var(--primary))" },
  } satisfies ChartConfig;

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
      case "APPROVED":
        return (
          <div className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
            <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500" />
            Approved
          </div>
        );
      case "DRAFT":
        return (
          <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            <div className="mr-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
            Draft
          </div>
        );
      case "REJECTED":
        return (
          <div className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
            <div className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500" />
            Rejected
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
            <div className="mr-2 h-1.5 w-1.5 rounded-full bg-gray-500" />
            {status}
          </div>
        );
    }
  };

  return (
    <>
      <SEO
        title="Admin Control Center"
        description="Oversee the entire Rentlo ecosystem. Monitor interactions, approve listings, and analyze platform health scripts."
      />
      <MainLayout>
        <MainLayout.Title
          title="Property Lists"
          // breadcrumb="Admin Panel"
          description={`${stats.total} listings total in the system.`}
          actions={
            <Button
              onClick={() => navigate("/listings/create")}
              className="gap-2 text-white font-bold rounded-xl"
            >
              <Plus className="size-4" />
              Create Listing
            </Button>
          }
        />

        <MainLayout.Header>
          <MainLayout.StatusFilters
            options={["DRAFT", "REJECTED", "APPROVED"]}
          />
          <MainLayout.Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLimit={false}
          />
        </MainLayout.Header>
        <Card className="border shadow-sm rounded-xl  h-fit overflow-hidden  bg -card">
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <Table className="table-fixed w-full">
                <TableHeader className="bg-muted">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-6 font-semibold text-muted-foreground w-[350px]">
                      Property
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground w-[150px]">
                      Location
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground w-[120px]">
                      Rent
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground w-[180px]">
                      Status
                    </TableHead>
                    <TableHead className="px-6 text-right font-semibold text-muted-foreground w-[180px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedListings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No listings found for this category.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedListings.map((listing: any) => {
                      const id = listing.id || listing._id;
                      return (
                        <TableRow
                          key={id}
                          className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <TableCell className="align-top relative max-w-[300px] px-6 overflow-hidden">
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              <AccordionItem
                                value="description"
                                className="border-b-0"
                              >
                                <AccordionTrigger className="py-2 hover:no-underline justify-start gap-2 data-[state=open]:text-primary text-left">
                                  <span className="font-semibold line-clamp-1 break-all w-full leading-tight">
                                    {listing.title}
                                  </span>
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground pt-1 pb-3 leading-relaxed wrap-break-word overflow-hidden w-full">
                                  {listing.description}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                            {listing.status === "DRAFT" &&
                              listing.rejectionReason && (
                                <div className="mt-2 rounded-md bg-red-50 p-2 text-xs text-red-800 flex items-start gap-1">
                                  <AlertCircle className="size-3 mt-0.5 shrink-0" />
                                  <span>Reason: {listing.rejectionReason}</span>
                                </div>
                              )}
                          </TableCell>
                          <TableCell className="align-top pt-4 max-w-[100px]">
                            <div
                              className="line-clamp-1 truncate text-muted-foreground"
                              title={listing.location}
                            >
                              {listing.location}
                            </div>
                          </TableCell>
                          <TableCell className="align-top pt-4 font-medium text-foreground">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            }).format(listing.rentAmount)}
                          </TableCell>
                          <TableCell className="align-top pt-4">
                            {getStatusBadge(listing.status)}
                          </TableCell>
                          <TableCell className="text-right align-top pt-3 px-6">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-300 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                                onClick={() => handleAccept(id)}
                                disabled={
                                  isAccepting || listing.status !== "DRAFT"
                                }
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700"
                                onClick={() => openRejectModal(id)}
                                disabled={
                                  isRejecting || listing.status !== "DRAFT"
                                }
                              >
                                Reject
                              </Button>
                            </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 p-6 border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Listing Overview</h3>
              <span className="text-xs text-muted-foreground">
                Volume in units
              </span>
            </div>
            <div className="h-[240px] w-full">
              <ChartContainer
                config={chartConfig}
                className="w-full h-full min-h-[240px]"
              >
                <RadarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <PolarGrid
                    stroke="hsl(var(--muted-foreground))"
                    strokeOpacity={0.2}
                  />
                  <PolarAngleAxis
                    dataKey="status"
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  />
                  <Radar
                    dataKey="count"
                    stroke="var(--color-count)"
                    fill="var(--color-count)"
                    fillOpacity={0.5}
                    dot={{ r: 4, fill: "var(--color-count)" }}
                  />
                </RadarChart>
              </ChartContainer>
            </div>
          </Card>

          <Card className="p-6 border shadow-sm flex flex-col items-center justify-center space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Admin Status</p>
              <h4 className="text-xl font-bold">Health Score</h4>
            </div>
            <div className="relative size-32 flex items-center justify-center">
              <svg className="size-full" viewBox="0 0 36 36">
                <path
                  className="text-muted fill-none stroke-current"
                  strokeWidth="3"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary fill-none stroke-current"
                  strokeWidth="3"
                  strokeDasharray={`${Math.round((stats.approved / stats.total) * 100) || 0}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xl font-bold">
                {Math.round((stats.approved / (stats.total || 1)) * 100)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Percentage of properties approved
            </p>
          </Card>
        </div>
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
              <Button
                variant="outline"
                onClick={() => setRejectModalOpen(false)}
              >
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
      </MainLayout>
    </>
  );
}
