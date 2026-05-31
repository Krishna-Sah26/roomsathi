const axios = require("axios")

const formatPlace = (element) => ({
  id: element.id,
  name: element.tags?.name || element.tags?.["name:en"] || "Unnamed place",
  amenity:
    element.tags?.amenity ||
    element.tags?.shop ||
    element.tags?.public_transport ||
    "place",
  lat: element.lat || element.center?.lat,
  lng: element.lon || element.center?.lon,
})

const getNearbyPlaces = async (req, res) => {
  try {
    const lat = Number(req.query.lat)
    const lng = Number(req.query.lng)

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      })
    }

    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"college|hospital|school|clinic|marketplace|bus_station"](around:4000,${lat},${lng});
        way["amenity"~"college|hospital|school|clinic|marketplace"](around:4000,${lat},${lng});
      );
      out center 20;
    `

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    )

    const places = (response.data?.elements || [])
      .map(formatPlace)
      .filter((place) => place.name && place.name !== "Unnamed place")
      .slice(0, 12)

    return res.json(places)
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Unable to load nearby places",
    })
  }
}

const getSupportInfo = async (req, res) => {
  return res.json({
    whatsapp: process.env.SUPPORT_WHATSAPP || "9800000000",
    label: "RoomSathi Birgunj Support",
    message: "Hi RoomSathi, I need help finding a room in Birgunj.",
  })
}

module.exports = {
  getNearbyPlaces,
  getSupportInfo,
}
