import axios from "axios";

const token = localStorage.getItem("token");


const axiosInstance = axios.create({
  baseURL: "http://localhost:3005",
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default axiosInstance;