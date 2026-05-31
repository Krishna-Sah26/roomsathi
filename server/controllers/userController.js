const User = require("../models/User")
const Room = require("../models/Room")
const Lead = require("../models/Lead")

const saveRoom = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    if (!user.savedRooms.some((roomId) => roomId.toString() === req.params.id)) {
      user.savedRooms.push(req.params.id)
      await user.save()
    }

    return res.json({
      message: "Room saved",
      savedRooms: user.savedRooms,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

const unsaveRoom = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    user.savedRooms = user.savedRooms.filter(
      (roomId) => roomId.toString() !== req.params.id
    )
    await user.save()

    return res.json({
      message: "Room unsaved",
      savedRooms: user.savedRooms,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

const getSavedRooms = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedRooms",
      populate: {
        path: "owner",
        select: "name phone email role",
      },
    })

    return res.json(user?.savedRooms || [])
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      savedCount: user.savedRooms?.length || 0,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

const addSearchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    const entry = {
      query: req.body.query || "",
      location: req.body.location || "",
      roomType: req.body.roomType || "",
      maxBudget: req.body.maxBudget ? Number(req.body.maxBudget) : undefined,
      filter: req.body.filter || "all",
      createdAt: new Date(),
    }

    user.searchHistory = [entry, ...(user.searchHistory || [])].slice(0, 20)
    await user.save()

    return res.json({
      message: "Search saved",
      searchHistory: user.searchHistory,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

const getSearchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("searchHistory")

    return res.json(user?.searchHistory || [])
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

const getUserContacts = async (req, res) => {
  try {
    const leads = await Lead.find({ seeker: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("room", "title price location images")
      .populate("owner", "name phone email")

    return res.json(leads)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

const getRecommendedRooms = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedRooms")

    const savedIds = (user?.savedRooms || []).map((room) =>
      room._id ? room._id.toString() : room.toString()
    )

    const savedRoomsData = await Room.find({
      _id: { $in: savedIds },
    }).select("category area price")

    const categories = [...new Set(savedRoomsData.map((room) => room.category).filter(Boolean))]
    const areas = [...new Set(savedRoomsData.map((room) => room.area).filter(Boolean))]

    let query = { _id: { $nin: savedIds } }

    if (categories.length || areas.length) {
      query.$or = []
      if (categories.length) {
        query.$or.push({ category: { $in: categories } })
      }
      if (areas.length) {
        query.$or.push({ area: { $in: areas } })
      }
    }

    const rooms = await Room.find(query)
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("owner", "name phone email role")

    if (rooms.length === 0) {
      const fallbackRooms = await Room.find({ _id: { $nin: savedIds } })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("owner", "name phone email role")

      return res.json(fallbackRooms)
    }

    return res.json(rooms)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  saveRoom,
  unsaveRoom,
  getSavedRooms,
  getUserProfile,
  addSearchHistory,
  getSearchHistory,
  getUserContacts,
  getRecommendedRooms,
}
