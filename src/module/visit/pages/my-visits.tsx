import {
  useMyVisits,
  useIncomingVisits,
  useMarkAsVisited,
  useMakeDecision,
  useUpdateVisitStatus,
  useScheduleVisit,
} from "../hooks/visit-hook";
import LoadingPage from "@/components/loading";
import ErrorPage from "@/components/error-page";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
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
import MainLayout from "@/components/main-layout";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  History,
  User,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/utils/format-date";
import { useAuth } from "@/context/state.context.tsx";

export default function MyVisitsPage() {
  const { role } = useAuth();
  const isOwner = role === "OWNER" || role === "BIGBOSS";

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

  const { mutateAsync: markVisited, isPending: isMarking } = useMarkAsVisited();
  const { mutateAsync: makeDecision, isPending: isDeciding } =
    useMakeDecision();
  const { mutateAsync: updateStatus } = useUpdateVisitStatus();
  const { mutateAsync: scheduleVisit, isPending: isScheduling } =
    useScheduleVisit();

  const [decisionModal, setDecisionModal] = useState<{
    isOpen: boolean;
    visitId: string;
    decision: "YES" | "NO" | null;
  }>({
    isOpen: false,
    visitId: "",
    decision: null,
  });

  const [scheduleModal, setScheduleModal] = useState<{
    isOpen: boolean;
    visitId: string;
  }>({
    isOpen: false,
    visitId: "",
  });

  const [notes, setNotes] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const isLoading = isOwner ? ownerLoading : tenantLoading;
  const isError = isOwner ? ownerError : tenantError;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const rawVisits = useMemo(() => {
    return isOwner ? ownerData?.data || [] : tenantData?.data || [];
  }, [isOwner, ownerData, tenantData]);

  const totalPages = Math.ceil(rawVisits.length / itemsPerPage);
  const paginatedVisits = useMemo(() => {
    return rawVisits.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [rawVisits, currentPage, itemsPerPage]);

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  const handleDecisionSubmit = async () => {
    if (!decisionModal.visitId || !decisionModal.decision) return;
    try {
      await makeDecision({
        visitId: decisionModal.visitId,
        payload: { decision: decisionModal.decision, notes },
      });
      setDecisionModal({ isOpen: false, visitId: "", decision: null });
      setNotes("");
    } catch (err) {}
  };

  const handleScheduleSubmit = async () => {
    if (!scheduleModal.visitId || !scheduledDate) {
      toast.error("Please select a date and time");
      return;
    }
    try {
      await scheduleVisit({
        visitId: scheduleModal.visitId,
        scheduledDate: new Date(scheduledDate).toISOString(),
        notes,
      });
      setScheduleModal({ isOpen: false, visitId: "" });
      setScheduledDate("");
      setNotes("");
    } catch (err) {}
  };

  const handleStatusUpdate = async (visitId: string, status: string) => {
    try {
      await updateStatus({ visitId, status });
    } catch (err) {}
  };

  const statusConfig: Record<string, { color: string; label: string }> = {
    PENDING: {
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      label: "Requested",
    },
    SCHEDULED: {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      label: "Scheduled",
    },
    APPROVED: {
      color: "bg-green-100 text-green-700 border-green-200",
      label: "Accepted",
    },
    REJECTED: {
      color: "bg-red-100 text-red-700 border-red-200",
      label: "Rejected",
    },
    VISITED: {
      color: "bg-purple-100 text-purple-700 border-purple-200",
      label: "Visited",
    },
  };

  return (
    <MainLayout>
      <MainLayout.Title
        title={isOwner ? "Visit Requests" : "My Scheduled Visits"}
        description={
          isOwner
            ? "Manage incoming visit requests from potential tenants."
            : "Track your upcoming property tours and viewing history."
        }
      />
      <MainLayout.Header className="mt-4">
        <div /> {/* Spacer */}
        <MainLayout.Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </MainLayout.Header>
      <div className="flex flex-col gap-6">
        {rawVisits.length === 0 ? (
          <Card className="border-dashed border-2 py-20 flex flex-col items-center justify-center text-center">
            <History className="size-12 text-muted-foreground/20 mb-4" />
            <CardTitle className="text-muted-foreground">
              No visits found
            </CardTitle>
            <CardDescription>
              {isOwner
                ? "You haven't received any visit requests on your properties yet."
                : "You haven't requested any property visits yet."}
            </CardDescription>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedVisits.map((visit: any) => {
              const status = statusConfig[visit.status] || {
                color: "bg-gray-100 text-gray-700",
                label: visit.status,
              };

              return (
                <Card
                  key={visit._id}
                  className="group overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <CardHeader className="p-0">
                    <div className="relative aspect-video w-full bg-muted overflow-hidden">
                      <img
                        src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400`}
                        alt="Property"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge
                          className={`${status.color} border shadow-sm font-semibold`}
                        >
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg line-clamp-1 flex items-center gap-2">
                        <Home className="size-4 text-primary" />
                        {visit.listing?.title}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3" />
                        {visit.listing?.location}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/30 border space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="size-4 text-muted-foreground/60" />
                          <span className="font-medium text-xs uppercase tracking-wider">
                            {isOwner ? "Tenant" : "Owner"}
                          </span>
                        </div>
                        <span className="font-semibold text-foreground">
                          {isOwner
                            ? visit.tenant?.name
                            : visit.owner?.name || "Property Owner"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="size-4 text-muted-foreground/60" />
                          <span className="font-medium text-xs uppercase tracking-wider">
                            Requested
                          </span>
                        </div>
                        <span className="font-medium">
                          {visit.requestedDate
                            ? formatDate(visit.requestedDate)
                            : "Anytime"}
                        </span>
                      </div>

                      {visit.scheduledDate && (
                        <div className="flex items-center justify-between text-sm bg-primary/5 p-2 rounded-lg border border-primary/10">
                          <div className="flex items-center gap-2 text-primary font-semibold">
                            <Clock className="size-4" />
                            <span className="text-xs uppercase tracking-wider">
                              Confirmed Time
                            </span>
                          </div>
                          <span className="font-bold text-primary">
                            {formatDate(visit.scheduledDate, "MMM d, p")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {isOwner ? (
                        // Owner Actions
                        <>
                          {visit.status === "PENDING" && (
                            <>
                              <Button
                                className="flex-1 bg-green-600 hover:bg-green-700 shadow-md shadow-green-200"
                                onClick={() =>
                                  setScheduleModal({
                                    isOpen: true,
                                    visitId: visit._id,
                                  })
                                }
                              >
                                Schedule
                              </Button>
                              <Button
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() =>
                                  handleStatusUpdate(visit._id, "REJECTED")
                                }
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {visit.status === "SCHEDULED" && (
                            <Button
                              variant="outline"
                              className="w-full border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                              onClick={() =>
                                handleStatusUpdate(visit._id, "VISITED")
                              }
                            >
                              Mark as Visited
                            </Button>
                          )}
                        </>
                      ) : (
                        // Tenant Actions
                        <>
                          {visit.status === "SCHEDULED" && (
                            <Button
                              className="w-full bg-primary"
                              onClick={() => markVisited(visit._id)}
                              disabled={isMarking}
                            >
                              I Have Visited
                            </Button>
                          )}
                          {visit.status === "VISITED" && !visit.decision && (
                            <div className="flex flex-col w-full gap-2">
                              <p className="text-xs font-bold text-center text-primary italic mb-1 uppercase tracking-tighter">
                                Your Decision Matters! ⭐
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  variant="outline"
                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                  onClick={() =>
                                    setDecisionModal({
                                      isOpen: true,
                                      visitId: visit._id,
                                      decision: "NO",
                                    })
                                  }
                                >
                                  Not for me
                                </Button>
                                <Button
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() =>
                                    setDecisionModal({
                                      isOpen: true,
                                      visitId: visit._id,
                                      decision: "YES",
                                    })
                                  }
                                >
                                  Accept & Rent!
                                </Button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {visit.decision && (
                      <div
                        className={`mt-3 p-3 rounded-lg border flex items-center gap-3 ${visit.decision === "YES" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
                      >
                        {visit.decision === "YES" ? (
                          <CheckCircle2 className="size-5 shrink-0" />
                        ) : (
                          <XCircle className="size-5 shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-xs font-bold uppercase tracking-wider">
                            Tenant Decision
                          </p>
                          <p className="text-sm font-semibold">
                            {visit.decision === "YES"
                              ? "Wants to move in!"
                              : "Decided to pass"}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Schedule Modal (Owner) */}
      <Dialog
        open={scheduleModal.isOpen}
        onOpenChange={(open) =>
          !open && setScheduleModal({ isOpen: false, visitId: "" })
        }
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Visit Schedule</DialogTitle>
            <DialogDescription>
              Choose a date and time that works for the property tour.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Scheduled Date & Time</Label>
              <Input
                id="date"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner-notes">Message to Tenant (Optional)</Label>
              <Textarea
                id="owner-notes"
                placeholder="Bring your ID card or park in slot #4..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
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
              Confirm & Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decision Modal (Tenant) */}
      <Dialog
        open={decisionModal.isOpen}
        onOpenChange={(open) =>
          !open && setDecisionModal({ ...decisionModal, isOpen: false })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {decisionModal.decision === "YES" ? (
                <>
                  <CheckCircle2 className="text-green-600" /> Great! You want
                  this home
                </>
              ) : (
                <>
                  <XCircle className="text-red-500" /> Mark as Not Interested
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {decisionModal.decision === "YES"
                ? "Excellent choice! We'll notify the owner. You can add a quick message about your move-in preference below."
                : "It's okay! We'll help you find something better. Any feedback for the owner helps."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Leave an optional note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDecisionModal({ ...decisionModal, isOpen: false })
              }
            >
              Cancel
            </Button>
            <Button
              disabled={isDeciding}
              onClick={handleDecisionSubmit}
              className={
                decisionModal.decision === "NO"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {isDeciding ? "Processing..." : "Submit Decision"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
