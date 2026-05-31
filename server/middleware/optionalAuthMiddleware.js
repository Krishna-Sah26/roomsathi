const jwt = require("jsonwebtoken")
const User = require("../models/User")

const optionalAuth = async (req, res, next) => {
  if (!req.headers.authorization?.startsWith("Bearer")) {
    return next()
  }

  try {
    const token = req.headers.authorization.split(" ")[1]
    const secret = process.env.JWT_SECRET || "roomsathi_secret"
    const decoded = jwt.verify(token, secret)
    const user = await User.findById(decoded.id).select("-password")

    if (user) {
      req.user = user
    }
  } catch (error) {
    // Ignore invalid tokens for optional auth routes.
  }

  return next()
}

module.exports = optionalAuth
