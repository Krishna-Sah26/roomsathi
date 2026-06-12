import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Heart,
  LayoutGrid,
  Search,
  ShieldCheck,
  Star,
  Bookmark,
  MessageSquareText,
  History,
  PhoneCall,
} from "lucide-react"
import API from "../services/api"
import BrandLogo from "../components/BrandLogo"
import Footer from "../components/Footer"
import RoomCard from "../components/RoomCard"
import ThemeToggle from "../components/ThemeToggle"
import { useTheme } from "../hooks/useTheme"

const SIDEBAR_TABS = [
  { id: "all", label: "All Rooms", icon: LayoutGrid, link: "/rooms?filter=all" },
  { id: "verified", label: "Verified", icon: ShieldCheck, link: "/rooms?filter=verified" },
  { id: "newest", label: "Newest", icon: Star, link: "/rooms?filter=newest" },
  { id: "saved", label: "Saved", icon: Bookmark, link: null },
]

function UserDashboard() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null")
  const userToken = userInfo?.token

  const [profile, setProfile] = useState(null)
  const [savedRooms, setSavedRooms] = useState([])
  const [recommendedRooms, setRecommendedRooms] = useState([])
  const [contacts, setContacts] = useState([])
  const [searchHistory, setSearchHistory] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [supportPhone, setSupportPhone] = useState("9800000000")
  const [activeTab, setActiveTab] = useState("saved")
  const [loading, setLoading] = useState(true)

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${userToken}` }),
    [userToken]
  )

  useEffect(() => {
    if (!userToken) {
      navigate("/login?role=user")
      return
    }

    let cancelled = false

    const loadDashboard = async () => {
      try {
        const [profileRes, savedRes, recommendedRes, contactsRes, historyRes, supportRes] =
          await Promise.all([
            API.get("/users/me", { headers: authHeaders }),
            API.get("/users/saved", { headers: authHeaders }),
            API.get("/users/recommended", { headers: authHeaders }),
            API.get("/users/contacts", { headers: authHeaders }),
            API.get("/users/search-history", { headers: authHeaders }),
            API.get("/explore/support"),
          ])

        if (cancelled) {
          return
        }

        setProfile(profileRes.data)
        setSavedRooms(savedRes.data)
        setRecommendedRooms(recommendedRes.data)
        setContacts(contactsRes.data)
        setSearchHistory(historyRes.data)
        setSupportPhone(supportRes.data.whatsapp)

        const updatedUser = {
          ...userInfo,
          name: profileRes.data.name,
          phone: profileRes.data.phone,
        }
        localStorage.setItem("userInfo", JSON.stringify(updatedUser))
      } catch (error) {
        console.log(error)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadDashboard()

    return () => {
      cancelled = true
    }
  }, [authHeaders, navigate, userInfo, userToken])

  const handleLogout = () => {
    localStorage.removeItem("userInfo")
    navigate("/")
  }

  const handleWhatsAppSupport = () => {
    const message = encodeURIComponent("Hi RoomSathi, I need help finding a room in Birgunj-City.")
    window.open(`https://wa.me/977${supportPhone}?text=${message}`, "_blank")
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchValue.trim()) {
      params.set("location", searchValue.trim())
    }
    navigate(`/rooms?${params.toString()}`)
  }

  const sidebarButtonClass = (tabId) =>
    `flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left font-semibold transition ${
      activeTab === tabId ? "bg-blue-700 text-white" : "text-slate-700 hover:bg-white"
    }`

  const displayName = profile?.name || userInfo?.name || "Seeker"

  const handleRoomDeleted = (roomId) => {
    setSavedRooms((currentRooms) => currentRooms.filter((room) => room._id !== roomId))
    setRecommendedRooms((currentRooms) =>
      currentRooms.filter((room) => room._id !== roomId)
    )
    setContacts((currentContacts) =>
      currentContacts.filter((lead) => lead.room?._id !== roomId && lead.room !== roomId)
    )
  }

  return (
    <div className={theme === "dark" ? "min-h-screen bg-slate-950 text-slate-100" : "min-h-screen bg-[#f5f5ff] text-slate-900"}>
      <header className={theme === "dark" ? "border-b border-slate-800 bg-slate-950/90 backdrop-blur" : "border-b border-slate-200 bg-white/90 backdrop-blur"}>
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <BrandLogo
            to="/"
            size="lg"
            textClassName={theme === "dark" ? "text-2xl text-white" : "text-2xl text-blue-700"}
          />

          <div className="hidden flex-1 px-8 lg:block">
            <div className="mx-auto flex max-w-xl items-center gap-3 rounded-full border border-slate-200 bg-[#f7f7ff] px-5 py-3 text-slate-400">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search rooms in Birgunj..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSearch()}
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <ThemeToggle />
            <div className={theme === "dark" ? "flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900 px-3 py-2 shadow-sm" : "flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm"}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden leading-tight md:block">
                <div className="text-sm font-semibold text-slate-900">{displayName}</div>
                <div className="text-xs text-slate-500">{profile?.email || "Seeker account"}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-blue-700 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-800 sm:px-4 sm:text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        <aside className={theme === "dark" ? "hidden w-[300px] shrink-0 border-r border-slate-800 bg-slate-900 px-4 py-8 lg:block" : "hidden w-[300px] shrink-0 border-r border-slate-200 bg-[#f8f8ff] px-4 py-8 lg:block"}>
          <div className="text-sm text-blue-700">Filters</div>
          <div className="mt-1 text-lg font-medium text-slate-500">Birgunj Market</div>

          <nav className="mt-10 space-y-4">
            {SIDEBAR_TABS.map((tab) => {
              const Icon = tab.icon
              if (tab.link) {
                return (
                  <Link
                    key={tab.id}
                    to={tab.link}
                    className={theme === "dark" ? "flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left font-semibold text-slate-300 transition hover:bg-slate-800" : "flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left font-semibold text-slate-700 transition hover:bg-white"}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </Link>
                )
              }

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={sidebarButtonClass(tab.id)}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              )
            })}
            <button
              type="button"
              onClick={handleWhatsAppSupport}
              className="mt-6 flex w-full items-center gap-3 rounded-2xl bg-orange-700 px-4 py-4 text-left font-semibold text-white transition hover:bg-orange-600"
            >
              <PhoneCall size={20} />
              WhatsApp Support
            </button>
          </nav>
        </aside>

        <main className="flex-1 px-4 py-8 md:px-6">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Welcome back, {displayName.split(" ")[0]}
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Manage your saved rentals and contact history in Birgunj.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="text-blue-700" size={24} />
                  <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">Saved Rooms</h3>
                </div>
                <Link to="/rooms" className="text-sm font-medium text-blue-700 md:text-base">
                  Browse All
                </Link>
              </div>

              {loading ? (
                <div className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-8 text-slate-400 shadow-sm ring-1 ring-slate-800" : "rounded-[24px] bg-white p-8 text-slate-500 shadow-sm ring-1 ring-slate-200"}>
                  Loading saved rooms...
                </div>
              ) : savedRooms.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {savedRooms.map((room) => (
                    <RoomCard key={room._id} room={room} onDelete={handleRoomDeleted} />
                  ))}
                </div>
              ) : (
                <div className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-8 text-slate-400 shadow-sm ring-1 ring-slate-800" : "rounded-[24px] bg-white p-8 text-slate-500 shadow-sm ring-1 ring-slate-200"}>
                  You do not have any saved rooms yet.{" "}
                  <Link to="/rooms" className="font-semibold text-blue-700">
                    Explore rooms
                  </Link>
                </div>
              )}

              <section className="mt-12 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
                <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Recommended for You
                </h3>
                {recommendedRooms.length > 0 ? (
                  <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                    {recommendedRooms.map((room) => (
                      <RoomCard
                        key={`rec-${room._id}`}
                        room={room}
                        onDelete={handleRoomDeleted}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl bg-[#f5f5ff] p-6 text-slate-600">
                    Save or search rooms to get personalized recommendations.
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-6">
              <section className={theme === "dark" ? "rounded-[28px] bg-slate-900 p-6 shadow-sm ring-1 ring-slate-800" : "rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200"}>
                <div className="flex items-center gap-3 text-xl font-medium">
                  <MessageSquareText className="text-blue-700" size={24} />
                  Direct Contacts
                </div>
                {contacts.length > 0 ? (
                  <ul className="mt-5 space-y-3">
                    {contacts.slice(0, 8).map((lead) => (
                      <li
                        key={lead._id}
                        className={theme === "dark" ? "rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm" : "rounded-xl border border-slate-200 bg-[#f7f7ff] p-3 text-sm"}
                      >
                        <div className={theme === "dark" ? "font-semibold text-slate-100" : "font-semibold text-slate-900"}>
                          {lead.room?.title || "Room inquiry"}
                        </div>
                        <div className={theme === "dark" ? "mt-1 text-slate-400 capitalize" : "mt-1 text-slate-600 capitalize"}>
                          {lead.type} · {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={theme === "dark" ? "mt-5 text-sm text-slate-400" : "mt-5 text-sm text-slate-500"}>
                    Your recent contacts will appear here after you call or WhatsApp owners.
                  </div>
                )}
              </section>

              <section className={theme === "dark" ? "rounded-[28px] bg-slate-900 p-6 shadow-sm" : "rounded-[28px] bg-[#e6e6ef] p-6 shadow-sm"}>
                <div className="flex items-center gap-3 text-xl font-medium">
                  <History className="text-blue-700" size={24} />
                  My Search History
                </div>
                {searchHistory.length > 0 ? (
                  <ul className="mt-5 space-y-3">
                    {searchHistory.slice(0, 8).map((item, index) => (
                      <li
                        key={`${item.createdAt}-${index}`}
                        className={theme === "dark" ? "rounded-xl bg-slate-800 px-4 py-3 text-sm text-slate-100" : "rounded-xl bg-white/80 px-4 py-3 text-sm text-slate-700"}
                      >
                        <div className="font-medium">
                          {item.query || item.location || "Birgunj search"}
                        </div>
                        <div className={theme === "dark" ? "mt-1 text-xs text-slate-400" : "mt-1 text-xs text-slate-500"}>
                          {item.filter} · {item.roomType || "all types"}
                          {item.maxBudget ? ` · up to Rs ${item.maxBudget}` : ""}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={theme === "dark" ? "mt-5 text-sm leading-7 text-slate-400" : "mt-5 text-sm leading-7 text-slate-700"}>
                    Search history is empty. Browse rooms to build your history.
                  </p>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default UserDashboard

