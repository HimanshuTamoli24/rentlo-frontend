import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createListApi } from "../services/list-api";

export const useLists = (params?: Record<string, any>) => {
  const listApi = createListApi();
  return useQuery({
    queryKey: ["lists", params],
    queryFn: () => listApi.getLists(params),
  });
};

export const useList = (listId: string) => {
  const listApi = createListApi();
  return useQuery({
    queryKey: ["list", listId],
    queryFn: () => listApi.getList(listId),
    enabled: !!listId,
  });
};

export const useAdminLists = () => {
  const listApi = createListApi();
  return useQuery({
    queryKey: ["admin-lists"],
    queryFn: listApi.getAdminLists,
  });
};

export const useCompareLists = (
  params?: Record<string, string | number | boolean>,
) => {
  const listApi = createListApi();
  return useQuery({
    queryKey: ["lists", "compare", params],
    queryFn: () => listApi.compareLists(params),
  });
};

export const useCreateList = () => {
  const listApi = createListApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => listApi.createList(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["admin-lists"] });
    },
    onError: (error) => {
      console.error("Error creating list:", error);
    },
  });
};

export const useUpdateList = () => {
  const listApi = createListApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, payload }: any) =>
      listApi.updateList({ listId, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["admin-lists"] });
    },
    onError: (error) => {
      console.error("Error updating list:", error);
    },
  });
};

export const useUpdateListStatus = () => {
  const listApi = createListApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, payload }: any) =>
      listApi.updateListStatus({ listId, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["admin-lists"] });
    },
    onError: (error) => {
      console.error("Error updating list status:", error);
    },
  });
};

export const useDeleteList = () => {
  const listApi = createListApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listId: string) => listApi.deleteList(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["admin-lists"] });
    },
    onError: (error) => {
      console.error("Error deleting list:", error);
    },
  });
};

export const useAcceptListing = () => {
  const listApi = createListApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listId: string) => listApi.acceptListing(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["admin-lists"] });
    },
    onError: (error) => {
      console.error("Error accepting list:", error);
    },
  });
};

export const useRejectListing = () => {
  const listApi = createListApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listId,
      payload,
    }: {
      listId: string;
      payload: { reason: string };
    }) => listApi.rejectListing({ listId, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["admin-lists"] });
    },
    onError: (error) => {
      console.error("Error rejecting list:", error);
    },
  });
};
