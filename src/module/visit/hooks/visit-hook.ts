import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createVisitApi,
  type CreateVisitPayload,
  type DecisionPayload,
} from "../services/visit-api";
import { toast } from "sonner";

export const useRequestVisit = () => {
  const visitApi = createVisitApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVisitPayload) => visitApi.requestVisit(payload),
    onSuccess: () => {
      toast.success("Visit requested successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-visits"] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Failed to request visit.";
      toast.error(msg);
    },
  });
};

export const useMyVisits = (params?: { page?: number; limit?: number }) => {
  const visitApi = createVisitApi();
  return useQuery({
    queryKey: ["my-visits", params],
    queryFn: () => visitApi.getMyVisits(params),
  });
};

export const useMarkAsVisited = () => {
  const visitApi = createVisitApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (visitId: string) => visitApi.markAsVisited(visitId),
    onSuccess: () => {
      toast.success("Marked as visited!");
      queryClient.invalidateQueries({ queryKey: ["my-visits"] });
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || "Failed to update visit status.";
      toast.error(msg);
    },
  });
};

export const useMakeDecision = () => {
  const visitApi = createVisitApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      visitId,
      payload,
    }: {
      visitId: string;
      payload: DecisionPayload;
    }) => visitApi.makeDecision(visitId, payload),
    onSuccess: () => {
      toast.success("Decision recorded!");
      queryClient.invalidateQueries({ queryKey: ["my-visits"] });
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || "Failed to submit decision.";
      toast.error(msg);
    },
  });
};
