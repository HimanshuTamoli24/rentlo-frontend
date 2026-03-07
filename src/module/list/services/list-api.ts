import createAxiosInstance from "../../../instance/axios-instance";

const axiosInstance = createAxiosInstance();

type UpdateListPayload = {
  listId: string;
  payload: any;
};

type UpdateListStatusPayload = {
  listId: string;
  payload: any;
};

type RejectListingPayload = {
  reason: string;
};

export const createListApi = () => ({
  getLists: async () => {
    const params = new URLSearchParams();
    const { data } = await axiosInstance.get("/listings", { params });
    return data;
  },
  getList: async (listId: string) => {
    const { data } = await axiosInstance.get(`/listings/${listId}`);
    return data;
  },
  compareLists: async (params?: Record<string, string | number | boolean>) => {
    const { data } = await axiosInstance.get("/listings/compare", { params });
    return data;
  },
  getAdminLists: async () => {
    const { data } = await axiosInstance.get("/listings/admin");
    return data;
  },
  createList: async (payload: any) => {
    const { data } = await axiosInstance.post("/listings/admin", payload);
    return data;
  },
  updateList: async ({ listId, payload }: UpdateListPayload) => {
    const { data } = await axiosInstance.patch(
      `/listings/admin/${listId}`,
      payload,
    );
    return data;
  },
  updateListStatus: async ({ listId, payload }: UpdateListStatusPayload) => {
    const { data } = await axiosInstance.patch(
      `/listings/admin/${listId}/status`,
      payload,
    );
    return data;
  },
  deleteList: async (listId: string) => {
    const { data } = await axiosInstance.delete(`/listings/admin/${listId}`);
    return data;
  },
  acceptListing: async (listId: string) => {
    const { data } = await axiosInstance.patch(
      `/listings/admin/${listId}/accept`,
    );
    return data;
  },
  rejectListing: async ({
    listId,
    payload,
  }: {
    listId: string;
    payload: RejectListingPayload;
  }) => {
    const { data } = await axiosInstance.patch(
      `/listings/admin/${listId}/reject`,
      payload,
    );
    return data;
  },
});
