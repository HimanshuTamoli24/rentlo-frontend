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
  MessageSquare,
  ChevronRight,
  Check,
  Eye,
} from "lucide-react";
import img1 from "@/assets/property/1.png";
import img2 from "@/assets/property/2.png";
import img3 from "@/assets/property/3.png";
import img4 from "@/assets/property/4.png";
import img5 from "@/assets/property/5.png";
import img6 from "@/assets/property/6.png";

const propertyImages = [img1, img2, img3, img4, img5, img6];
import { Facehash } from "facehash";
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
import { confirm } from "@/components/alert-box";

const VISIT_FLOW = [
  { id: "PENDING", label: "Requested", step: 1 },
  { id: "SCHEDULED", label: "Scheduled", step: 2 },
  { id: "VISITED", label: "Visited", step: 3 },
  { id: "DECISION", label: "Decision", step: 4 }, // Maps to COMPLETED/APPROVED/REJECTED
];

const getStatusStep = (status: string) => {
  switch (status) {
    case "PENDING":
      return 1;
    case "SCHEDULED":
      return 2;
    case "VISITED":
      return 3;
    case "COMPLETED":
    case "APPROVED":
    case "REJECTED":
      return 4;
    default:
      return 1;
  }
};

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

  const [searchParams, setSearchParams] = useSearchParams();
  const activeFlowStep = searchParams.get("flow") || "Requested";

  const rawVisits = useMemo(() => {
    let visits = isOwner ? ownerData?.data || [] : tenantData?.data || [];
    if (activeFlowStep) {
      visits = visits.filter((v: any) => {
        const stepNum = getStatusStep(v.status);
        const flowObj = VISIT_FLOW.find((f) => f.label === activeFlowStep);
        return flowObj ? stepNum === flowObj.step : true;
      });
    }
    return visits;
  }, [isOwner, ownerData, tenantData, activeFlowStep]);

  const totalPages = Math.ceil(rawVisits.length / itemsPerPage);
  const paginatedVisits = useMemo(() => {
    return rawVisits.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [rawVisits, currentPage, itemsPerPage]);

  const hashId = (id: string) => {
    if (!id) return 0;
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  const handleStatusUpdate = async (visitId: string, status: string) => {
    try {
      const ok = await confirm.update({
        message: `Are you sure you want to update the status to ${status}?`,
      });
      if (!ok) return;

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
      const ok = await confirm.update({
        message: "Are you sure you want to schedule this visit?",
        confirmText: "Schedule",
      });
      if (!ok) return;

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
      color: "bg-amber-100 text-amber-700 border-amber-200",
      label: "Requested",
      icon: AlertCircle,
    },
    SCHEDULED: {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      label: "Scheduled",
      icon: Clock,
    },
    APPROVED: {
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      label: "Approved",
      icon: CheckCircle2,
    },
    REJECTED: {
      color: "bg-rose-100 text-rose-700 border-rose-200",
      label: "Rejected",
      icon: XCircle,
    },
    VISITED: {
      color: "bg-violet-100 text-violet-700 border-violet-200",
      label: "Visited",
      icon: Eye,
    },
    COMPLETED: {
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      label: "Completed",
      icon: CheckCircle2,
    },
  };

  const FlowFilter = () => (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center min-w-max gap-1 bg-muted/30 p-1 rounded-2xl border">
        {VISIT_FLOW.map((step, idx) => {
          const isActive = activeFlowStep === step.label;
          return (
            <div key={step.label} className="flex items-center">
              <button
                onClick={() => {
                  setSearchParams({ flow: step.label });
                  setCurrentPage(1);
                }}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-background shadow-sm text-primary ring-1 ring-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div
                  className={`size-5 rounded-full flex items-center justify-center text-[10px] ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.step}
                </div>
                {step.label}
              </button>
              {idx < VISIT_FLOW.length - 1 && (
                <ChevronRight className="size-4 text-muted-foreground/30 mx-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const ProgressSteps = ({ currentStatus }: { currentStatus: string }) => {
    const currentStep = getStatusStep(currentStatus);
    return (
      <div className="flex items-center justify-between w-full px-2 py-4 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        />
        {VISIT_FLOW.map((step) => {
          const isCompleted = currentStep > step.step;
          const isCurrent = currentStep === step.step;
          return (
            <div
              key={step.label}
              className="relative z-10 flex flex-col items-center gap-1.5"
            >
              <div
                className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                      ? "bg-background border-primary text-primary"
                      : "bg-background border-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check className="size-3 stroke-3" />
                ) : (
                  <span className="text-[10px] font-bold">{step.step}</span>
                )}
              </div>
              <span
                className={`text-[9px] font-bold uppercase tracking-tight ${
                  isCurrent || isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    );
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <FlowFilter />
          <MainLayout.Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
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
            <p className="text-muted-foreground">
              No visits in "{activeFlowStep}" stage.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedVisits.map((visit: any) => {
              const status = statusConfig[visit.status] || {
                color: "bg-gray-100 text-gray-600",
                label: visit.status,
                icon: AlertCircle,
              };
              const StatusIcon = status.icon;
              const imgSeed = hashId(visit.listing?._id || visit._id);
              const imageUrl = propertyImages[imgSeed % propertyImages.length];

              return (
                <Card
                  key={visit._id}
                  className="group relative overflow-hidden border shadow-sm bg-card hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer rounded-[2rem]"
                  onClick={() => setDetailModal({ isOpen: true, visit })}
                >
                  <div className="relative aspect-4/3 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Property"
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`${status.color} border font-bold px-3 py-1 shadow-sm backdrop-blur-md bg-white/80`}
                      >
                        <StatusIcon className="size-3 mr-1.5" />
                        {status.label}
                      </Badge>
                    </div>
                    {isOwner && visit.status === "PENDING" && (
                      <div className="absolute top-4 right-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="secondary"
                              size="icon"
                              className="size-8 rounded-full bg-white/90 shadow-sm"
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-xl"
                          >
                            <DropdownMenuItem
                              className="font-bold flex items-center gap-2"
                              onClick={() =>
                                setScheduleModal({
                                  isOpen: true,
                                  visitId: visit._id,
                                })
                              }
                            >
                              <Clock className="size-4 text-primary" />
                              Schedule Visit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive font-bold flex items-center gap-2"
                              onClick={() =>
                                handleStatusUpdate(visit._id, "REJECTED")
                              }
                            >
                              <XCircle className="size-4" />
                              Reject Request
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold line-clamp-1">
                        {visit.listing?.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1.5 font-medium">
                        <MapPin className="size-3.5 text-primary" />
                        {visit.listing?.location}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-muted-foreground/5">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        <Facehash
                          name={isOwner ? visit.tenant?.name : "Owner"}
                          size={40}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                          {isOwner ? "Potential Tenant" : "Listing Owner"}
                        </p>
                        <p className="font-bold text-sm truncate">
                          {isOwner ? visit.tenant?.name : "Property Manager"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                          Rent
                        </p>
                        <p className="font-black text-primary text-sm">
                          ₹{visit.listing?.rentAmount?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-2 mt-4">
                      <ProgressSteps currentStatus={visit.status} />
                    </div>

                    {visit.status === "VISITED" && (
                      <div
                        className="flex gap-2 pt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          className="flex-1 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700"
                          onClick={() =>
                            handleStatusUpdate(visit._id, "APPROVED")
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1 rounded-xl font-bold"
                          onClick={() =>
                            handleStatusUpdate(visit._id, "REJECTED")
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog
        open={detailModal.isOpen}
        onOpenChange={(open) =>
          !open && setDetailModal({ isOpen: false, visit: null })
        }
      >
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none rounded-[2rem]">
          {detailModal.visit && (
            <div className="flex flex-col md:flex-row h-full">
              {/* Left Side: Image + Basic Info */}
              <div className="md:w-5/12 relative aspect-square md:aspect-auto">
                <img
                  src={
                    propertyImages[
                      hashId(
                        detailModal.visit.listing?._id || detailModal.visit._id,
                      ) % propertyImages.length
                    ]
                  }
                  alt="Property"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <Badge
                    className={`${statusConfig[detailModal.visit.status]?.color || "bg-white text-black"} border-none font-black px-3 py-1 mb-2`}
                  >
                    {statusConfig[detailModal.visit.status]?.label ||
                      detailModal.visit.status}
                  </Badge>
                  <h3 className="text-2xl font-black leading-tight">
                    {detailModal.visit.listing?.title}
                  </h3>
                  <p className="flex items-center gap-1.5 text-white/80 font-medium text-sm">
                    <MapPin className="size-3.5" />
                    {detailModal.visit.listing?.location}
                  </p>
                </div>
              </div>

              {/* Right Side: Process Flow + Details */}
              <div className="md:w-7/12 p-8 space-y-8 bg-background max-h-[90vh] overflow-y-auto">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">
                    Interaction Progress
                  </h4>
                  <div className="bg-muted/30 p-4 rounded-3xl border border-muted-foreground/5 mb-2">
                    <ProgressSteps currentStatus={detailModal.visit.status} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-4 p-4 rounded-3xl bg-secondary/50 border border-muted-foreground/5">
                      <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
                        <Facehash
                          name={
                            isOwner ? detailModal.visit.tenant?.name : "Owner"
                          }
                          size={48}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                          {isOwner ? "Potential Tenant" : "Listing Owner"}
                        </p>
                        <p className="font-bold text-lg truncate">
                          {isOwner
                            ? detailModal.visit.tenant?.name
                            : "Property Manager"}
                        </p>
                        {isOwner && (
                          <p className="text-xs text-muted-foreground truncate">
                            {detailModal.visit.tenant?.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-3xl bg-muted/20 border border-muted-foreground/5">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                          Requested
                        </p>
                        <p className="font-bold text-sm flex items-center gap-1.5">
                          <Clock className="size-3.5 text-primary" />
                          {formatDate(
                            detailModal.visit.requestedDate || Date.now(),
                          )}
                        </p>
                      </div>
                      <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
                          Meeting
                        </p>
                        <p className="font-black text-sm flex items-center gap-1.5 text-primary">
                          <CheckCircle2 className="size-3.5" />
                          {detailModal.visit.scheduledDate
                            ? formatTime(detailModal.visit.scheduledDate)
                            : "TBD"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {detailModal.visit.notes && (
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Additional Notes
                      </h5>
                      <div className="p-5 rounded-3xl bg-background border italic text-sm text-balance shadow-inner">
                        "{detailModal.visit.notes}"
                      </div>
                    </div>
                  )}

                  {detailModal.visit.status === "VISITED" && (
                    <div className="flex gap-3 pt-4">
                      <Button
                        className="flex-1 rounded-2xl h-12 font-black bg-emerald-600 hover:bg-emerald-700 text-base shadow-lg shadow-emerald-500/20"
                        onClick={() =>
                          handleStatusUpdate(detailModal.visit._id, "APPROVED")
                        }
                      >
                        Accept Deal
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1 rounded-2xl h-12 font-black text-base shadow-lg shadow-destructive/20"
                        onClick={() =>
                          handleStatusUpdate(detailModal.visit._id, "REJECTED")
                        }
                      >
                        Reject Request
                      </Button>
                    </div>
                  )}

                  {isOwner && detailModal.visit?.status === "PENDING" && (
                    <Button
                      className="w-full h-12 rounded-2xl font-black bg-primary text-base shadow-lg shadow-primary/20"
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
                </div>

                <Button
                  variant="ghost"
                  className="w-full rounded-2xl font-bold text-muted-foreground"
                  onClick={() => setDetailModal({ isOpen: false, visit: null })}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          )}
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
