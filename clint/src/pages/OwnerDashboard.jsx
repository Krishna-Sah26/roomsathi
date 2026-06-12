import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Bell,
  ChevronRight,
  Eye,
  LayoutGrid,
  MessageSquareText,
  Plus,
  Settings,
  UserRound,
  WandSparkles,
} from "lucide-react"
import API from "../services/api"
import BrandLogo from "../components/BrandLogo"
import Footer from "../components/Footer"
import OwnerPropertyMap from "../components/OwnerPropertyMap"
import ThemeToggle from "../components/ThemeToggle"
import { useTheme } from "../hooks/useTheme"

const TABS = [
  { id: "listings", label: "My Listings", icon: LayoutGrid },
  { id: "leads", label: "New Leads", icon: UserRound },
  { id: "analytics", label: "Analytics", icon: WandSparkles },
  { id: "settings", label: "Settings", icon: Settings },
]

function OwnerDashboard() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [rooms, setRooms] = useState([])
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalInquiries: 0,
    unreadLeads: 0,
    viewsChange: "+0%",
    inquiryChange: "+0%",
    roomBreakdown: [],
    recentLeads: [],
  })
  const [profile, setProfile] = useState(null)
  const [leads, setLeads] = useState([])
  const [unreadLeads, setUnreadLeads] = useState(0)
  const [activeTab, setActiveTab] = useState("listings")
  const [loading, setLoading] = useState(true)
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    phone: "",
    businessName: "",
    bio: "",
    notifyLeads: true,
    notifyViews: true,
    showPhoneOnListings: true,
  })

  const storedUser = JSON.parse(localStorage.getItem("userInfo") || "null")
  const userToken = storedUser?.token
  const userRole = storedUser?.role

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${userToken}`,
    }),
    [userToken]
  )

  const profilePillClassName =
    "flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm"
  const primaryButtonClassName =
    "rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"

  const displayName = profile?.name || storedUser?.name || "Owner"
  const profileInitials = displayName.slice(0, 2).toUpperCase()

  const loadDashboardData = useCallback(async () => {
    const [roomsResponse, analyticsResponse, profileResponse, leadsResponse] =
      await Promise.all([
        API.get("/rooms/owner/me", { headers: authHeaders }),
        API.get("/owners/analytics", { headers: authHeaders }),
        API.get("/owners/me", { headers: authHeaders }),
        API.get("/owners/leads", { headers: authHeaders }),
      ])

    setRooms(roomsResponse.data)
    setAnalytics(analyticsResponse.data)
    setProfile(profileResponse.data)
    setLeads(leadsResponse.data.leads || [])
    setUnreadLeads(leadsResponse.data.unreadCount || 0)

    const ownerSettings = profileResponse.data.ownerSettings || {}
    setSettingsForm({
      name: profileResponse.data.name || "",
      phone: profileResponse.data.phone || "",
      businessName: ownerSettings.businessName || "",
      bio: ownerSettings.bio || "",
      notifyLeads: ownerSettings.notifyLeads !== false,
      notifyViews: ownerSettings.notifyViews !== false,
      showPhoneOnListings: ownerSettings.showPhoneOnListings !== false,
    })

    const currentUserInfo = JSON.parse(localStorage.getItem("userInfo") || "null")
    const updatedUserInfo = {
      ...currentUserInfo,
      name: profileResponse.data.name,
      email: profileResponse.data.email,
      phone: profileResponse.data.phone,
    }
    localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo))
  }, [authHeaders])

  useEffect(() => {
    if (!userToken) {
      navigate("/login")
      return
    }

    if (userRole !== "owner") {
      navigate("/rooms")
      return
    }

    const fetchOwnerDashboard = async () => {
      try {
        await loadDashboardData()
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    void fetchOwnerDashboard()
  }, [navigate, userToken, userRole, loadDashboardData])

  const handleLogout = () => {
    localStorage.removeItem("userInfo")
    navigate("/")
  }

  const handleDeleteRoom = async (roomId) => {
    try {
      const confirmed = window.confirm("Delete this room listing permanently?")
      if (!confirmed) {
        return
      }

      await API.delete(`/rooms/${roomId}`, { headers: authHeaders })
      await loadDashboardData()
      alert("Room deleted successfully")
    } catch (error) {
      alert(error?.response?.data?.message || "Unable to delete room")
    }
  }

  const handleMarkLeadRead = async (leadId) => {
    try {
      await API.patch(`/owners/leads/${leadId}/read`, {}, { headers: authHeaders })
      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead._id === leadId ? { ...lead, status: "read" } : lead
        )
      )
      setUnreadLeads((count) => Math.max(0, count - 1))
    } catch (error) {
      console.log(error)
    }
  }

  const handleSaveSettings = async (event) => {
    event.preventDefault()

    try {
      setSavingSettings(true)
      const { data } = await API.put(
        "/owners/me",
        {
          name: settingsForm.name,
          phone: settingsForm.phone,
          ownerSettings: {
            businessName: settingsForm.businessName,
            bio: settingsForm.bio,
            notifyLeads: settingsForm.notifyLeads,
            notifyViews: settingsForm.notifyViews,
            showPhoneOnListings: settingsForm.showPhoneOnListings,
          },
        },
        { headers: authHeaders }
      )

      setProfile(data)
      const currentUserInfo = JSON.parse(localStorage.getItem("userInfo") || "null")
      const updatedUserInfo = {
        ...currentUserInfo,
        name: data.name,
        phone: data.phone,
      }
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo))
      alert("Settings saved successfully")
    } catch (error) {
      alert(error?.response?.data?.message || "Unable to save settings")
    } finally {
      setSavingSettings(false)
    }
  }

  const metrics = [
    {
      label: "Total Rooms",
      value: rooms.length.toString().padStart(2, "0"),
      change: "Live",
      icon: LayoutGrid,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "Total Views",
      value:
        analytics.totalViews > 0
          ? analytics.totalViews > 999
            ? `${(analytics.totalViews / 1000).toFixed(1)}k`
            : analytics.totalViews.toString()
          : "0",
      change: analytics.viewsChange || "+0%",
      icon: Eye,
      tone: "bg-orange-50 text-orange-700",
    },
    {
      label: "WhatsApp Inquiries",
      value: (analytics.totalInquiries || 0).toString(),
      change: analytics.inquiryChange || "+0%",
      icon: MessageSquareText,
      tone: "bg-green-50 text-green-700",
    },
  ]

  const sidebarButtonClass = (tabId) =>
    `flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left text-sm font-semibold transition ${
      activeTab === tabId
        ? "bg-blue-700 text-white"
        : "text-slate-700 hover:bg-white"
    }`

  const formatLeadDate = (value) => {
    if (!value) return ""
    return new Date(value).toLocaleString("en-NP", {
      dateStyle: "medium",
      timeStyle: "short",
    })
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

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
            <button
              type="button"
              onClick={() => setActiveTab("listings")}
              className={`pb-1 ${activeTab === "listings" ? "border-b-2 border-blue-700 text-blue-700" : "hover:text-slate-950"}`}
            >
              Dashboard
            </button>
            <Link to="/add-room" className="hover:text-slate-950">
              Add Room
            </Link>
          </nav>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setActiveTab("leads")}
              className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
            >
              <Bell size={20} />
              {unreadLeads > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadLeads > 9 ? "9+" : unreadLeads}
                </span>
              ) : null}
            </button>
            <div className={profilePillClassName}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">
                {profileInitials}
              </div>
              <div className="hidden leading-tight md:block">
                <div className="text-sm font-semibold text-slate-900">{displayName}</div>
                <div className="text-xs text-slate-500">
                  {profile?.ownerSettings?.businessName || "Owner account"}
                </div>
                {profile?.email ? (
                  <div className="text-xs text-slate-400">{profile.email}</div>
                ) : null}
              </div>
            </div>
            <button type="button" onClick={handleLogout} className={primaryButtonClassName}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className={theme === "dark" ? "mx-auto flex max-w-[1600px]" : "mx-auto flex max-w-[1600px]"}>
        <aside className={theme === "dark" ? "hidden w-[310px] shrink-0 border-r border-slate-800 bg-slate-900 px-4 py-8 lg:block" : "hidden w-[310px] shrink-0 border-r border-slate-200 bg-[#f8f8ff] px-4 py-8 lg:block"}>
          <div className="text-sm text-blue-700">Filters</div>
          <div className="mt-1 text-lg font-medium text-slate-500">Birgunj Market</div>

          <div className="mt-10 space-y-4">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={sidebarButtonClass(tab.id)}
                >
                  <Icon size={20} />
                  {tab.label}
                  {tab.id === "leads" && unreadLeads > 0 ? (
                    <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                      {unreadLeads}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </aside>

        <main className={theme === "dark" ? "flex-1 px-4 py-8 md:px-6" : "flex-1 px-4 py-8 md:px-6"}>
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Owner Dashboard</h2>
              <p className="mt-2 text-sm text-slate-600 md:text-base">
                Manage your properties and track tenant interest in Birgunj.
              </p>
            </div>
            <Link
              to="/add-room"
              className="inline-flex items-center gap-3 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 md:text-base"
            >
              <Plus size={20} />
              Add New Listing
            </Link>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto lg:hidden">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                    activeTab === tab.id
                      ? "bg-blue-700 text-white"
                      : "bg-white text-slate-700 ring-1 ring-slate-200"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <section className="mt-10 grid grid-cols-1 gap-5 xl:grid-cols-3">
            {metrics.map((metric) => {
              const Icon = metric.icon
              return (
                <article
                  key={metric.label}
                  className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-6 shadow-sm ring-1 ring-slate-800" : "rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200"}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${metric.tone}`}
                    >
                      <Icon size={22} />
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                      {metric.change}
                    </span>
                  </div>
                  <p className="mt-6 text-sm font-medium text-slate-700">{metric.label}</p>
                  <div className="mt-2 text-4xl font-bold tracking-tight">{metric.value}</div>
                </article>
              )
            })}
          </section>

          {activeTab === "listings" ? (
            <>
              <section className="mt-12">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-2xl font-semibold tracking-tight">Your Added Rooms</h3>
                  <span className="text-sm font-medium text-blue-700">{rooms.length} total</span>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                  {loading ? (
                    <div className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-8 text-slate-400 ring-1 ring-slate-800 xl:col-span-3" : "rounded-[24px] bg-white p-8 text-slate-500 ring-1 ring-slate-200 xl:col-span-3"}>
                      Loading your rooms...
                    </div>
                  ) : rooms.length > 0 ? (
                    rooms.map((room) => (
                      <article
                        key={room._id}
                        className={theme === "dark" ? "overflow-hidden rounded-[24px] bg-slate-900 shadow-sm ring-1 ring-slate-800" : "overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-slate-200"}
                      >
                        {room.images?.[0] ? (
                          <img
                            src={room.images[0]}
                            alt={room.title}
                            className="h-64 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-64 w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                            No uploaded image
                          </div>
                        )}

                        <div className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <h4 className="text-lg font-semibold leading-snug">{room.title}</h4>
                            <div className="text-right text-lg font-semibold text-blue-700">
                              Rs {room.price}
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-slate-600">{room.location}</p>
                          <p className="mt-2 text-xs text-slate-500">
                            {room.views || 0} views · {room.inquiries || 0} inquiries
                          </p>

                          <div className="mt-5 border-t border-slate-200 pt-5">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/edit-room/${room._id}`}
                                className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                              >
                                Edit
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDeleteRoom(room._id)}
                                className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-8 text-slate-400 ring-1 ring-slate-800 xl:col-span-3" : "rounded-[24px] bg-white p-8 text-slate-500 ring-1 ring-slate-200 xl:col-span-3"}>
                      You have not added any rooms yet.
                    </div>
                  )}
                </div>
              </section>

              <section className="mt-12">
                <OwnerPropertyMap rooms={rooms} loading={loading} />
              </section>
            </>
          ) : null}

          {activeTab === "leads" ? (
            <section className={theme === "dark" ? "mt-12 overflow-hidden rounded-[24px] bg-slate-900 shadow-sm ring-1 ring-slate-800" : "mt-12 overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-slate-200"}>
              <div className="border-b border-slate-200 px-6 py-5 md:px-8">
                <h3 className="text-2xl font-semibold tracking-tight">New Leads</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Tenant inquiries from WhatsApp and phone on your listings.
                </p>
              </div>

              {loading ? (
                <div className="p-8 text-slate-500">Loading leads...</div>
              ) : leads.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Seeker</th>
                        <th className="px-6 py-4 font-semibold">Room</th>
                        <th className="px-6 py-4 font-semibold">Type</th>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead._id} className="border-b border-slate-100">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">
                              {lead.seekerName || lead.seeker?.name || "Guest"}
                            </div>
                            <div className="text-xs text-slate-500">
                              {lead.seekerPhone || lead.seeker?.phone || "No phone"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{lead.room?.title || "Room"}</div>
                            <div className="text-xs text-slate-500">{lead.room?.area}</div>
                          </td>
                          <td className="px-6 py-4 capitalize">{lead.type}</td>
                          <td className="px-6 py-4 text-slate-600">
                            {formatLeadDate(lead.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                lead.status === "new"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {lead.status === "new" ? (
                              <button
                                type="button"
                                onClick={() => handleMarkLeadRead(lead._id)}
                                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                              >
                                Mark read
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-sm text-slate-500">
                  No leads yet. They will appear when tenants contact your listings.
                </div>
              )}
            </section>
          ) : null}

          {activeTab === "analytics" ? (
            <section className="mt-12 space-y-6">
              <article className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-6 shadow-sm ring-1 ring-slate-800" : "rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200"}>
                <h3 className="text-2xl font-semibold tracking-tight">Listing Performance</h3>
                <p className="mt-2 text-sm text-slate-500">Views and inquiries per room.</p>

                {analytics.roomBreakdown?.length > 0 ? (
                  <div className="mt-6 space-y-3">
                    {analytics.roomBreakdown.map((room) => (
                      <div
                        key={room._id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-[#f7f7ff] px-4 py-4"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{room.title}</div>
                          <div className="text-sm text-slate-500">
                            Rs {room.price} · {room.area}
                          </div>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <span>
                            <strong>{room.views}</strong> views
                          </span>
                          <span>
                            <strong>{room.inquiries}</strong> inquiries
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-slate-500">Add rooms to see analytics.</p>
                )}
              </article>

              <article className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-6 shadow-sm ring-1 ring-slate-800" : "rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200"}>
                <h3 className="text-xl font-semibold">Recent Lead Activity</h3>
                {analytics.recentLeads?.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {analytics.recentLeads.map((lead) => (
                      <li
                        key={lead._id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm"
                      >
                        <span>
                          {lead.seekerName} · {lead.type}
                        </span>
                        <span className="text-slate-500">{formatLeadDate(lead.createdAt)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">No recent lead activity.</p>
                )}
              </article>
            </section>
          ) : null}

          {activeTab === "settings" ? (
            <section className="mt-12 max-w-2xl">
              <form
                onSubmit={handleSaveSettings}
                className="rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8"
              >
                <h3 className="text-2xl font-semibold tracking-tight">Account Settings</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Update your owner profile shown in the dashboard header.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      value={settingsForm.name}
                      onChange={(event) =>
                        setSettingsForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={profile?.email || ""}
                      disabled
                      className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Phone</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(event) =>
                        setSettingsForm((current) => ({
                          ...current,
                          phone: event.target.value.replace(/\D/g, "").slice(0, 10),
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Business Name</label>
                    <input
                      type="text"
                      value={settingsForm.businessName}
                      onChange={(event) =>
                        setSettingsForm((current) => ({
                          ...current,
                          businessName: event.target.value,
                        }))
                      }
                      placeholder="e.g. Birgunj Property Hub"
                      className="w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Bio</label>
                    <textarea
                      rows={3}
                      value={settingsForm.bio}
                      onChange={(event) =>
                        setSettingsForm((current) => ({
                          ...current,
                          bio: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none"
                    />
                  </div>

                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={settingsForm.notifyLeads}
                      onChange={(event) =>
                        setSettingsForm((current) => ({
                          ...current,
                          notifyLeads: event.target.checked,
                        }))
                      }
                    />
                    Notify me about new leads
                  </label>
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={settingsForm.notifyViews}
                      onChange={(event) =>
                        setSettingsForm((current) => ({
                          ...current,
                          notifyViews: event.target.checked,
                        }))
                      }
                    />
                    Track listing views in analytics
                  </label>
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={settingsForm.showPhoneOnListings}
                      onChange={(event) =>
                        setSettingsForm((current) => ({
                          ...current,
                          showPhoneOnListings: event.target.checked,
                        }))
                      }
                    />
                    Show phone on listings
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="mt-8 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
                >
                  {savingSettings ? "Saving..." : "Save Settings"}
                </button>
              </form>
            </section>
          ) : null}

          {activeTab === "listings" ? (
            <section className="mt-12 overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-slate-200 lg:hidden">
              <div className="border-b border-slate-200 px-6 py-5">
                <h3 className="text-xl font-semibold">Quick Leads Preview</h3>
              </div>
              <div className="p-6 text-sm text-slate-500">
                {leads.length > 0
                  ? `${leads.length} total leads · ${unreadLeads} unread`
                  : "Leads will appear here after tenants contact your listing."}
                {leads.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab("leads")}
                    className="mt-3 flex items-center gap-1 font-semibold text-blue-700"
                  >
                    View all leads <ChevronRight size={16} />
                  </button>
                ) : null}
              </div>
            </section>
          ) : null}
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default OwnerDashboard

