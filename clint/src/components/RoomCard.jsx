import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import { useTheme } from "../hooks/useTheme"

function RoomCard({ room, saved, onSaveToggle }) {
  const navigate = useNavigate()
  const roomImage = room.images?.[0]
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()

  const handleSaveToggle = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null")

      if (!userInfo?.token) {
        alert("Please login to save rooms")
        return
      }

      setLoading(true)

      if (saved) {
        await API.delete(`/users/save/${room._id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        })
      } else {
        await API.post(
          `/users/save/${room._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        )
      }

      onSaveToggle && onSaveToggle(room._id, !saved)
    } catch (error) {
      alert(error?.response?.data?.message || "Unable to update saved status")
    } finally {
      setLoading(false)
    }
  }

  const openRoomDetails = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null")

    if (!userInfo?.token) {
      navigate("/login", {
        state: {
          message: "Please login first to view room details",
          role: "user",
        },
      })
      return
    }

    navigate(`/room-details/${room._id}`)
  }

  return (
    <div className={theme === "dark" ? "overflow-hidden rounded-2xl bg-slate-900 shadow-sm ring-1 ring-slate-800" : "overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"}>
      <button
        type="button"
        onClick={openRoomDetails}
        className="block w-full text-left"
      >
        {roomImage ? (
          <img
            src={roomImage}
            alt={room.title}
            className="h-56 w-full object-cover"
          />
        ) : (
          <div className={theme === "dark" ? "flex h-56 w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-sm font-medium text-slate-400" : "flex h-56 w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-medium text-slate-500"}>
            No uploaded image
          </div>
        )}
      </button>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <button
            type="button"
            onClick={openRoomDetails}
          className={theme === "dark" ? "text-left text-base font-semibold text-white transition hover:text-blue-300" : "text-left text-base font-semibold text-slate-900 transition hover:text-blue-700"}
          >
            {room.title}
          </button>
          <span className="shrink-0 text-sm font-semibold text-blue-700">
            Rs. {room.price}
          </span>
        </div>

        <p className={theme === "dark" ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-500"}>
          {room.location}
        </p>

        {typeof room.distance === "number" ? (
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
            {room.distance.toFixed(1)} km away
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSaveToggle}
          disabled={loading}
          className={saved 
            ? "mt-4 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            : "mt-4 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"}
        >
          {loading ? "Updating..." : saved ? "Saved" : "Save Room"}
        </button>

        <button
          type="button"
          onClick={openRoomDetails}
          className="mt-5 block w-full rounded-xl bg-blue-700 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

export default RoomCard
