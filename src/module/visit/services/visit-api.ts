import createAxiosInstance from "../../../instance/axios-instance";

const axiosInstance = createAxiosInstance();

export interface CreateVisitPayload {
  listingId: string;
  requestedDate?: string;
  notes?: string;
}

export interface DecisionPayload {
  decision: "YES" | "NO";
  notes?: string;
}

export const createVisitApi = () => ({
  requestVisit: async (payload: CreateVisitPayload) => {
    const { data } = await axiosInstance.post(`/visits`, payload);
    return data;
  },

  getMyVisits: async (params?: { page?: number; limit?: number }) => {
    const { data } = await axiosInstance.get(`/visits/my`, { params });
    return data;
  },

  getIncomingVisits: async (params?: {
    page?: number;
    limit?: number;
    enabled?: boolean;
  }) => {
    const { data } = await axiosInstance.get(`/visits`, { params });
    return data;
  },

  markAsVisited: async (visitId: string) => {
    const { data } = await axiosInstance.patch(`/visits/${visitId}/visited`);
    return data;
  },

  makeDecision: async (visitId: string, payload: DecisionPayload) => {
    const { data } = await axiosInstance.patch(
      `/visits/${visitId}/decision`,
      payload,
    );
    return data;
  },

  updateVisitStatus: async (
    visitId: string,
    status: string,
    notes?: string,
  ) => {
    const { data } = await axiosInstance.patch(`/visits/${visitId}/status`, {
      status,
      notes,
    });
    return data;
  },

  scheduleVisit: async (
    visitId: string,
    scheduledDate: string,
    notes?: string,
  ) => {
    const { data } = await axiosInstance.patch(`/visits/${visitId}/schedule`, {
      scheduledDate,
      notes,
    });
    return data;
  },
});
