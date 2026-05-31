const express = require("express")

const {
  registerUser,
  loginUser,
  googleAuth,
  requestPasswordResetCode,
  verifyPasswordResetCode,
} = require("../controllers/authController")

const router = express.Router()

router.post("/register", registerUser)

router.post("/login", loginUser)

router.post("/google", googleAuth)

router.post("/forgot-password/request", requestPasswordResetCode)

router.post("/forgot-password/verify", verifyPasswordResetCode)

module.exports = router
