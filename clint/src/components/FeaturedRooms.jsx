import { useEffect, useMemo, useState } from "react"
import API from "../services/api"
import RoomCard from "./RoomCard"
import { useTheme } from "../hooks/useTheme"

function FeaturedRooms({ search }) {
  // Rooms loaded from the backend
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  const handleRoomDeleted = (roomId) => {
    setRooms((currentRooms) => currentRooms.filter((room) => room._id !== roomId))
  }

  useEffect(() => {
    // Load rooms from the backend without blocking render.
    API.get("/rooms")
      .then(({ data }) => {
        setRooms(data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filteredRooms = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) {
      return rooms
    }

    return rooms.filter((room) => {
      const location = room.location?.toLowerCase() || ""
      const title = room.title?.toLowerCase() || ""
      const category = room.category?.toLowerCase() || ""

      return (
        location.includes(value) ||
        title.includes(value) ||
        category.includes(value)
      )
    })
  }, [rooms, search])

  return (
    <section className={theme === "dark" ? "bg-slate-950 px-4 py-14 md:py-20" : "bg-[#f7f6ff] px-4 py-14 md:py-20"}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className={theme === "dark" ? "text-2xl font-semibold tracking-tight text-white md:text-3xl" : "text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl"}>
            Latest Rooms
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {loading ? (
            <div className={theme === "dark" ? "rounded-2xl bg-slate-900 p-6 text-slate-400 ring-1 ring-slate-800" : "rounded-2xl bg-white p-6 text-slate-500 ring-1 ring-slate-200"}>
              Loading rooms...
            </div>
          ) : filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard key={room._id} room={room} onDelete={handleRoomDeleted} />
            ))
          ) : (
            <div className={theme === "dark" ? "rounded-2xl bg-slate-900 p-6 text-slate-400 ring-1 ring-slate-800 md:col-span-3" : "rounded-2xl bg-white p-6 text-slate-500 ring-1 ring-slate-200 md:col-span-3"}>
              No live room listings yet. Owner-added rooms will appear here after they publish.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FeaturedRooms
