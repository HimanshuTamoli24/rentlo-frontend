import type { AxiosInstance } from "axios";

export const createAuthApi = (axiosInstance: AxiosInstance) => ({
  register: async (userData: any) => {
    const { data } = await axiosInstance.post("/auth/register", userData);
    return data;
  },
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await axiosInstance.post("/auth/login", credentials);
    return data;
  },
  logout: async (user: any) => {
    const { data } = await axiosInstance.post(`/auth/logout`, user);
    return data;
  },
});
