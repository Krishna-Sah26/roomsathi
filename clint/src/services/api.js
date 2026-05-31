import axios from "axios";

const API = axios.create({
  baseURL: "https://roomsathi-k4gr.onrender.com",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith("/") && !config.url.startsWith("/api/")) {
    config.url = `/api${config.url}`
  }

  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const token = JSON.parse(userInfo)?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
