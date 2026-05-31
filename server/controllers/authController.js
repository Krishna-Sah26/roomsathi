const User = require("../models/User")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const generateToken = require("../utils/generateToken")

const isValidName = (value) => /^[A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)*$/.test(value.trim())
const isValidGmail = (value) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(value.trim())
const isStrongPassword = (value) =>
  value.length >= 4 && value.length <= 20 && /[a-z]/.test(value) && /[A-Z]/.test(value)

// REGISTER
const registerUser = async (req, res) => {
  try {
    // Register with email-first auth for the new UI.
    const { name, email, phone, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      })
    }

    if (!isValidName(name)) {
      return res.status(400).json({
        message: "Name must start with uppercase letters, like Krishna Kumar",
      })
    }

    if (!isValidGmail(email)) {
      return res.status(400).json({
        message: "Email must be a valid @gmail.com address",
      })
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password must be 4 to 20 characters and include uppercase and lowercase letters",
      })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existingUser = await User.findOne({ email: normalizedEmail })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email: normalizedEmail,
      phone: phone?.trim(),
      password: hashedPassword,
      role: role || "user",
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// LOGIN
const loginUser = async (req, res) => {
  try {
    // Login uses email so it matches the current frontend.
    const { email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      })
    }

    if (!isValidGmail(email)) {
      return res.status(400).json({
        message: "Please login with a valid @gmail.com email",
      })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      })
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        message: "Selected role does not match this account",
      })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// GOOGLE AUTH
const googleAuth = async (req, res) => {
  try {
    const { name, email, image, role } = req.body

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      })
    }

    const normalizedEmail = email.toLowerCase().trim()
    let user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      user = await User.create({
        name,
        email: normalizedEmail,
        image: image || "",
        password: await bcrypt.hash("google_login", 10),
        role: role || "user",
      })
    } else if (role && user.role !== role) {
      user.role = role
      user.image = image || user.image
      await user.save()
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
      role: user.role,
      token: generateToken(user._id),
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

// REQUEST PASSWORD RESET CODE
const requestPasswordResetCode = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      })
    }

    if (!isValidGmail(email)) {
      return res.status(400).json({
        message: "Please use a valid @gmail.com email",
      })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      })
    }

    const resetCode = String(crypto.randomInt(100000, 999999))
    user.resetPasswordCode = resetCode
    user.resetPasswordCodeExpires = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    return res.json({
      message: "Verification code generated successfully",
      verificationCode: resetCode,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

// VERIFY PASSWORD RESET CODE AND UPDATE PASSWORD
const verifyPasswordResetCode = async (req, res) => {
  try {
    const { email, code, newPassword, confirmPassword } = req.body

    if (!email || !code || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Email, code, new password, and confirmation are required",
      })
    }

    if (!isValidGmail(email)) {
      return res.status(400).json({
        message: "Please use a valid @gmail.com email",
      })
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        message: "Password must be 4 to 20 characters and include uppercase and lowercase letters",
      })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      })
    }

    if (!user.resetPasswordCode || !user.resetPasswordCodeExpires) {
      return res.status(400).json({
        message: "Please request a new verification code",
      })
    }

    if (user.resetPasswordCodeExpires.getTime() < Date.now()) {
      user.resetPasswordCode = ""
      user.resetPasswordCodeExpires = null
      await user.save()

      return res.status(400).json({
        message: "Verification code expired, please request a new one",
      })
    }

    if (user.resetPasswordCode !== String(code).trim()) {
      return res.status(400).json({
        message: "Invalid verification code",
      })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    user.resetPasswordCode = ""
    user.resetPasswordCodeExpires = null
    await user.save()

    return res.json({
      message: "Password updated successfully",
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  requestPasswordResetCode,
  verifyPasswordResetCode,
}
