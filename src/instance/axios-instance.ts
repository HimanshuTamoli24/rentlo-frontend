import env from "../config/env";
import axios from "axios";
export default function createAxiosInstance() {
  const instance = axios.create({
    baseURL: `${env.VITE_API_BASE_URL}/api/v1/`,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // Adding request interceptor for Authorization header
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return instance;
}
