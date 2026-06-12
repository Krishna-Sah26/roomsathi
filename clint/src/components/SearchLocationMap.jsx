import { useEffect } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"

function MapCenter({ position }) {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.setView(position, 15)
    }
  }, [map, position])

  return null
}

function SearchLocationMap({
  query,
  onQueryChange,
  onSearch,
  onUseCurrentLocation,
  position,
  address,
  loading,
}) {
  return (
    <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search place like Ghantaghar, Adarshnagar..."
          className="w-full rounded-2xl border border-slate-200 bg-[#f7f7ff] px-4 py-3 text-base outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={onSearch}
          className="rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 sm:text-base"
        >
          Search
        </button>
        <button
          type="button"
          onClick={onUseCurrentLocation}
          className="rounded-2xl border border-blue-700 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 sm:text-base"
        >
          Use My Location
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-[24px] ring-1 ring-slate-200">
        <MapContainer
          center={position || [27.0104, 84.877]}
          zoom={15}
          style={{
            height: "clamp(280px, 45vh, 360px)",
            width: "100%",
          }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapCenter position={position} />
          {position ? (
            <Marker position={position}>
              <Popup>{address || "Selected location"}</Popup>
            </Marker>
          ) : null}
        </MapContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm leading-6 text-slate-600">
        <p>{address || "Search a place or use your current location."}</p>
        {loading ? <span className="font-medium text-blue-700">Loading...</span> : null}
      </div>
    </div>
  )
}

export default SearchLocationMap
