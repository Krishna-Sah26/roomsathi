const Room = require("../models/Room")
const Lead = require("../models/Lead")
const cloudinary = require("../config/cloudinary")
const getDistance = require("../utils/distance")

const validateListingTitle = (title) => {
  const trimmedTitle = String(title || "").trim()

  if (!/^[a-zA-Z0-9]+$/.test(trimmedTitle)) {
    return "Listing title must contain only letters and numbers"
  }

  if (trimmedTitle.length < 5 || trimmedTitle.length > 50) {
    return "Listing title must be between 5 and 50 characters"
  }

  return null
}

const validatePrice = (price) => {
  const priceValue = String(price || "").trim()

  if (!/^\d+$/.test(priceValue)) {
    return "Monthly rent must contain numbers only"
  }

  return null
}

const normalizeAmenities = (amenities) => {
  if (!amenities) return []

  if (Array.isArray(amenities)) {
    return amenities.filter(Boolean)
  }

  return String(amenities)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

// ADD ROOM
const addRoom = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        message: "Only owners can add rooms",
      })
    }

    const files = req.files || []

    if (files.length === 0) {
      return res.status(400).json({
        message: "At least one image is required",
      })
    }

    const titleError = validateListingTitle(req.body.title)
    if (titleError) {
      return res.status(400).json({ message: titleError })
    }

    const priceError = validatePrice(req.body.price)
    if (priceError) {
      return res.status(400).json({ message: priceError })
    }

    const imageUrls = []

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path)
      imageUrls.push(result.secure_url)
    }

    let coordinates = null

    if (req.body.coordinates) {
      try {
        coordinates = JSON.parse(req.body.coordinates)
      } catch (error) {
        coordinates = null
      }
    }

    const room = await Room.create({
      title: String(req.body.title).trim(),
      category: req.body.category,
      price: Number(req.body.price),
      area: req.body.area,
      location: req.body.location,
      description: req.body.description,
      amenities: normalizeAmenities(req.body.amenities),
      phone: req.body.phone,
      whatsapp: req.body.whatsapp,
      coordinates,
      images: imageUrls,
      owner: req.user._id,
    })

    return res.status(201).json(room)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

// GET ALL ROOMS
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .sort({ createdAt: -1 })
      .populate("owner", "name phone email role")

    return res.json(rooms)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

// GET ROOMS FOR THE LOGGED-IN OWNER
const getMyRooms = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        message: "Only owners can view owner listings",
      })
    }

    const rooms = await Room.find({ owner: req.user._id }).sort({
      createdAt: -1,
    })

    return res.json(rooms)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

// GET SINGLE ROOM BY ID
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("owner", "name phone email role")

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      })
    }

    return res.json(room)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

// UPDATE ROOM
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      })
    }

    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      })
    }

    if (req.body.title) {
      const titleError = validateListingTitle(req.body.title)
      if (titleError) {
        return res.status(400).json({ message: titleError })
      }
    }

    if (req.body.price) {
      const priceError = validatePrice(req.body.price)
      if (priceError) {
        return res.status(400).json({ message: priceError })
      }
    }

    room.title = req.body.title ? String(req.body.title).trim() : room.title
    room.category = req.body.category || room.category
    room.price = req.body.price ? Number(req.body.price) : room.price
    room.area = req.body.area || room.area
    room.location = req.body.location || room.location
    room.description = req.body.description || room.description
    room.amenities = normalizeAmenities(req.body.amenities) || room.amenities
    room.phone = req.body.phone || room.phone
    room.whatsapp = req.body.whatsapp || room.whatsapp

    if (req.body.coordinates) {
      try {
        room.coordinates = JSON.parse(req.body.coordinates)
      } catch (error) {
        room.coordinates = room.coordinates
      }
    }

    if (req.files && req.files.length > 0) {
      const imageUrls = []

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path)
        imageUrls.push(result.secure_url)
      }

      room.images = imageUrls
    }

    await room.save()

    return res.json(room)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

// DELETE ROOM
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      })
    }

    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      })
    }

    await room.deleteOne()

    return res.json({
      message: "Room deleted",
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

// GET NEARBY ROOMS BY COORDINATES
const getNearbyRooms = async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      })
    }

    const rooms = await Room.find().sort({ createdAt: -1 }).populate(
      "owner",
      "name phone email role"
    )

    const nearbyRooms = rooms
      .map((room) => {
        if (!room.coordinates?.lat || !room.coordinates?.lng) {
          return null
        }

        const distance = getDistance(
          lat,
          lng,
          room.coordinates.lat,
          room.coordinates.lng
        )

        if (distance > Number(radius)) {
          return null
        }

        return {
          ...room.toObject(),
          distance,
        }
      })
      .filter(Boolean)
      .sort((left, right) => left.distance - right.distance)

    return res.json(nearbyRooms)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

// GET OWNER ANALYTICS
const getOwnerAnalytics = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        message: "Only owners can view analytics",
      })
    }

    const rooms = await Room.find({ owner: req.user._id })

    const totalViews = rooms.reduce((sum, room) => sum + (room.views || 0), 0)
    const totalInquiries = rooms.reduce((sum, room) => sum + (room.inquiries || 0), 0)

    return res.json({
      totalRooms: rooms.length,
      totalViews,
      totalInquiries,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

// INCREMENT ROOM INQUIRIES + CREATE LEAD
const incrementInquiries = async (req, res) => {
  try {
    const inquiryType = req.body.type === "call" ? "call" : "whatsapp"
    const room = await Room.findById(req.params.id)

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      })
    }

    const lead = await Lead.create({
      room: room._id,
      owner: room.owner,
      seeker: req.user?._id,
      seekerName: req.body.seekerName || req.user?.name || "Guest Seeker",
      seekerPhone: req.body.seekerPhone || req.user?.phone || room.phone || "",
      seekerEmail: req.body.seekerEmail || req.user?.email || "",
      type: inquiryType,
      message:
        req.body.message ||
        `Interested via ${inquiryType === "call" ? "phone call" : "WhatsApp"}`,
    })

    room.inquiries = (room.inquiries || 0) + 1
    await room.save()

    return res.json({
      message: "Inquiry recorded",
      inquiries: room.inquiries,
      lead,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
const isRoomVerified = (room) =>
  Boolean(
    room.images?.length > 0 &&
      room.phone &&
      room.price > 0 &&
      room.owner &&
      room.location
  )

const exploreRooms = async (req, res) => {
  try {
    const {
      filter = "all",
      search,
      roomType,
      maxBudget,
      minBudget,
      location,
      lat,
      lng,
      radius = 5,
    } = req.query

    let query = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    if (roomType && roomType.toLowerCase() !== "all") {
      query.category = roomType
    }

    if (location && location.toLowerCase() !== "all") {
      const locationFilter = {
        $or: [
          { location: { $regex: location, $options: "i" } },
          { area: { $regex: location, $options: "i" } },
        ],
      }

      if (query.$or) {
        query = { $and: [{ $or: query.$or }, locationFilter] }
      } else {
        Object.assign(query, locationFilter)
      }
    }

    if (minBudget || maxBudget) {
      query.price = {}
      if (minBudget) {
        query.price.$gte = Number(minBudget)
      }
      if (maxBudget) {
        query.price.$lte = Number(maxBudget)
      }
    }

    let rooms = await Room.find(query)
      .sort({ createdAt: -1 })
      .populate("owner", "name phone email role")

    if (filter === "verified") {
      rooms = rooms.filter(isRoomVerified)
    }

    if (filter === "newest") {
      rooms = [...rooms].sort(
        (left, right) => new Date(right.createdAt) - new Date(left.createdAt)
      )
    }

    let results = rooms.map((room) => ({
      ...room.toObject(),
      isVerified: isRoomVerified(room),
    }))

    if (lat && lng) {
      results = results
        .map((room) => {
          if (!room.coordinates?.lat || !room.coordinates?.lng) {
            return null
          }

          const distance = getDistance(
            lat,
            lng,
            room.coordinates.lat,
            room.coordinates.lng
          )

          if (distance > Number(radius)) {
            return null
          }

          return {
            ...room,
            distance,
          }
        })
        .filter(Boolean)
        .sort((left, right) => left.distance - right.distance)
    }

    return res.json({
      filter,
      count: results.length,
      rooms: results,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

const getSimilarRooms = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate(
      "owner",
      "name phone email role"
    )

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      })
    }

    const similarRooms = await Room.find({
      _id: { $ne: room._id },
      $or: [{ category: room.category }, { area: room.area }],
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("owner", "name phone email role")

    const results = similarRooms.map((item) => ({
      ...item.toObject(),
      isVerified: isRoomVerified(item),
    }))

    return res.json(results)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

const searchRooms = async (req, res) => {
  try {
    const { location, roomType, minBudget, maxBudget, search } = req.query

    let query = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "owner.name": { $regex: search, $options: "i" } },
      ]
    }

    if (roomType && roomType.toLowerCase() !== "all") {
      query.category = roomType
    }

    if (location && location.toLowerCase() !== "all") {
      query.location = { $regex: location, $options: "i" }
    }

    if (minBudget || maxBudget) {
      query.price = {}
      if (minBudget) {
        query.price.$gte = Number(minBudget)
      }
      if (maxBudget) {
        query.price.$lte = Number(maxBudget)
      }
    }

    const rooms = await Room.find(query)
      .sort({ createdAt: -1 })
      .populate("owner", "name phone email role")

    return res.json(rooms)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

// GET OWNER MAP DATA (rooms with coordinates only)
const getOwnerMapData = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        message: "Only owners can view map data",
      })
    }

    const rooms = await Room.find({
      owner: req.user._id,
      "coordinates.lat": { $exists: true, $ne: null },
      "coordinates.lng": { $exists: true, $ne: null },
    })

    return res.json(rooms)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
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
}
