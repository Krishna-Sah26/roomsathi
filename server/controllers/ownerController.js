const User = require("../models/User")
const Room = require("../models/Room")
const Lead = require("../models/Lead")

const ensureOwner = (req, res) => {
  if (req.user.role !== "owner") {
    res.status(403).json({
      message: "Only owners can access this resource",
    })
    return false
  }

  return true
}

const getOwnerProfile = async (req, res) => {
  try {
    if (!ensureOwner(req, res)) {
      return
    }

    const user = await User.findById(req.user._id).select("-password")

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      ownerSettings: user.ownerSettings || {},
      createdAt: user.createdAt,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

const updateOwnerProfile = async (req, res) => {
  try {
    if (!ensureOwner(req, res)) {
      return
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: "Owner not found",
      })
    }

    if (req.body.name) {
      user.name = req.body.name.trim()
    }

    if (req.body.phone !== undefined) {
      user.phone = req.body.phone.trim()
    }

    if (req.body.ownerSettings) {
      const currentSettings =
        typeof user.ownerSettings?.toObject === "function"
          ? user.ownerSettings.toObject()
          : user.ownerSettings || {}

      user.ownerSettings = {
        ...currentSettings,
        ...req.body.ownerSettings,
      }
    }

    await user.save()

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      ownerSettings: user.ownerSettings,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

const getOwnerLeads = async (req, res) => {
  try {
    if (!ensureOwner(req, res)) {
      return
    }

    const leads = await Lead.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .populate("room", "title price location area images")
      .populate("seeker", "name email phone")

    const unreadCount = leads.filter((lead) => lead.status === "new").length

    return res.json({
      leads,
      unreadCount,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

const markLeadAsRead = async (req, res) => {
  try {
    if (!ensureOwner(req, res)) {
      return
    }

    const lead = await Lead.findOne({
      _id: req.params.id,
      owner: req.user._id,
    })

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      })
    }

    lead.status = "read"
    await lead.save()

    return res.json(lead)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

const getOwnerAnalyticsDetailed = async (req, res) => {
  try {
    if (!ensureOwner(req, res)) {
      return
    }

    const rooms = await Room.find({ owner: req.user._id }).sort({ createdAt: -1 })
    const leads = await Lead.find({ owner: req.user._id }).sort({ createdAt: -1 }).limit(10)

    const totalViews = rooms.reduce((sum, room) => sum + (room.views || 0), 0)
    const totalInquiries = rooms.reduce((sum, room) => sum + (room.inquiries || 0), 0)
    const unreadLeads = await Lead.countDocuments({
      owner: req.user._id,
      status: "new",
    })

    const roomBreakdown = rooms.map((room) => ({
      _id: room._id,
      title: room.title,
      views: room.views || 0,
      inquiries: room.inquiries || 0,
      price: room.price,
      area: room.area,
    }))

    const viewsChange =
      totalViews > 0 ? `+${Math.min(totalViews, 99)}%` : "+0%"
    const inquiryChange =
      totalInquiries > 0 ? `+${Math.min(totalInquiries, 99)}%` : "+0%"

    return res.json({
      totalRooms: rooms.length,
      totalViews,
      totalInquiries,
      unreadLeads,
      viewsChange,
      inquiryChange,
      roomBreakdown,
      recentLeads: leads,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  getOwnerProfile,
  updateOwnerProfile,
  getOwnerLeads,
  markLeadAsRead,
  getOwnerAnalyticsDetailed,
}
