import {
  useMyVisits,
  useMarkAsVisited,
  useMakeDecision,
} from "../hooks/visit-hook";
import LoadingPage from "@/components/loading";
import ErrorPage from "@/components/error-page";
import { format } from "date-fns";
import { useState } from "react";
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

export default function MyVisitsPage() {
  const { data, isLoading, isError } = useMyVisits();
  const { mutateAsync: markVisited, isPending: isMarking } = useMarkAsVisited();
  const { mutateAsync: makeDecision, isPending: isDeciding } =
    useMakeDecision();

  const [decisionModal, setDecisionModal] = useState<{
    isOpen: boolean;
    visitId: string;
    decision: "YES" | "NO" | null;
  }>({
    isOpen: false,
    visitId: "",
    decision: null,
  });
  const [notes, setNotes] = useState("");

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  const visits = data?.data || [];

  const handleDecisionSubmit = async () => {
    if (!decisionModal.visitId || !decisionModal.decision) return;

    await makeDecision({
      visitId: decisionModal.visitId,
      payload: { decision: decisionModal.decision, notes },
    });

    setDecisionModal({ isOpen: false, visitId: "", decision: null });
    setNotes("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Visits</h1>
        <p className="text-muted-foreground mt-2">
          Track the status of your property tours and decisions.
        </p>
      </div>

      {visits.length === 0 ? (
        <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground shadow-sm">
          You haven't requested any visits yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visits.map((visit: any) => (
            <div
              key={visit._id}
              className="rounded-2xl border bg-card overflow-hidden shadow-sm flex flex-col"
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {visit.listing?.title || "Property Listing"}
                  </h3>
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      visit.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : visit.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : visit.status === "SCHEDULED"
                            ? "bg-blue-100 text-blue-800"
                            : visit.status === "VISITED"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {visit.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">
                      Requested:
                    </span>{" "}
                    {visit.requestedDate
                      ? format(new Date(visit.requestedDate), "PPP")
                      : "No specific date"}
                  </p>
                  {visit.scheduledDate && (
                    <p>
                      <span className="font-medium text-foreground">
                        Scheduled For:
                      </span>{" "}
                      {format(new Date(visit.scheduledDate), "PPP p")}
                    </p>
                  )}
                  {visit.decision && (
                    <p>
                      <span className="font-medium text-foreground">
                        Your Decision:
                      </span>{" "}
                      <span
                        className={
                          visit.decision === "YES"
                            ? "text-green-600 font-semibold"
                            : "text-red-500 font-semibold"
                        }
                      >
                        {visit.decision}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-muted/30 border-t flex flex-wrap gap-2 justify-end">
                {visit.status === "SCHEDULED" && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => markVisited(visit._id)}
                    disabled={isMarking}
                  >
                    Mark as Visited
                  </Button>
                )}

                {visit.status === "VISITED" && !visit.decision && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={() =>
                        setDecisionModal({
                          isOpen: true,
                          visitId: visit._id,
                          decision: "NO",
                        })
                      }
                    >
                      Not Interested
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() =>
                        setDecisionModal({
                          isOpen: true,
                          visitId: visit._id,
                          decision: "YES",
                        })
                      }
                    >
                      Interested (Move In)
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={decisionModal.isOpen}
        onOpenChange={(open) =>
          !open && setDecisionModal({ ...decisionModal, isOpen: false })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {decisionModal.decision === "YES"
                ? "Great! Move Forward"
                : "Mark as Not Interested"}
            </DialogTitle>
            <DialogDescription>
              {decisionModal.decision === "YES"
                ? "Let the owner know why you're interested or if you have any questions before proceeding."
                : "Help us understand why this property wasn't the right fit for you."}
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
              {isDeciding ? "Submitting..." : "Submit Decision"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
