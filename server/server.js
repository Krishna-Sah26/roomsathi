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

const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    "https://roomsathi-np.vercel.app",
    "https://roomsathi-blush.vercel.app",
    "http://localhost:5173",
  ].filter(Boolean),
)

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true)
    }

    return callback(new Error("Not allowed by CORS"))
  },
  credentials: true,
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

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
