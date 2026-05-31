const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "owner"],
      default: "user",
    },

    savedRooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],

    searchHistory: [
      {
        query: String,
        location: String,
        roomType: String,
        maxBudget: Number,
        filter: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    ownerSettings: {
      businessName: {
        type: String,
        trim: true,
        default: "",
      },
      bio: {
        type: String,
        trim: true,
        default: "",
      },
      notifyLeads: {
        type: Boolean,
        default: true,
      },
      notifyViews: {
        type: Boolean,
        default: true,
      },
      showPhoneOnListings: {
        type: Boolean,
        default: true,
      },
    },

    resetPasswordCode: {
      type: String,
      default: "",
    },

    resetPasswordCodeExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)
