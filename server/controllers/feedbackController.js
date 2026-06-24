const Feedback = require("../models/Feedback")

const createFeedback = async (req, res) => {
  try {
    const name = req.body.name?.trim()
    const message = req.body.message?.trim()

    if (!name || !message) {
      return res.status(400).json({
        message: "Name and feedback message are required",
      })
    }

    const feedback = await Feedback.create({
      name,
      role: req.body.role?.trim() || "Guest",
      rating: Number(req.body.rating) || 5,
      message,
      image: req.body.image?.trim() || "",
    })

    return res.status(201).json({
      message: "Feedback saved successfully",
      feedback,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(50)

    return res.json(feedbacks)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  createFeedback,
  getFeedbacks,
}
