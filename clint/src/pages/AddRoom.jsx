import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import API from "../services/api"
import BrandLogo from "../components/BrandLogo"
import Footer from "../components/Footer"
import LocationPicker from "../components/LocationPicker"
import ThemeToggle from "../components/ThemeToggle"
import { inferBirgunjArea, isBirgunjText } from "../utils/birgunj"
import { useTheme } from "../hooks/useTheme"
import {
  FaBolt,
  FaCamera,
  FaChevronDown,
  FaParking,
  FaPhoneAlt,
  FaShieldAlt,
  FaTint,
  FaUtensils,
  FaWifi,
  FaWhatsapp,
} from "react-icons/fa"

function AddRoom() {
  const navigate = useNavigate()
  const { theme } = useTheme()

  // Form state for real room submission
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Single Room")
  const [price, setPrice] = useState("")
  const [area, setArea] = useState("Ghantaghar")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [position, setPosition] = useState(null)
  const [address, setAddress] = useState("")
  const sectionRefs = useRef([])

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [imagePreviews])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]

        if (visibleEntry?.target?.dataset?.step) {
          setCurrentStep(Number(visibleEntry.target.dataset.step))
        }
      },
      {
        root: null,
        threshold: [0.2, 0.4, 0.6, 0.8],
      }
    )

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section)
      }
    })

    return () => observer.disconnect()
  }, [])

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || [])
    const nextFiles = [...images, ...files].slice(0, 10)

    setImages(nextFiles)
    setImagePreviews((previousPreviews) => {
      previousPreviews.forEach((preview) => URL.revokeObjectURL(preview))
      return nextFiles.map((file) => URL.createObjectURL(file))
    })

    event.target.value = ""
  }

  const amenities = [
    { label: "WiFi", icon: FaWifi },
    { label: "Parking", icon: FaParking },
    { label: "Water", icon: FaTint },
    { label: "Electricity", icon: FaBolt },
    { label: "Air Con", icon: FaBolt },
    { label: "Kitchen", icon: FaUtensils },
  ]

  const handleTitleChange = (event) => {
    setTitle(event.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 50))
  }

  const handlePriceChange = (event) => {
    setPrice(event.target.value.replace(/\D/g, ""))
  }

  const applyLocationFromCoords = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      )

      const nextAddress = response.data?.display_name || ""

      if (!isBirgunjText(nextAddress)) {
        alert("Please select a location inside Birgunj")
        setPosition(null)
        setAddress("")
        setLocation("")
        return
      }

      setPosition({ lat, lng })
      setAddress(nextAddress)
      setLocation(nextAddress)
      setArea(inferBirgunjArea(nextAddress))
    } catch (error) {
      console.log(error)
      setAddress("")
    }
  }

  // Submit the room to the backend with JWT + multipart form-data
  const handleSubmit = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))

    if (!userInfo?.token) {
      alert("Please login first")
      navigate("/login")
      return
    }

    const trimmedTitle = title.trim()

    if (!/^[a-zA-Z0-9]+$/.test(trimmedTitle)) {
      alert("Listing Title must contain only letters and numbers")
      return
    }

    if (trimmedTitle.length < 5 || trimmedTitle.length > 50) {
      alert("Listing Title must be between 5 and 50 characters")
      return
    }

    if (!price || !/^\d+$/.test(price)) {
      alert("Monthly Rent must contain numbers only")
      return
    }

    try {
      setLoading(true)

      if (!/^\d{10}$/.test(phone)) {
        alert("Phone number must be exactly 10 digits")
        return
      }

      if (whatsapp && !/^\d{10}$/.test(whatsapp)) {
        alert("WhatsApp number must be exactly 10 digits")
        return
      }

      if (images.length > 10) {
        alert("You can upload maximum 10 images")
        return
      }

      if (selectedAmenities.length === 0) {
        alert("Please select at least one amenity")
        return
      }

      if (!position) {
        alert("Please select a location on the map")
        return
      }

      const formData = new FormData()
      formData.append("title", trimmedTitle)
      formData.append("category", category)
      formData.append("price", price)
      formData.append("area", area)
      formData.append("location", location)
      formData.append("description", description)
      formData.append("phone", phone)
      formData.append("whatsapp", whatsapp)
      formData.append("amenities", selectedAmenities.join(","))
      formData.append("coordinates", JSON.stringify(position))

      for (let index = 0; index < images.length; index += 1) {
        formData.append("images", images[index])
      }

      await API.post("/rooms", formData, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      alert("Room Added Successfully")
      navigate("/owner-dashboard")
    } catch (error) {
      alert(error?.response?.data?.message || "Unable to add room")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={theme === "dark" ? "min-h-screen bg-slate-950 text-slate-100" : "min-h-screen bg-[#f5f5ff] text-slate-900"}>
      {/* Page header */}
      <header className={theme === "dark" ? "border-b border-slate-800 bg-slate-950/90 backdrop-blur" : "border-b border-slate-200 bg-white/90 backdrop-blur"}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <BrandLogo to="/" textClassName="text-2xl text-blue-700" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => navigate("/login?role=owner")}
              className="hidden rounded-lg border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 md:inline-flex"
            >
              Add Room
            </button>
            <button
              type="button"
              onClick={() => navigate("/login?role=user")}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Login/Register
            </button>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className={theme === "dark" ? "mb-6 flex items-start justify-between gap-2 text-center text-sm text-slate-400" : "mb-6 flex items-start justify-between gap-2 text-center text-sm text-slate-600"}>
          {["Basic Info", "Location", "Details", "Photos", "Contact"].map((step, index) => {
            const stepNumber = index + 1
            const isActive = currentStep >= stepNumber
            const isCurrent = currentStep === stepNumber

            return (
              <div key={step} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {index > 0 ? (
                    <div
                      className={`h-[2px] flex-1 rounded-full ${isActive ? "bg-blue-700" : theme === "dark" ? "bg-slate-700" : "bg-slate-200"}`}
                    />
                  ) : null}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition ${
                      isActive ? "bg-blue-700 text-white" : theme === "dark" ? "bg-slate-800 text-slate-400 ring-1 ring-slate-700" : "bg-white text-slate-500 ring-1 ring-slate-200"
                    } ${isCurrent ? "scale-105" : ""}`}
                  >
                    {stepNumber}
                  </div>
                  {index < 4 ? (
                    <div
                      className={`h-[2px] flex-1 rounded-full ${currentStep > stepNumber ? "bg-blue-700" : theme === "dark" ? "bg-slate-700" : "bg-slate-200"}`}
                    />
                  ) : null}
                </div>
                <div className={`mt-2 ${isActive ? "text-blue-700" : theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{step}</div>
              </div>
            )
          })}
        </div>

        <div className={theme === "dark" ? "mx-auto max-w-4xl overflow-hidden rounded-3xl bg-slate-900 shadow-[0_20px_55px_rgba(0,0,0,0.4)] ring-1 ring-slate-800" : "mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-[0_20px_55px_rgba(15,23,42,0.08)] ring-1 ring-slate-200"}>
          <div className="p-6 md:p-10">
            {/* Basic property info */}
            <section ref={(element) => (sectionRefs.current[0] = element)} data-step="1">
              <h2 className={theme === "dark" ? "text-2xl font-semibold text-white" : "text-2xl font-semibold"}>{" "}Basic Property Information</h2>
              <p className={theme === "dark" ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-500"}>Start with the basic details of your listing.</p>
              <div className={theme === "dark" ? "mt-6 h-px bg-slate-700" : "mt-6 h-px bg-slate-200"} />

              <div className="mt-6">
                <label className={theme === "dark" ? "mb-2 block text-sm font-medium text-slate-200" : "mb-2 block text-sm font-medium"}>Listing Title</label>
                <input
                  type="text"
                  placeholder="5 to 50 letters and numbers only"
                  value={title}
                  onChange={handleTitleChange}
                  minLength={5}
                  maxLength={50}
                  className={theme === "dark" ? "w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" : "w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none placeholder:text-slate-400"}
                />
                <p className={theme === "dark" ? "mt-2 text-xs text-slate-400" : "mt-2 text-xs text-slate-500"}>
                  {title.length}/50 characters (5–50, letters and numbers only)
                </p>
              </div>

              <div className="mt-6">
                <label className={theme === "dark" ? "mb-2 block text-sm font-medium text-slate-200" : "mb-2 block text-sm font-medium"}>Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={theme === "dark" ? "w-full appearance-none rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 outline-none" : "w-full appearance-none rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none"}
                  >
                    <option>Single Room</option>
                    <option>Flat</option>
                    <option>Hostel</option>
                  </select>
                  <FaChevronDown className={theme === "dark" ? "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" : "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"} />
                </div>
              </div>
            </section>

            {/* Location details */}
            <section className="mt-10" ref={(element) => (sectionRefs.current[1] = element)} data-step="2">
              <h2 className={theme === "dark" ? "text-2xl font-semibold text-white" : "text-2xl font-semibold"}>Location Details</h2>
              <p className={theme === "dark" ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-500"}>Help seekers find your property in Birgunj.</p>
              <div className={theme === "dark" ? "mt-6 h-px bg-slate-700" : "mt-6 h-px bg-slate-200"} />

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={theme === "dark" ? "mb-2 block text-sm font-medium text-slate-200" : "mb-2 block text-sm font-medium"}>Area in Birgunj</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Vishuwa, Fulwaritole, Ghantaghar"
                    className={theme === "dark" ? "w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" : "w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none placeholder:text-slate-400"}
                  />
                  <p className={theme === "dark" ? "mt-2 text-xs text-slate-400" : "mt-2 text-xs text-slate-500"}>
                    Type the exact Birgunj area name instead of selecting from a list.
                  </p>
                </div>

                <div>
                  <label className={theme === "dark" ? "mb-2 block text-sm font-medium text-slate-200" : "mb-2 block text-sm font-medium"}>Nearby Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g. Opposite Prabhu Bank"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={theme === "dark" ? "w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" : "w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none placeholder:text-slate-400"}
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.geolocation.getCurrentPosition(
                        async (pos) => {
                          await applyLocationFromCoords(pos.coords.latitude, pos.coords.longitude)
                        },
                        () => {
                          alert("Unable to fetch current location")
                        }
                      )
                    }}
                    className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                  >
                    Use Current Location
                  </button>
                  {position ? (
                    <div className={theme === "dark" ? "text-sm text-slate-400" : "text-sm text-slate-600"}>
                      Lat: {position.lat.toFixed(5)} · Lng: {position.lng.toFixed(5)}
                    </div>
                  ) : (
                    <div className={theme === "dark" ? "text-sm text-slate-400" : "text-sm text-slate-500"}>
                      Click current location to auto-detect exact pin and address.
                    </div>
                  )}
                </div>
                <p className={theme === "dark" ? "mb-2 text-xs text-slate-400" : "mb-2 text-xs text-slate-500"}>
                  Map is centered on Birgunj. Click the map or use current location to pin your property.
                </p>
                <LocationPicker
                  position={position}
                  onPositionChange={({ lat, lng }) => applyLocationFromCoords(lat, lng)}
                />
                {address ? (
                  <div className="mt-4">
                    <label className={theme === "dark" ? "mb-2 block text-sm font-medium text-slate-200" : "mb-2 block text-sm font-medium text-slate-700"}>
                      Auto-detected Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(event) => {
                        const nextAddress = event.target.value
                        setAddress(nextAddress)
                        setLocation(nextAddress)

                        if (isBirgunjText(nextAddress)) {
                          setArea(inferBirgunjArea(nextAddress))
                        }
                      }}
                      className={theme === "dark" ? "w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-slate-100 outline-none" : "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"}
                    />
                    <p className={theme === "dark" ? "mt-2 text-xs text-slate-400" : "mt-2 text-xs text-slate-500"}>
                      You can edit this address before submitting the room.
                    </p>
                  </div>
                ) : null}
              </div>
            </section>

            {/* Pricing and amenities */}
            <section className="mt-10" ref={(element) => (sectionRefs.current[2] = element)} data-step="3">
              <h2 className={theme === "dark" ? "text-2xl font-semibold text-white" : "text-2xl font-semibold"}>Pricing & Amenities</h2>
              <p className={theme === "dark" ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-500"}>Specify your rent and available facilities.</p>
              <div className={theme === "dark" ? "mt-6 h-px bg-slate-700" : "mt-6 h-px bg-slate-200"} />

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={theme === "dark" ? "mb-2 block text-sm font-medium text-slate-200" : "mb-2 block text-sm font-medium"}>Monthly Rent (NPR)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="5000"
                    value={price}
                    onChange={handlePriceChange}
                    className={theme === "dark" ? "w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" : "w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none placeholder:text-slate-400"}
                  />
                </div>
                <div>
                  <label className={theme === "dark" ? "mb-2 block text-sm font-medium text-slate-200" : "mb-2 block text-sm font-medium"}>Advance Deposit</label>
                  <input
                    type="text"
                    placeholder="1 Month Rent"
                    className={theme === "dark" ? "w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" : "w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none placeholder:text-slate-400"}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className={theme === "dark" ? "mb-4 block text-sm font-medium text-slate-200" : "mb-4 block text-sm font-medium"}>Included Amenities</label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {amenities.map((item) => {
                    const Icon = item.icon
                    const isChecked = selectedAmenities.includes(item.label)
                    return (
                      <label
                        key={item.label}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                          isChecked
                            ? "border-blue-700 bg-blue-50 text-slate-900"
                            : theme === "dark"
                            ? "border-slate-700 bg-slate-800 text-slate-200"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(event) => {
                            if (event.target.checked) {
                              setSelectedAmenities((current) => [...current, item.label])
                            } else {
                              setSelectedAmenities((current) =>
                                current.filter((amenity) => amenity !== item.label)
                              )
                            }
                          }}
                        />
                        <Icon className={theme === "dark" ? "text-slate-400" : "text-slate-500"} />
                        {item.label}
                      </label>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* Property photos */}
            <section className="mt-10" ref={(element) => (sectionRefs.current[3] = element)} data-step="4">
              <h2 className={theme === "dark" ? "text-2xl font-semibold text-white" : "text-2xl font-semibold"}>Property Photos</h2>
              <p className={theme === "dark" ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-500"}>Upload clear photos to get more inquiries (Min 3).</p>
              <div className={theme === "dark" ? "mt-6 h-px bg-slate-700" : "mt-6 h-px bg-slate-200"} />

              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                <label className={theme === "dark" ? "flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-600 bg-slate-800 text-center text-sm text-slate-400" : "flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-[#fbfbff] text-center text-sm text-slate-500"}>
                  <FaCamera className={theme === "dark" ? "mb-2 text-xl text-slate-500" : "mb-2 text-xl text-slate-400"} />
                  <span>Upload Images</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreviews.length > 0 ? (
                  <div className="col-span-3 md:col-span-3">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {imagePreviews.map((preview, index) => (
                        <button
                          key={preview}
                          type="button"
                          className={theme === "dark" ? "shrink-0 overflow-hidden rounded-2xl ring-1 ring-slate-700 transition hover:scale-[1.01]" : "shrink-0 overflow-hidden rounded-2xl ring-1 ring-slate-200 transition hover:scale-[1.01]"}
                        >
                          <img
                            src={preview}
                            alt={`Selected room ${index + 1}`}
                            className="h-[120px] w-[160px] object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={theme === "dark" ? "col-span-3 flex min-h-[110px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-600 bg-slate-800 text-sm text-slate-400" : "col-span-3 flex min-h-[110px] items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-[#fbfbff] text-sm text-slate-500"}>
                    Selected images will appear here. Up to 10 images.
                  </div>
                )}
                {images.length > 0 ? (
                  <div className={theme === "dark" ? "col-span-4 text-sm text-slate-400" : "col-span-4 text-sm text-slate-500"}>
                    {images.length} / 10 images selected
                  </div>
                ) : null}
              </div>
            </section>

            {/* Contact information */}
            <section className="mt-10" ref={(element) => (sectionRefs.current[4] = element)} data-step="5">
              <h2 className={theme === "dark" ? "text-2xl font-semibold text-white" : "text-2xl font-semibold"}>Contact Information</h2>
              <p className={theme === "dark" ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-500"}>How should potential tenants reach you?</p>
              <div className={theme === "dark" ? "mt-6 h-px bg-slate-700" : "mt-6 h-px bg-slate-200"} />

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={theme === "dark" ? "mb-2 block text-sm font-medium text-slate-200" : "mb-2 block text-sm font-medium"}>Phone Number</label>
                  <div className={theme === "dark" ? "flex items-center rounded-xl border border-slate-600 bg-slate-800 px-4 py-3" : "flex items-center rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3"}>
                    <FaPhoneAlt className={theme === "dark" ? "mr-3 text-slate-500" : "mr-3 text-slate-400"} />
                    <input
                      type="text"
                      placeholder="98XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={theme === "dark" ? "w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500" : "w-full bg-transparent outline-none placeholder:text-slate-400"}
                    />
                  </div>
                  <p className={theme === "dark" ? "mt-2 text-xs text-slate-400" : "mt-2 text-xs text-slate-500"}>Exactly 10 digits required.</p>
                </div>

                <div>
                  <label className={theme === "dark" ? "mb-2 block text-sm font-medium text-slate-200" : "mb-2 block text-sm font-medium"}>WhatsApp Number</label>
                  <div className={theme === "dark" ? "flex items-center rounded-xl border border-slate-600 bg-slate-800 px-4 py-3" : "flex items-center rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3"}>
                    <FaWhatsapp className="mr-3 text-green-600" />
                    <input
                      type="text"
                      placeholder="Same as Phone"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className={theme === "dark" ? "w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500" : "w-full bg-transparent outline-none placeholder:text-slate-400"}
                    />
                  </div>
                  <p className={theme === "dark" ? "mt-2 text-xs text-slate-400" : "mt-2 text-xs text-slate-500"}>Optional, but if used it must be 10 digits.</p>
                </div>
              </div>
            </section>

            {/* Description field */}
            <section className="mt-10">
              <label className={theme === "dark" ? "mb-2 block text-sm font-medium text-slate-200" : "mb-2 block text-sm font-medium"}>Description</label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description about the room"
                className={theme === "dark" ? "w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" : "w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none placeholder:text-slate-400"}
              />
            </section>

            {/* Actions */}
            <div className={theme === "dark" ? "mt-10 flex flex-col gap-4 border-t border-slate-700 pt-8 md:flex-row md:items-center md:justify-between" : "mt-10 flex flex-col gap-4 border-t border-slate-200 pt-8 md:flex-row md:items-center md:justify-between"}>
              <button className={theme === "dark" ? "text-sm font-semibold text-blue-400 hover:text-blue-300" : "text-sm font-semibold text-blue-700"}>
                Save Draft
              </button>

              <div className="flex flex-col gap-3 md:flex-row">
                <button className={theme === "dark" ? "rounded-xl bg-slate-700 px-6 py-3 font-semibold text-slate-200 hover:bg-slate-600" : "rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-600"}>
                  Previous
                </button>
                {/* Real submit button */}
                <button
                  onClick={handleSubmit}
                  className="rounded-xl bg-blue-700 px-8 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Listing"}
                </button>
              </div>
            </div>

            {/* Safety note */}
            <div className={theme === "dark" ? "mt-6 rounded-xl border border-blue-900 bg-blue-950/30 px-4 py-4 text-sm text-blue-300" : "mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm text-slate-600"}>
              <div className="flex items-start gap-3">
                <FaShieldAlt className="mt-1 text-blue-700" />
                <p>
                  Safe & Secure Listing. Your listing will be verified by our team within 24 hours to ensure high quality for Birgunj residents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AddRoom
