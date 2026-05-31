const express = require("express")
const cors = require("cors")
require("dotenv").config()
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const roomRoutes = require("./routes/roomRoutes")
const userRoutes = require("./routes/userRoutes")
const ownerRoutes = require("./routes/ownerRoutes")
const exploreRoutes = require("./routes/exploreRoutes")

connectDB()
const app = express()

// ✅ CORS fix — credentials ke saath
app.use(cors({
  origin: [
    "https://roomsathi-np.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}))

// ✅ Google OAuth popup ke liye
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups")
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none")
  next()
})

app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/rooms", roomRoutes)
app.use("/api/users", userRoutes)
app.use("/api/owners", ownerRoutes)
app.use("/api/explore", exploreRoutes)

app.get("/", (req, res) => {
  res.send("RoomSathi API Running")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})