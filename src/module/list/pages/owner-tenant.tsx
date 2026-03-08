import {
  useMyVisits,
  useIncomingVisits,
  useUpdateVisitStatus,
  useScheduleVisit,
} from "../../visit/hooks/visit-hook";
import LoadingPage from "@/components/loading";
import ErrorPage from "@/components/error-page";
import MainLayout from "@/components/main-layout";
import { formatDate, formatTime } from "@/utils/format-date";
import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  User,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Home,
  MessageSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/context/state.context.tsx";
import SEO from "@/components/seo";

import { useSearchParams } from "react-router";

export default function OwnerTenant() {
  const { role } = useAuth();
  const isOwner = role === "OWNER" || role === "BIGBOSS" || role === "ADMIN";

  const {
    data: tenantData,
    isLoading: tenantLoading,
    isError: tenantError,
  } = useMyVisits({ enabled: !isOwner });
  const {
    data: ownerData,
    isLoading: ownerLoading,
    isError: ownerError,
  } = useIncomingVisits({ enabled: isOwner });

  const { mutateAsync: updateStatus } = useUpdateVisitStatus();
  const { mutateAsync: scheduleVisit, isPending: isScheduling } =
    useScheduleVisit();

  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    visit: any;
  }>({
    isOpen: false,
    visit: null,
  });

  const [scheduleModal, setScheduleModal] = useState<{
    isOpen: boolean;
    visitId: string;
  }>({
    isOpen: false,
    visitId: "",
  });

  const [scheduledDate, setScheduledDate] = useState("");
  const [notes, setNotes] = useState("");

  const isLoading = isOwner ? ownerLoading : tenantLoading;
  const isError = isOwner ? ownerError : tenantError;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");

  const rawVisits = useMemo(() => {
    let visits = isOwner ? ownerData?.data || [] : tenantData?.data || [];
    if (statusFilter) {
      visits = visits.filter((v: any) => v.status === statusFilter);
    }
    return visits;
  }, [isOwner, ownerData, tenantData, statusFilter]);

  const totalPages = Math.ceil(rawVisits.length / itemsPerPage);
  const paginatedVisits = useMemo(() => {
    return rawVisits.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [rawVisits, currentPage, itemsPerPage]);

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  const handleStatusUpdate = async (visitId: string, status: string) => {
    try {
      await updateStatus({ visitId, status });
      toast.success(`Status updated to ${status}`);
      if (detailModal.visit?._id === visitId) {
        setDetailModal({ ...detailModal, isOpen: false });
      }
    } catch (err) {}
  };

  const handleScheduleSubmit = async () => {
    if (!scheduleModal.visitId || !scheduledDate) return;
    try {
      await scheduleVisit({
        visitId: scheduleModal.visitId,
        scheduledDate: new Date(scheduledDate).toISOString(),
        notes,
      });
      setScheduleModal({ isOpen: false, visitId: "" });
      setDetailModal({ ...detailModal, isOpen: false });
      setScheduledDate("");
      setNotes("");
    } catch (err) {}
  };

  const statusConfig: Record<
    string,
    { color: string; label: string; icon: any }
  > = {
    PENDING: {
      color: "bg-yellow-100 text-yellow-700",
      label: "Requested",
      icon: AlertCircle,
    },
    SCHEDULED: {
      color: "bg-blue-100 text-blue-700",
      label: "Scheduled",
      icon: Clock,
    },
    APPROVED: {
      color: "bg-green-100 text-green-700",
      label: "Approved",
      icon: CheckCircle2,
    },
    REJECTED: {
      color: "bg-red-100 text-red-700",
      label: "Rejected",
      icon: XCircle,
    },
    VISITED: {
      color: "bg-indigo-100 text-indigo-700",
      label: "Visited",
      icon: CheckCircle2,
    },
    COMPLETED: {
      color: "bg-emerald-100 text-emerald-700",
      label: "Completed",
      icon: CheckCircle2,
    },
  };

  return (
    <MainLayout>
      <SEO
        title={isOwner ? "Flow Dashboard" : "My Tour Requests"}
        description="Coordinate visits and manage tenant-owner interactions in real-time."
      />
      <MainLayout.Title
        title={isOwner ? "Owner-Tenant Flow" : "My Tour Requests"}
        description={
          isOwner
            ? "Manage tenant requests and property visits for your listings."
            : "Track your tour requests and confirmed property schedules."
        }
        breadcrumb="Property Services"
      />
      <MainLayout.Header>
        <div className="flex items-center gap-4 flex-1">
          <MainLayout.StatusFilters
            options={[
              "PENDING",
              "SCHEDULED",
              "APPROVED",
              "REJECTED",
              "VISITED",
            ]}
          />
        </div>
        <MainLayout.Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </MainLayout.Header>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="size-5 text-primary" />
            Active Interactions ({rawVisits.length})
          </h2>
        </div>

        {rawVisits.length === 0 ? (
          <Card className="border-dashed border-2 py-20 text-center flex flex-col items-center">
            <User className="size-12 text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground">No active flows found.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedVisits.map((visit: any) => {
              const status = statusConfig[visit.status] || {
                color: "bg-gray-100 text-gray-600",
                label: visit.status,
                icon: AlertCircle,
              };
              const StatusIcon = status.icon;

              return (
                <Card
                  key={visit._id}
                  className="group relative overflow-hidden border shadow-sm bg-card hover:shadow-md transition-all cursor-pointer rounded-2xl"
                  onClick={() => setDetailModal({ isOpen: true, visit })}
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20" />
                  <div
                    className="absolute top-0 left-0 h-1.5 bg-primary transition-all duration-500"
                    style={{
                      width:
                        visit.status === "PENDING"
                          ? "25%"
                          : visit.status === "SCHEDULED"
                            ? "50%"
                            : "100%",
                    }}
                  />

                  <CardHeader className="pb-3 flex-row items-start justify-between">
                    <div className="space-y-1">
                      <Badge
                        className={`${status.color} border-none font-semibold flex items-center gap-1.5 w-fit`}
                      >
                        <StatusIcon className="size-3" />
                        {status.label}
                      </Badge>
                      <CardTitle className="text-lg line-clamp-1 mt-2">
                        {isOwner ? visit.tenant?.name : visit.listing?.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 text-xs">
                        {isOwner ? (
                          <>
                            <Home className="size-3" /> {visit.listing?.title}
                          </>
                        ) : (
                          <>
                            <MapPin className="size-3" />{" "}
                            {visit.listing?.location}
                          </>
                        )}
                      </CardDescription>
                    </div>
                    {isOwner && visit.status === "PENDING" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              setScheduleModal({
                                isOpen: true,
                                visitId: visit._id,
                              })
                            }
                          >
                            Schedule Visit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() =>
                              handleStatusUpdate(visit._id, "REJECTED")
                            }
                          >
                            Reject Request
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border text-sm">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                          Date Invited
                        </span>
                        <span className="font-semibold">
                          {formatDate(visit.requestedDate || Date.now())}
                        </span>
                      </div>
                      <div className="h-8 w-px bg-muted-foreground/10" />
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                          Confirmed
                        </span>
                        <span className="font-semibold text-primary">
                          {visit.scheduledDate
                            ? formatTime(visit.scheduledDate)
                            : "TBD"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog
        open={detailModal.isOpen}
        onOpenChange={(open) =>
          !open && setDetailModal({ isOpen: false, visit: null })
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Flow Details</DialogTitle>
            <DialogDescription>
              Interaction details between owner and tenant.
            </DialogDescription>
          </DialogHeader>

          {detailModal.visit && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <User className="size-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">
                    {isOwner
                      ? detailModal.visit.tenant?.name
                      : "Property Owner"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isOwner
                      ? detailModal.visit.tenant?.email
                      : "Details confidential"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Status
                  </p>
                  <p className="font-semibold flex items-center gap-1.5">
                    <span
                      className={`size-2 rounded-full ${statusConfig[detailModal.visit.status]?.color.split(" ")[0] || "bg-gray-400"}`}
                    />
                    {detailModal.visit.status}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Meeting Time
                  </p>
                  <p className="font-semibold text-primary flex items-center gap-1.5">
                    <Clock className="size-4" />
                    {detailModal.visit.scheduledDate
                      ? formatDate(detailModal.visit.scheduledDate, "MMM d, p")
                      : "Not Set"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-bold flex items-center gap-2">
                  <Home className="size-4 text-primary" /> Property Information
                </h5>
                <div className="p-4 rounded-xl border bg-card">
                  <p className="font-semibold">
                    {detailModal.visit.listing?.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {detailModal.visit.listing?.location}
                  </p>
                </div>
              </div>

              {detailModal.visit.notes && (
                <div className="space-y-2">
                  <h5 className="text-sm font-bold">Additional Notes</h5>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 italic text-sm">
                    "{detailModal.visit.notes}"
                  </div>
                </div>
              )}

              {detailModal.visit.decision && (
                <div
                  className={`p-4 rounded-xl border flex items-center gap-3 ${detailModal.visit.decision === "YES" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                >
                  {detailModal.visit.decision === "YES" ? (
                    <CheckCircle2 className="size-5 text-green-600" />
                  ) : (
                    <XCircle className="size-5 text-red-500" />
                  )}
                  <div>
                    <p className="text-xs font-bold uppercase">
                      Final Tenant Decision
                    </p>
                    <p className="font-bold">
                      {detailModal.visit.decision === "YES"
                        ? "Accepted - Move In Request"
                        : "Passed - Not Interested"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="sm:justify-start">
            {isOwner && detailModal.visit?.status === "PENDING" && (
              <Button
                className="w-full bg-primary"
                onClick={() =>
                  setScheduleModal({
                    isOpen: true,
                    visitId: detailModal.visit._id,
                  })
                }
              >
                Schedule Visit Now
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setDetailModal({ isOpen: false, visit: null })}
            >
              Close Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Modal */}
      <Dialog
        open={scheduleModal.isOpen}
        onOpenChange={(open) =>
          !open && setScheduleModal({ isOpen: false, visitId: "" })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Schedule Time</DialogTitle>
            <DialogDescription>
              Confirm a time for the property tour.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Visit Date & Time</Label>
              <Input
                id="date"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="msg">Message for Tenant</Label>
              <Textarea
                id="msg"
                placeholder="Where to meet? Slot number? ID required?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setScheduleModal({ isOpen: false, visitId: "" })}
            >
              Cancel
            </Button>
            <Button disabled={isScheduling} onClick={handleScheduleSubmit}>
              Confirm Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
