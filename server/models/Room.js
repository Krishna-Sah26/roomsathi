const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema(
  {
    title: String,

    category: String,

    price: Number,

    area: String,

    location: String,

    description: String,

    amenities: [String],

    images: [String],

    phone: String,

    whatsapp: String,

    coordinates: {
      lat: Number,
      lng: Number,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    views: {
      type: Number,
      default: 0,
    },

    inquiries: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Room", roomSchema)
