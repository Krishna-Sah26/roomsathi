function getDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371

  const startLat = (Number(lat1) * Math.PI) / 180
  const endLat = (Number(lat2) * Math.PI) / 180
  const deltaLat = ((Number(lat2) - Number(lat1)) * Math.PI) / 180
  const deltaLon = ((Number(lon2) - Number(lon1)) * Math.PI) / 180

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(startLat) *
      Math.cos(endLat) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadius * c
}

module.exports = getDistance
