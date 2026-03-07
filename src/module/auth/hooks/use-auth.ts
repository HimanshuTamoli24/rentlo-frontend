import { useMutation } from "@tanstack/react-query";
import { createAuthApi } from "../services/auth-api";
import createAxiosInstance from "../../../instance/axios-instance";

export const useRegister = () => {
  const axiosInstance = createAxiosInstance();
  const authApi = createAuthApi(axiosInstance);
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
  const axiosInstance = createAxiosInstance();
  const authApi = createAuthApi(axiosInstance);
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
  const axiosInstance = createAxiosInstance();
  const authApi = createAuthApi(axiosInstance);
  return useMutation({
    mutationFn: async () => authApi.logout(),
    onSuccess: (data) => {
      console.log("User logged out successfully:", data);
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      window.location.href = "/auth";
    },
    onError: (error) => {
      console.error("Error logging out user:", error);
    },
  });
};
