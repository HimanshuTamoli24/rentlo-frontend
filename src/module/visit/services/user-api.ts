import createAxiosInstance from "../../../instance/axios-instance";
const axiosInstance = createAxiosInstance();

export const createUserApi = () => ({
  getUsers: async () => {
    const params = new URLSearchParams();
    const { data } = await axiosInstance.get("/users", { params });
    return data;
  },
  getUser: async (userId: string) => {
    const { data } = await axiosInstance.get(`/users/${userId}`);
    return data;
  },
  updateUser: async ({ userId, payLoaddata }: any) => {
    const { data } = await axiosInstance.patch(`/users/${userId}`, payLoaddata);
    return data;
  },
  deleteUser: async (userId: string) => {
    const { data } = await axiosInstance.delete(`/users/${userId}`);
    return data;
  }
});
