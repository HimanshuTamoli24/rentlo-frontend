import createAxiosInstance from "../../../instance/axios-instance";
const axiosInstance = createAxiosInstance();

export const createAuthApi = () => ({
  register: async (userData: any) => {
    const { data } = await axiosInstance.post("/auth/register", userData);
    return data;
  },
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await axiosInstance.post("/auth/login", credentials);
    return data;
  },
  logout: async () => {
    const { data } = await axiosInstance.post("/auth/logout");
    return data;
  },
});
