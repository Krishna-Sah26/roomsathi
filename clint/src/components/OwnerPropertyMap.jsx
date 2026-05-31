import { useEffect } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import { Link } from "react-router-dom"
import L from "leaflet"

const defaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function MapCenter({ position }) {
  const map = useMap()

  useEffect(() => {
    if (position && position.length === 2) {
      map.setView(position, 15)
    }
  }, [map, position])

  return null
}

function OwnerPropertyMap({ rooms, loading }) {
  const birgunjCenter = [27.0104, 84.877]

  const roomsWithCoordinates = rooms.filter(
    (room) => room.coordinates?.lat && room.coordinates?.lng
  )

  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-slate-900">Property Map</h3>
        <p className="mt-2 text-sm text-slate-600">
          Birgunj, Nepal — your listed properties appear as pins on the map
        </p>
      </div>

      {loading ? (
        <div className="flex h-96 items-center justify-center rounded-2xl bg-[#f7f7ff] text-slate-500">
          Loading map...
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
          <MapContainer
            center={birgunjCenter}
            zoom={15}
            style={{
              height: "400px",
              width: "100%",
            }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapCenter position={birgunjCenter} />
            {roomsWithCoordinates.map((room) => (
              <Marker
                key={room._id}
                position={[room.coordinates.lat, room.coordinates.lng]}
                icon={defaultIcon}
              >
                <Popup className="max-w-xs">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900">{room.title}</h4>
                    <p className="text-sm text-slate-600">{room.location}</p>
                    <p className="text-sm font-semibold text-blue-700">Rs {room.price}</p>
                    <div className="flex gap-2 pt-2">
                      <Link
                        to={`/edit-room/${room._id}`}
                        className="rounded bg-blue-700 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-800"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {!loading && roomsWithCoordinates.length === 0 ? (
        <p className="mt-3 text-xs text-slate-500">
          Birgunj map is shown. Add a room with map location to see your property pins here.
        </p>
      ) : null}

      <div className="mt-4 text-sm text-slate-600">
        <strong>Total Properties:</strong> {rooms.length} ({roomsWithCoordinates.length} with map location)
      </div>
    </div>
  )
}

export default OwnerPropertyMap

