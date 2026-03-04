import { useMutation } from "@tanstack/react-query";
import { createAuthApi } from "../services/auth-api";

export const useRegister = () => {
  const authApi = createAuthApi();
  return useMutation({
    mutationFn: async (payload: any) => authApi.register(payload),
    onSuccess: (data) => {
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("Error registering user:", error);
    },
  });
};

export const useLogin = () => {
  const authApi = createAuthApi();
  return useMutation({
    mutationFn: async (payload: any) => authApi.login(payload),
    onSuccess: (data) => {
      console.log("User logged in successfully:", data);
    },
    onError: (error) => {
      console.error("Error logging in user:", error);
    },
  });
};

export const useLogout = () => {
  const authApi = createAuthApi();
  return useMutation({
    mutationFn: async () => authApi.logout(),
    onSuccess: (data) => {
      console.log("User logged out successfully:", data);
    },
    onError: (error) => {
      console.error("Error logging out user:", error);
    },
  });
};
