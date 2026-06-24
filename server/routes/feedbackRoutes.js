const express = require("express")
const { createFeedback, getFeedbacks } = require("../controllers/feedbackController")

const router = express.Router()

router.get("/", getFeedbacks)
router.post("/", createFeedback)

module.exports = router
