const mongoose = require("mongoose")

const leadSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    seekerName: {
      type: String,
      trim: true,
    },
    seekerPhone: {
      type: String,
      trim: true,
    },
    seekerEmail: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["whatsapp", "call"],
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "read"],
      default: "new",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Lead", leadSchema)
