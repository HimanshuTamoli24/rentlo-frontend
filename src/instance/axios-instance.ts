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

 
  return instance;
}
