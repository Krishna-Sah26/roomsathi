import { useEffect } from "react"
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

function MapSync({ position }) {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom())
    }
  }, [map, position])

  return null
}

function MapClickHandler({ editable, onPositionChange }) {
  useMapEvents({
    click(event) {
      if (!editable || !onPositionChange) {
        return
      }

      onPositionChange({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      })
    },
  })

  return null
}

function LocationPicker({
  position,
  editable = true,
  center = [27.0104, 84.877],
  onPositionChange,
}) {
  return (
    <MapContainer
      center={center}
      zoom={position ? 15 : 15}
      scrollWheelZoom={editable}
      style={{
        height: "320px",
        width: "100%",
        borderRadius: "20px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapSync position={position} />
      <MapClickHandler editable={editable} onPositionChange={onPositionChange} />
      {position ? <Marker position={[position.lat, position.lng]} /> : null}
    </MapContainer>
  )
}

export default LocationPicker
