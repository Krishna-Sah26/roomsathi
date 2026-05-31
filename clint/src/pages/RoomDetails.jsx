import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  MapPin,
  MessageSquareText,
  PhoneCall,
  ShieldAlert,
  SquareUser,
  Wifi,
  CarFront,
  Droplets,
  PlugZap,
} from "lucide-react"
import API from "../services/api"
import BrandLogo from "../components/BrandLogo"
import Footer from "../components/Footer"
import LocationPicker from "../components/LocationPicker"
import ThemeToggle from "../components/ThemeToggle"
import { useTheme } from "../hooks/useTheme"

const amenityIconMap = {
  WiFi: Wifi,
  "High-speed WiFi": Wifi,
  Parking: CarFront,
  "Bike Parking": CarFront,
  Water: Droplets,
  "24/7 Water": Droplets,
  Electricity: PlugZap,
  "Power Backup": PlugZap,
}

function RoomDetails() {
  const { id } = useParams()
  const { theme } = useTheme()
  const [room, setRoom] = useState(null)
  const [similarRooms, setSimilarRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState("")
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null")

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const [{ data: roomData }, { data: similarData }] = await Promise.all([
          API.get(`/rooms/${id}`),
          API.get(`/rooms/${id}/similar`),
        ])

        setRoom(roomData)
        setSelectedImage("")
        setSimilarRooms(similarData)
      } catch (fetchError) {
        setError(fetchError?.response?.data?.message || "Unable to load room details")
        console.log(fetchError)
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()
  }, [id])

  const roomImages = useMemo(() => room?.images || [], [room])
  const mainImage = selectedImage || roomImages[0]

  const recordInquiry = async (type) => {
    try {
      const headers = userInfo?.token
        ? { Authorization: `Bearer ${userInfo.token}` }
        : {}

      await API.post(
        `/rooms/${id}/inquire`,
        {
          type,
          seekerName: userInfo?.name || "Guest Seeker",
          seekerPhone: userInfo?.phone || "",
          seekerEmail: userInfo?.email || "",
        },
        { headers }
      )
    } catch (inquiryError) {
      console.log(inquiryError)
    }
  }

  const handleCallOwner = async () => {
    const phone = room?.phone || room?.owner?.phone
    if (!phone) {
      alert("Owner phone number is not available")
      return
    }

    await recordInquiry("call")
    window.location.href = `tel:${phone}`
  }

  const handleWhatsAppOwner = async () => {
    const whatsappNumber = room?.whatsapp || room?.phone || room?.owner?.phone
    if (!whatsappNumber) {
      alert("Owner WhatsApp number is not available")
      return
    }

    await recordInquiry("whatsapp")
    const message = encodeURIComponent(
      `Hi, I am interested in your room listing "${room?.title}" on RoomSathi.`
    )
    window.open(`https://wa.me/977${whatsappNumber}?text=${message}`, "_blank")
  }

  return (
    <div className={theme === "dark" ? "min-h-screen bg-slate-950 text-slate-100" : "min-h-screen bg-[#f5f5ff] text-slate-900"}>
      <header className={theme === "dark" ? "border-b border-slate-800 bg-slate-950/90 backdrop-blur" : "border-b border-slate-200 bg-white/90 backdrop-blur"}>
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <BrandLogo to="/rooms" size="lg" textClassName={theme === "dark" ? "text-2xl text-white" : "text-2xl text-blue-700"} />
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Link to="/rooms" className={theme === "dark" ? "text-sm font-medium text-slate-300" : "text-sm font-medium text-slate-700"}>
              All Rooms
            </Link>
            <Link to="/add-room" className={theme === "dark" ? "text-sm font-medium text-slate-300" : "text-sm font-medium text-slate-700"}>
              Add Room
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-6 md:px-6">
        {loading ? (
          <div className={theme === "dark" ? "rounded-3xl bg-slate-900 p-8 text-slate-400 shadow-sm ring-1 ring-slate-800" : "rounded-3xl bg-white p-8 text-slate-500 shadow-sm ring-1 ring-slate-200"}>
            Loading room details...
          </div>
        ) : error ? (
          <div className={theme === "dark" ? "rounded-3xl bg-slate-900 p-8 text-slate-400 shadow-sm ring-1 ring-slate-800" : "rounded-3xl bg-white p-8 text-slate-500 shadow-sm ring-1 ring-slate-200"}>
            {error}
          </div>
        ) : room ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
            <div className="min-w-0 space-y-6">
              <div className={theme === "dark" ? "overflow-hidden rounded-[24px] bg-slate-900 shadow-sm ring-1 ring-slate-800" : "overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-slate-200"}>
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={room.title}
                    className="h-[380px] w-full cursor-pointer object-cover md:h-[420px]"
                    onClick={() => setSelectedImage("")}
                  />
                ) : (
                  <div className={theme === "dark" ? "flex h-[380px] items-center justify-center text-slate-500 md:h-[420px]" : "flex h-[380px] items-center justify-center text-slate-500 md:h-[420px]"}>
                    No uploaded image
                  </div>
                )}
              </div>

              {roomImages.length > 1 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {roomImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`overflow-hidden rounded-[18px] ring-2 transition hover:scale-[1.01] ${
                        mainImage === image ? (theme === "dark" ? "ring-blue-400" : "ring-blue-700") : "ring-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${room.title} ${index + 1}`}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}

              <div className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-6 shadow-sm ring-1 ring-slate-800 md:p-8" : "rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8"}>
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold tracking-tight md:text-4xl">{room.title}</h2>
                    <p className={theme === "dark" ? "mt-3 flex items-start gap-2 text-base text-slate-400 md:text-lg" : "mt-3 flex items-start gap-2 text-base text-slate-600 md:text-lg"}>
                      <MapPin size={18} className="mt-1 shrink-0" />
                      <span className="line-clamp-3">{room.location}</span>
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[room.category, room.area].filter(Boolean).map((item) => (
                        <span
                          key={item}
                          className={theme === "dark" ? "rounded-full bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-300 ring-1 ring-slate-700" : "rounded-full bg-[#f7f7ff] px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200"}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-left md:text-right">
                    <div className={theme === "dark" ? "text-3xl font-bold text-blue-400 md:text-4xl" : "text-3xl font-bold text-blue-700 md:text-4xl"}>Rs {room.price}</div>
                    <div className={theme === "dark" ? "mt-1 text-xs uppercase tracking-[0.25em] text-slate-500 md:text-sm" : "mt-1 text-xs uppercase tracking-[0.25em] text-slate-500 md:text-sm"}>
                      per month
                    </div>
                  </div>
                </div>
              </div>

              {room.coordinates?.lat && room.coordinates?.lng ? (
                <section className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-6 shadow-sm ring-1 ring-slate-800" : "rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200"}>
                  <h3 className="text-xl font-semibold md:text-2xl">Location Map</h3>
                  <p className={theme === "dark" ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-500"}>Property location in Birgunj.</p>
                  <div className="mt-4 overflow-hidden rounded-2xl">
                    <LocationPicker
                      editable={false}
                      position={room.coordinates}
                      center={[room.coordinates.lat, room.coordinates.lng]}
                    />
                  </div>
                </section>
              ) : null}

              <section className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-6 shadow-sm ring-1 ring-slate-800 md:p-8" : "rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8"}>
                <h3 className="text-xl font-semibold md:text-2xl">Description</h3>
                <p className={theme === "dark" ? "mt-4 text-base leading-8 text-slate-400 md:text-lg" : "mt-4 text-base leading-8 text-slate-600 md:text-lg"}>
                  {room.description || "No description added by the owner yet."}
                </p>
              </section>

              <section className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-6 shadow-sm ring-1 ring-slate-800 md:p-8" : "rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8"}>
                <h3 className="text-xl font-semibold md:text-2xl">Amenities</h3>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {(room.amenities?.length ? room.amenities : ["WiFi", "Parking", "Water"]).map(
                    (item) => {
                      const Icon = amenityIconMap[item] || ShieldAlert

                      return (
                        <div
                          key={item}
                          className={theme === "dark" ? "flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm font-medium text-slate-300" : "flex items-center gap-2 rounded-xl border border-slate-200 bg-[#f7f7ff] px-3 py-3 text-sm font-medium text-slate-700"}
                        >
                          <Icon className={theme === "dark" ? "shrink-0 text-blue-400" : "shrink-0 text-blue-700"} size={18} />
                          <span className="truncate">{item}</span>
                        </div>
                      )
                    }
                  )}
                </div>
              </section>

              {similarRooms.length > 0 ? (
                <section className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-6 shadow-sm ring-1 ring-slate-800 md:p-8" : "rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8"}>
                  <h3 className="text-xl font-semibold md:text-2xl">Similar Listings</h3>
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {similarRooms.map((listing) => (
                      <Link
                        key={listing._id}
                        to={`/room-details/${listing._id}`}
                        className={theme === "dark" ? "group overflow-hidden rounded-[20px] border border-slate-800 bg-slate-900 transition hover:-translate-y-0.5 hover:shadow-md" : "group overflow-hidden rounded-[20px] border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"}
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                          {listing.images?.[0] ? (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                            />
                          ) : (
                            <div className={theme === "dark" ? "flex h-full items-center justify-center text-sm text-slate-500" : "flex h-full items-center justify-center text-sm text-slate-500"}>
                              No image
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className={theme === "dark" ? "text-lg font-bold text-blue-400" : "text-lg font-bold text-blue-700"}>Rs {listing.price}</div>
                          <h4 className={theme === "dark" ? "mt-1 line-clamp-2 text-base font-semibold text-slate-100" : "mt-1 line-clamp-2 text-base font-semibold text-slate-900"}>
                            {listing.title}
                          </h4>
                          <p className={theme === "dark" ? "mt-2 line-clamp-2 text-sm text-slate-400" : "mt-2 line-clamp-2 text-sm text-slate-600"}>{listing.location}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
              <div className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-5 shadow-sm ring-1 ring-slate-800" : "rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200"}>
                <div className="flex items-start gap-4">
                  <div className={theme === "dark" ? "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-800 text-blue-400" : "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700"}>
                    <SquareUser size={26} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold">{room.owner?.name || "Room Owner"}</h3>
                    <p className="mt-1 text-sm font-medium text-orange-500">Verified Owner</p>
                    <p className={theme === "dark" ? "truncate text-sm text-slate-400" : "truncate text-sm text-slate-500"}>
                      {room.owner?.email || "Contact via buttons below"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCallOwner}
                  className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                  <PhoneCall size={18} />
                  Call Owner
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppOwner}
                  className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl bg-green-500 px-4 py-3 font-semibold text-white transition hover:bg-green-600"
                >
                  <MessageSquareText size={18} />
                  WhatsApp Now
                </button>
              </div>

              <div className={theme === "dark" ? "rounded-[24px] bg-slate-900 p-5 shadow-sm ring-1 ring-slate-800" : "rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200"}>
                <h4 className={theme === "dark" ? "flex items-center gap-2 text-lg font-semibold text-blue-400" : "flex items-center gap-2 text-lg font-semibold text-blue-700"}>
                  <ShieldAlert size={18} />
                  Rental Safety Tips
                </h4>
                <ul className={theme === "dark" ? "mt-3 space-y-2 text-sm leading-6 text-slate-400" : "mt-3 space-y-2 text-sm leading-6 text-slate-600"}>
                  <li>Never pay a deposit before visiting the property.</li>
                  <li>Always meet the owner in person at the location.</li>
                </ul>
              </div>
            </aside>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}

export default RoomDetails
