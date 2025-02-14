import axios from "axios";

// Create the axios instance with basic configuration
const axiosInstance = axios.create({
  baseURL: "http://localhost:3005",
  withCredentials: true,
});

// Add a request interceptor to attach the token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if in a browser environment
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
