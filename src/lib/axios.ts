// import config from "@/config";
// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: config.base_url,
//   withCredentials: true,
// });

// // Add a request interceptor
// axiosInstance.interceptors.request.use(
//   function (config) {
//     // Do something before request is sent

//     return config;
//   },
//   function (error) {
//     // Do something with request error

//     return Promise.reject(error);
//   },
// );

// // Add a response interceptor
// axiosInstance.interceptors.response.use(
//   function onFulfilled(response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   },
//   function onRejected(error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error);
//   },
// );
import config from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: config.base_url,
  withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (reqConfig) {
    // 1. Get token dynamically on every request
    const token = localStorage.getItem("auth_token");

    // 2. Attach Authorization header if token exists
    if (token && reqConfig.headers) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }

    return reqConfig;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function onFulfilled(response) {
    return response;
  },
  function onRejected(error) {
    return Promise.reject(error);
  },
);
