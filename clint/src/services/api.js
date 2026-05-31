import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV 
    ? "http://localhost:5000/api" 
    : "https://roomsathi-k4gr.onrender.com/api");

const API = axios.create({
  baseURL,
  withCredentials: true,  // ← yeh add karo, Google OAuth ke liye zaroori
});

// Token automatically har request mein lagega
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;