import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Home, MapPin, Wallet } from "lucide-react"
import { useTheme } from "../hooks/useTheme"

function SearchBox({ search, onSearch }) {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [roomType, setRoomType] = useState("all")
  const [budget, setBudget] = useState("")
  const isDark = theme === "dark"

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (search.trim()) {
      params.append("location", search)
    }
    if (roomType && roomType !== "all") {
      params.append("roomType", roomType)
    }
    if (budget.trim()) {
      params.append("maxBudget", budget)
    }
    
    navigate(`/rooms?${params.toString()}`)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className={isDark ? "mx-auto w-full max-w-4xl rounded-2xl border-4 border-blue-500 bg-slate-950 p-3 shadow-[0_20px_45px_rgba(2,6,23,0.35)]" : "mx-auto w-full max-w-4xl rounded-2xl border-4 border-blue-700 bg-white p-3 shadow-[0_20px_45px_rgba(15,23,42,0.18)]"}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.3fr_1fr_1fr_auto]">
        <label className={isDark ? "flex items-center gap-3 rounded-xl px-4 py-4 text-base text-slate-300" : "flex items-center gap-3 rounded-xl px-4 py-4 text-base text-slate-500"}>
          <MapPin className="shrink-0 text-blue-600" size={18} />
          <input
            type="text"
            placeholder="Location | e.g. Birgunj"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            className={isDark ? "w-full bg-transparent text-base text-white outline-none placeholder:text-slate-400" : "w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"}
          />
        </label>

        <label className={isDark ? "flex items-center justify-between gap-3 rounded-xl px-4 py-4 text-base text-slate-300" : "flex items-center justify-between gap-3 rounded-xl px-4 py-4 text-base text-slate-500"}>
          <div className="flex items-center gap-3">
            <Home className="shrink-0 text-blue-600" size={18} />
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className={isDark ? "w-full bg-slate-950 text-base text-white outline-none" : "w-full bg-transparent text-base text-slate-900 outline-none"}
            >
              <option className={isDark ? "bg-slate-950 text-white" : ""} value="all">All Types</option>
              <option className={isDark ? "bg-slate-950 text-white" : ""} value="single room">Single Room</option>
              <option className={isDark ? "bg-slate-950 text-white" : ""} value="flat">Flat</option>
              <option className={isDark ? "bg-slate-950 text-white" : ""} value="hostel">Hostel</option>
              <option className={isDark ? "bg-slate-950 text-white" : ""} value="apartment">Apartment</option>
              <option className={isDark ? "bg-slate-950 text-white" : ""} value="shared">Shared</option>
            </select>
          </div>
        </label>

        <label className={isDark ? "flex items-center gap-3 rounded-xl px-4 py-4 text-base text-slate-300" : "flex items-center gap-3 rounded-xl px-4 py-4 text-base text-slate-500"}>
          <Wallet className="shrink-0 text-blue-600" size={18} />
          <input
            type="number"
            placeholder="Max Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            onKeyPress={handleKeyPress}
            className={isDark ? "w-full bg-transparent text-base text-white outline-none placeholder:text-slate-400" : "w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"}
          />
        </label>

        <button
          type="button"
          onClick={handleSearch}
          className="rounded-xl bg-blue-700 px-7 py-4 text-base font-semibold text-white transition hover:bg-blue-800"
        >
          Search
        </button>
      </div>
    </div>
  )
}

export default SearchBox
