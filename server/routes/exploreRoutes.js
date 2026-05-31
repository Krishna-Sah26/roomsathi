const express = require("express")
const {
  getNearbyPlaces,
  getSupportInfo,
} = require("../controllers/exploreController")

const router = express.Router()

router.get("/nearby-places", getNearbyPlaces)
router.get("/support", getSupportInfo)

module.exports = router
