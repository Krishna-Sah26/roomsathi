import { useCallback, useEffect, useState, useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Filter, MapPin, PhoneCall, ShieldCheck, Star, LayoutGrid } from "lucide-react"
import axios from "axios"
import API from "../services/api"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import RoomCard from "../components/RoomCard"
import SearchLocationMap from "../components/SearchLocationMap"
import { useTheme } from "../hooks/useTheme"
import { isBirgunjText } from "../utils/birgunj"

const FILTER_TABS = [
  { id: "all", label: "All Rooms", icon: MapPin },
  { id: "verified", label: "Verified", icon: ShieldCheck },
  { id: "newest", label: "Newest", icon: Star },
]

function Rooms() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { theme } = useTheme()

  const queryLocation = searchParams.get("location") || ""
  const queryRoomType = searchParams.get("roomType") || ""
  const queryMaxBudget = searchParams.get("maxBudget") || ""
  const queryFilter = searchParams.get("filter") || "all"

  const [rooms, setRooms] = useState([])
  const [searchValue, setSearchValue] = useState(queryLocation)
  const [geoQuery, setGeoQuery] = useState("")
  const [geoPosition, setGeoPosition] = useState([27.0104, 84.877])
  const [geoAddress, setGeoAddress] = useState("Birgunj, Nepal")
  const [geoLoading, setGeoLoading] = useState(false)
  const [roomsLoading, setRoomsLoading] = useState(true)
  const [nearbyPlaces, setNearbyPlaces] = useState([])
  const [placesLoading, setPlacesLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState(queryFilter)
  const [selectedRoomType, setSelectedRoomType] = useState(queryRoomType)
  const [selectedBudget, setSelectedBudget] = useState(queryMaxBudget)
  const [showFilters, setShowFilters] = useState(false)
  const [supportPhone, setSupportPhone] = useState("9800000000")

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null")

  const authHeaders = useMemo(
    () => userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {},
    [userInfo?.token]
  )

  const saveSearchHistory = useCallback(
    async (payload) => {
      if (!userInfo?.token) {
        return
      }

      try {
        await API.post("/users/search-history", payload, {
          headers: authHeaders,
        })
      } catch (error) {
        console.log(error)
      }
    },
    [authHeaders, userInfo?.token]
  )

  const refreshRooms = useCallback(async () => {
    try {
      setRoomsLoading(true)
      const params = new URLSearchParams({
        filter: activeFilter,
      })

      if (searchValue.trim()) {
        params.set("search", searchValue.trim())
      }
      if (selectedRoomType) {
        params.set("roomType", selectedRoomType)
      }
      if (selectedBudget) {
        params.set("maxBudget", selectedBudget)
      }
      if (geoPosition?.length === 2) {
        params.set("lat", String(geoPosition[0]))
        params.set("lng", String(geoPosition[1]))
      }

      const { data } = await API.get(`/rooms/explore?${params.toString()}`)
      setRooms(data.rooms || [])

      await saveSearchHistory({
        query: searchValue,
        location: geoAddress,
        roomType: selectedRoomType,
        maxBudget: selectedBudget,
        filter: activeFilter,
      })
    } catch (error) {
      console.log(error)
    } finally {
      setRoomsLoading(false)
    }
  }, [
    activeFilter,
    geoAddress,
    geoPosition,
    saveSearchHistory,
    searchValue,
    selectedBudget,
    selectedRoomType,
  ])

  useEffect(() => {
    API.get("/explore/support")
      .then(({ data }) => setSupportPhone(data.whatsapp))
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadRooms = async () => {
      try {
        setRoomsLoading(true)
        const params = new URLSearchParams({
          filter: activeFilter,
        })

        if (searchValue.trim()) {
          params.set("search", searchValue.trim())
        }
        if (selectedRoomType) {
          params.set("roomType", selectedRoomType)
        }
        if (selectedBudget) {
          params.set("maxBudget", selectedBudget)
        }
        if (geoPosition?.length === 2) {
          params.set("lat", String(geoPosition[0]))
          params.set("lng", String(geoPosition[1]))
        }

        const { data } = await API.get(`/rooms/explore?${params.toString()}`)

        if (cancelled) {
          return
        }

        setRooms(data.rooms || [])

        await saveSearchHistory({
          query: searchValue,
          location: geoAddress,
          roomType: selectedRoomType,
          maxBudget: selectedBudget,
          filter: activeFilter,
        })
      } catch (error) {
        console.log(error)
      } finally {
        if (!cancelled) {
          setRoomsLoading(false)
        }
      }
    }

    void loadRooms()

    return () => {
      cancelled = true
    }
  }, [activeFilter, geoAddress, geoPosition, saveSearchHistory, searchValue, selectedBudget, selectedRoomType])

  useEffect(() => {
    let cancelled = false

    const loadPlaces = async () => {
      try {
        setPlacesLoading(true)
        const { data } = await API.get(
          `/explore/nearby-places?lat=${geoPosition[0]}&lng=${geoPosition[1]}`
        )

        if (!cancelled) {
          setNearbyPlaces(data)
        }
      } catch (error) {
        console.log(error)
        if (!cancelled) {
          setNearbyPlaces([])
        }
      } finally {
        if (!cancelled) {
          setPlacesLoading(false)
        }
      }
    }

    void loadPlaces()

    return () => {
      cancelled = true
    }
  }, [geoPosition])

  const reverseGeocode = async (lat, lng) => {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    )
    return response.data?.display_name || "Selected location"
  }

  const handleSearchPlace = async () => {
    if (!geoQuery.trim()) {
      return
    }

    try {
      setGeoLoading(true)
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          `${geoQuery} Birgunj`
        )}&format=json&limit=1`
      )

      const result = response.data?.[0]
      if (!result) {
        setGeoAddress("No matching place found")
        return
      }

      const lat = Number(result.lat)
      const lng = Number(result.lon)
      const label = result.display_name || geoQuery

      if (!isBirgunjText(label)) {
        setGeoAddress("No matching Birgunj place found")
        return
      }

      setGeoPosition([lat, lng])
      setGeoAddress(label)
    } catch (error) {
      console.log(error)
    } finally {
      setGeoLoading(false)
    }
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support location access")
      return
    }

    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          const label = await reverseGeocode(lat, lng)

          if (!isBirgunjText(label)) {
            setGeoAddress("Current location is outside Birgunj")
            return
          }

          setGeoPosition([lat, lng])
          setGeoAddress(label)
        } catch (error) {
          console.log(error)
        } finally {
          setGeoLoading(false)
        }
      },
      () => {
        setGeoLoading(false)
        alert("Unable to access your current location")
      }
    )
  }

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId)
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.set("filter", filterId)
      return next
    })
  }

  const handleWhatsAppSupport = () => {
    const message = encodeURIComponent("Hi RoomSathi, I need help finding a room in Birgunj.")
    window.open(`https://wa.me/977${supportPhone}?text=${message}`, "_blank")
  }

  const applyTopFilters = () => {
    setSearchParams({
      filter: activeFilter,
      location: searchValue,
      roomType: selectedRoomType,
      maxBudget: selectedBudget,
    })
    void refreshRooms()
  }

  const sidebarButtonClass = (filterId) =>
    `flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left font-semibold transition ${
      activeFilter === filterId
        ? "bg-blue-700 text-white"
        : theme === "dark" ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 hover:bg-white"
    }`

  const filteredCount = rooms.length

  return (
    <div className={theme === "dark" ? "min-h-screen pt-16 bg-slate-950 text-slate-100" : "min-h-screen pt-16 bg-slate-100 text-slate-900"}>
      <Navbar />

      <div className={theme === "dark" ? "mx-auto flex max-w-[1600px] bg-slate-950" : "mx-auto flex max-w-[1600px]"}>
        <aside className={theme === "dark" ? "hidden w-[300px] shrink-0 border-r border-slate-800 bg-slate-900 px-4 py-8 lg:block" : "hidden w-[300px] shrink-0 border-r border-slate-200 bg-[#f8f8ff] px-4 py-8 lg:block"}>
          <div className="text-sm text-blue-700">Filters</div>
          <div className={theme === "dark" ? "mt-1 text-lg font-medium text-slate-300" : "mt-1 text-lg font-medium text-slate-500"}>Birgunj Market</div>

          <div className="mt-10 space-y-4">
            {FILTER_TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleFilterChange(tab.id)}
                  className={sidebarButtonClass(tab.id)}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              )
            })}
            
            {userInfo?.token && userInfo.role === "user" && (
              <Link
                to="/user-dashboard"
                className="flex w-full items-center gap-3 rounded-2xl bg-blue-700 px-4 py-4 text-left font-semibold text-white transition hover:bg-blue-800"
              >
                <LayoutGrid size={20} />
                My Dashboard
              </Link>
            )}

            <button
              type="button"
              onClick={handleWhatsAppSupport}
              className="mt-6 flex w-full items-center gap-3 rounded-2xl bg-orange-700 px-4 py-4 text-left font-semibold text-white transition hover:bg-orange-600"
            >
              <PhoneCall size={20} />
              WhatsApp Support
            </button>
          </div>
        </aside>

        <main className="flex-1 px-4 py-8 md:px-6">
          <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden">
            {FILTER_TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleFilterChange(tab.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                    activeFilter === tab.id
                      ? "bg-blue-700 text-white"
                      : theme === "dark" ? "bg-slate-800 text-slate-200 ring-1 ring-slate-700" : "bg-white text-slate-700 ring-1 ring-slate-200"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
            
            {userInfo?.token && userInfo.role === "user" && (
              <Link
                to="/user-dashboard"
                className="flex shrink-0 items-center gap-2 rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white"
              >
                <LayoutGrid size={16} />
                My Dashboard
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className={theme === "dark" ? "text-3xl font-bold tracking-tight text-white md:text-4xl" : "text-3xl font-bold tracking-tight md:text-4xl"}>
                Available Rooms in Birgunj
              </h2>
              <p className={theme === "dark" ? "mt-3 text-base text-slate-300" : "mt-3 text-base text-slate-600"}>
                Showing {filteredCount} properties
                {activeFilter === "verified" ? " (verified only)" : ""}
                {activeFilter === "newest" ? " (newest first)" : ""}
              </p>
            </div>

            <div className="flex items-center gap-3 self-end">
              <button
                type="button"
                onClick={() => setShowFilters((current) => !current)}
                className={theme === "dark" ? "rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-200" : "rounded-xl border border-slate-200 bg-white p-3 text-slate-700"}
              >
                <Filter size={22} />
              </button>
            </div>
          </div>

          {showFilters ? (
            <div className={theme === "dark" ? "mt-4 grid grid-cols-1 gap-3 rounded-2xl bg-slate-900 p-4 ring-1 ring-slate-800 md:grid-cols-4" : "mt-4 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200 md:grid-cols-4"}>
              <select
                value={selectedRoomType}
                onChange={(event) => setSelectedRoomType(event.target.value)}
                className={theme === "dark" ? "rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none text-slate-100" : "rounded-xl border border-slate-200 bg-[#f7f7ff] px-4 py-3 outline-none"}
              >
                <option value="">All categories</option>
                <option value="Single Room">Single Room</option>
                <option value="Flat">Flat</option>
                <option value="Hostel">Hostel</option>
              </select>
              <input
                type="number"
                placeholder="Max budget (NPR)"
                value={selectedBudget}
                onChange={(event) => setSelectedBudget(event.target.value)}
                className={theme === "dark" ? "rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none text-slate-100" : "rounded-xl border border-slate-200 bg-[#f7f7ff] px-4 py-3 outline-none"}
              />
              <input
                type="text"
                placeholder="Search area or title"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                className={theme === "dark" ? "rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none text-slate-100 md:col-span-2" : "rounded-xl border border-slate-200 bg-[#f7f7ff] px-4 py-3 outline-none md:col-span-2"}
              />
              <button
                type="button"
                onClick={applyTopFilters}
                className="rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800"
              >
                Apply Filters
              </button>
            </div>
          ) : null}

          <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="min-w-0">
              <div className="mb-5">
                <h3 className={theme === "dark" ? "text-2xl font-bold tracking-tight text-white md:text-3xl" : "text-2xl font-bold tracking-tight md:text-3xl"}>Smart Geo Explorer</h3>
                <p className={theme === "dark" ? "mt-2 text-sm text-slate-300" : "mt-2 text-sm text-slate-600"}>
                  Search places, use your current location, and see rooms near you.
                </p>
              </div>

              <SearchLocationMap
                query={geoQuery}
                onQueryChange={setGeoQuery}
                onSearch={handleSearchPlace}
                onUseCurrentLocation={handleUseCurrentLocation}
                position={geoPosition}
                address={geoAddress}
                loading={geoLoading}
              />

              <button
                type="button"
                onClick={() => void refreshRooms()}
                className="mt-4 w-full rounded-2xl bg-blue-700 px-4 py-4 text-sm font-semibold text-white transition hover:bg-blue-800 md:w-auto md:px-8"
              >
                Rooms Near This Point
              </button>
            </div>

            <div className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-6 shadow-sm ring-1 ring-slate-800" : "rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200"}>
              <h4 className={theme === "dark" ? "text-xl font-semibold text-white" : "text-xl font-semibold text-slate-900"}>Nearby Places</h4>
              <p className={theme === "dark" ? "mt-2 text-sm text-slate-300" : "mt-2 text-sm text-slate-600"}>
                Live place search using OpenStreetMap data.
              </p>

              <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto">
                {placesLoading ? (
                  <div className={theme === "dark" ? "rounded-2xl bg-slate-800 p-4 text-sm text-slate-400" : "rounded-2xl bg-[#f7f7ff] p-4 text-sm text-slate-500"}>
                    Loading nearby places...
                  </div>
                ) : nearbyPlaces.length > 0 ? (
                  nearbyPlaces.map((place) => (
                    <div
                      key={place.id}
                      className={theme === "dark" ? "rounded-2xl bg-slate-800 p-4 text-sm text-slate-300" : "rounded-2xl bg-[#f7f7ff] p-4 text-sm text-slate-700"}
                    >
                      <div className={theme === "dark" ? "font-semibold text-white" : "font-semibold text-slate-900"}>{place.name}</div>
                      <div className={theme === "dark" ? "mt-1 text-xs uppercase tracking-[0.18em] text-slate-400" : "mt-1 text-xs uppercase tracking-[0.18em] text-slate-500"}>
                        {place.amenity}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={theme === "dark" ? "rounded-2xl bg-slate-800 p-4 text-sm text-slate-400" : "rounded-2xl bg-[#f7f7ff] p-4 text-sm text-slate-500"}>
                    Search a Birgunj location on the map to load nearby schools, hospitals, and markets.
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {roomsLoading ? (
              <div className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-8 text-slate-400 ring-1 ring-slate-800 sm:col-span-2 xl:col-span-3" : "rounded-[24px] bg-white p-8 text-slate-500 ring-1 ring-slate-200 sm:col-span-2 xl:col-span-3"}>
                Loading rooms...
              </div>
            ) : rooms.length > 0 ? (
              rooms.map((room) => <RoomCard key={room._id} room={room} />)
            ) : (
              <div className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-8 text-slate-400 ring-1 ring-slate-800 sm:col-span-2 xl:col-span-3" : "rounded-[24px] bg-white p-8 text-slate-500 ring-1 ring-slate-200 sm:col-span-2 xl:col-span-3"}>
                No rooms found for this filter.
              </div>
            )}
          </section>

          <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="rounded-[24px] bg-blue-700 p-8 text-white shadow-sm">
              <div className="max-w-2xl">
                <h3 className="text-4xl font-bold tracking-tight md:text-5xl">Post Your Room?</h3>
                <p className="mt-6 max-w-xl text-lg leading-9 text-blue-100">
                  Reach potential tenants in Birgunj every month. List your property for free.
                </p>
                <Link
                  to="/login?role=owner"
                  className="mt-10 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-blue-700"
                >
                  List Your Property
                </Link>
              </div>
            </div>

            <div className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-6 shadow-sm ring-1 ring-slate-800" : "rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200"}>
              <h4 className={theme === "dark" ? "text-xl font-semibold text-white" : "text-xl font-semibold text-slate-900"}>Need help?</h4>
              <p className={theme === "dark" ? "mt-3 text-sm leading-7 text-slate-300" : "mt-3 text-sm leading-7 text-slate-600"}>
                Chat with RoomSathi support on WhatsApp for finding rooms in Birgunj.
              </p>
              <button
                type="button"
                onClick={handleWhatsAppSupport}
                className="mt-5 w-full rounded-xl bg-orange-700 px-4 py-3 font-semibold text-white hover:bg-orange-600"
              >
                WhatsApp Support
              </button>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default Rooms
