import axios from "axios"

const baseURL = (import.meta.env.VITE_API_URL || "https://roomsathi-k4gr.onrender.com").replace(/\/$/, "").replace(/\/api$/, "")

const API = axios.create({
  baseURL,
})

API.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith("/") && !config.url.startsWith("/api/")) {
    config.url = `/api${config.url}`
  }

  const userInfo = localStorage.getItem("userInfo")
  if (userInfo) {
    const token = JSON.parse(userInfo)?.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

export default API
