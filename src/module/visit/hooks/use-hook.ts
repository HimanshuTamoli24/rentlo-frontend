import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserApi } from "../services/user-api";

export const useUsers = () => {
  const userApi = createUserApi();
  return useQuery({
    queryKey: ["users"],
    queryFn: userApi.getUsers,
  });
};

export const useUser = (userId: string) => {
  const userApi = createUserApi();
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => userApi.getUser(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const userApi = createUserApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, payload }: any) =>
      userApi.updateUser({ userId, payLoaddata: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
};

export const useDeleteUser = () => {
  const userApi = createUserApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => userApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });
};
