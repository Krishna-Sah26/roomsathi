import axios from "axios";

const baseURL = (
  import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV 
    ? "http://localhost:5000/api" 
    : "https://roomsathi-k4gr.onrender.com/api")
).replace(/\/$/, "");

const API = axios.create({
  baseURL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const token = JSON.parse(userInfo)?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;