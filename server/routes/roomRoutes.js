const express = require("express")

const {
  addRoom,
  getRooms,
  getMyRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getNearbyRooms,
  getOwnerAnalytics,
  exploreRooms,
  getSimilarRooms,
  searchRooms,
  getOwnerMapData,
  incrementInquiries,
} = require("../controllers/roomController")

const protect = require("../middleware/authMiddleware")
const optionalAuth = require("../middleware/optionalAuthMiddleware")
const upload = require("../middleware/uploadMiddleware")

const router = express.Router()

router.post("/", protect, upload.array("images", 10), addRoom)
router.get("/explore", exploreRooms)
router.get("/search", searchRooms)
router.post("/:id/inquire", optionalAuth, incrementInquiries)
router.get("/owner/analytics", protect, getOwnerAnalytics)
router.get("/owner/map", protect, getOwnerMapData)
router.get("/owner/me", protect, getMyRooms)
router.get("/nearby", getNearbyRooms)
router.get("/", getRooms)
router.get("/:id/similar", getSimilarRooms)
router.get("/:id", getRoomById)
router.put("/:id", protect, upload.array("images", 10), updateRoom)
router.delete("/:id", protect, deleteRoom)

module.exports = router
