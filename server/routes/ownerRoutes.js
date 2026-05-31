const express = require("express")
const protect = require("../middleware/authMiddleware")
const {
  getOwnerProfile,
  updateOwnerProfile,
  getOwnerLeads,
  markLeadAsRead,
  getOwnerAnalyticsDetailed,
} = require("../controllers/ownerController")

const router = express.Router()

router.get("/me", protect, getOwnerProfile)
router.put("/me", protect, updateOwnerProfile)
router.get("/leads", protect, getOwnerLeads)
router.patch("/leads/:id/read", protect, markLeadAsRead)
router.get("/analytics", protect, getOwnerAnalyticsDetailed)

module.exports = router
