import config from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: config.base_url,
  timeout: 1000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
