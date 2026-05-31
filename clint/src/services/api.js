import axios from "axios"

const rawApiBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "https://roomsathi-k4gr.onrender.com/api")

const trimmedApiBaseUrl = rawApiBaseUrl.replace(/\/$/, "")
const baseURL = trimmedApiBaseUrl.endsWith("/api")
  ? trimmedApiBaseUrl
  : `${trimmedApiBaseUrl}/api`

const API = axios.create({
  baseURL,
})

export default API
