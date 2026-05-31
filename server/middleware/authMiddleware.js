const jwt = require("jsonwebtoken")
const User = require("../models/User")

const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]

      const secret = process.env.JWT_SECRET || "roomsathi_secret"
      const decoded = jwt.verify(token, secret)

      req.user = await User.findById(decoded.id).select("-password")

      if (!req.user) {
        return res.status(401).json({
          message: "Not authorized",
        })
      }

      return next()
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized",
      })
    }
  }

  return res.status(401).json({
    message: "No token",
  })
}

module.exports = protect
