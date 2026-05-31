const express = require("express")
const protect = require("../middleware/authMiddleware")
const {
  saveRoom,
  unsaveRoom,
  getSavedRooms,
  getUserProfile,
  addSearchHistory,
  getSearchHistory,
  getUserContacts,
  getRecommendedRooms,
} = require("../controllers/userController")

const router = express.Router()

router.get("/me", protect, getUserProfile)
router.post("/search-history", protect, addSearchHistory)
router.get("/search-history", protect, getSearchHistory)
router.get("/contacts", protect, getUserContacts)
router.get("/recommended", protect, getRecommendedRooms)
router.post("/save/:id", protect, saveRoom)
router.delete("/save/:id", protect, unsaveRoom)
router.get("/saved", protect, getSavedRooms)

module.exports = router
