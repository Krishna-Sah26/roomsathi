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

app.use(cors())
app.use(express.json())

app.use("/api/auth", google)
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
