import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FaBolt, FaChevronDown, FaParking, FaPhoneAlt, FaShieldAlt, FaTint, FaUtensils, FaWifi, FaWhatsapp } from "react-icons/fa"
import API from "../services/api"
import BrandLogo from "../components/BrandLogo"

function EditRoom() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Single Room")
  const [price, setPrice] = useState("")
  const [area, setArea] = useState("Ghantaghar")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [existingRoom, setExistingRoom] = useState(null)
  const [newImages, setNewImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const amenities = useMemo(
    () => [
      { label: "WiFi", icon: FaWifi },
      { label: "Parking", icon: FaParking },
      { label: "Water", icon: FaTint },
      { label: "Electricity", icon: FaBolt },
      { label: "Air Con", icon: FaBolt },
      { label: "Kitchen", icon: FaUtensils },
    ],
    []
  )

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null")

        if (!userInfo?.token) {
          navigate("/login")
          return
        }

        const { data } = await API.get(`/rooms/${id}`)

        if (!data || data.owner?._id !== userInfo._id) {
          navigate("/")
          return
        }

        setExistingRoom(data)
        setTitle(data.title || "")
        setCategory(data.category || "Single Room")
        setPrice(data.price ? String(data.price) : "")
        setArea(data.area || "Ghantaghar")
        setLocation(data.location || "")
        setDescription(data.description || "")
        setPhone(data.phone || "")
        setWhatsapp(data.whatsapp || "")
        setSelectedAmenities(Array.isArray(data.amenities) ? data.amenities : [])
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()
  }, [id, navigate])

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [imagePreviews])

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 10)

    setNewImages(files)
    setImagePreviews((previousPreviews) => {
      previousPreviews.forEach((preview) => URL.revokeObjectURL(preview))
      return files.map((file) => URL.createObjectURL(file))
    })
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 50))
  }

  const handlePriceChange = (event) => {
    setPrice(event.target.value.replace(/\D/g, ""))
  }

  const handleSubmit = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null")

    if (!userInfo?.token) {
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
      setSaving(true)

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

      newImages.forEach((file) => {
        formData.append("images", file)
      })

      const { data } = await API.put(`/rooms/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setExistingRoom(data)
      navigate("/owner-dashboard")
    } catch (error) {
      alert(error?.response?.data?.message || "Unable to update room")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5ff] p-8 text-slate-500">
        Loading room...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5ff] text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <BrandLogo to="/" size="lg" textClassName="text-2xl text-blue-700" />
          <div className="flex items-center gap-3">
            <Link to="/login?role=owner" className="rounded-lg border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
              Add Room
            </Link>
            <Link to="/login?role=user" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800">
              Login/Register
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Edit Room</h1>
          <p className="mt-2 text-slate-500">Update the existing room listing and save changes.</p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Listing Title</label>
              <input
                value={title}
                onChange={handleTitleChange}
                minLength={5}
                maxLength={50}
                className="w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none"
              />
              <p className="mt-2 text-xs text-slate-500">
                {title.length}/50 characters (5–50, letters and numbers only)
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none"
                >
                  <option>Single Room</option>
                  <option>Flat</option>
                  <option>Hostel</option>
                </select>
                <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Monthly Rent</label>
              <input
                value={price}
                inputMode="numeric"
                onChange={handlePriceChange}
                className="w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Area in Birgunj</label>
              <input
                value={area}
                onChange={(event) => setArea(event.target.value)}
                placeholder="e.g. Vishuwa, Fulwaritole, Ghantaghar"
                className="w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none placeholder:text-slate-400"
              />
              <p className="mt-2 text-xs text-slate-500">
                Type the exact Birgunj area name instead of selecting from a list.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Location</label>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Phone Number</label>
              <div className="flex items-center rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3">
                <FaPhoneAlt className="mr-3 text-slate-400" />
                <input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full bg-transparent outline-none" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">WhatsApp Number</label>
              <div className="flex items-center rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3">
                <FaWhatsapp className="mr-3 text-green-600" />
                <input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} className="w-full bg-transparent outline-none" />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium">Description</label>
            <textarea
              rows="5"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none"
            />
          </div>

          <div className="mt-8">
            <label className="mb-4 block text-sm font-medium">Amenities</label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {amenities.map((item) => {
                const Icon = item.icon
                const checked = selectedAmenities.includes(item.label)

                return (
                  <label
                    key={item.label}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                      checked ? "border-blue-700 bg-blue-50" : "border-slate-200 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedAmenities((current) => [...current, item.label])
                        } else {
                          setSelectedAmenities((current) => current.filter((amenity) => amenity !== item.label))
                        }
                      }}
                    />
                    <Icon className="text-slate-500" />
                    {item.label}
                  </label>
                )
              })}
            </div>
          </div>

          {existingRoom?.images?.length ? (
            <div className="mt-8">
              <label className="mb-4 block text-sm font-medium">Current Images</label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {existingRoom.images.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`Existing room ${index + 1}`}
                    className="h-36 w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Upload new photos below to replace these current images.
              </p>
            </div>
          ) : null}

          <div className="mt-8">
            <label className="mb-4 block text-sm font-medium">Replace Images</label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <label className="flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-[#fbfbff] text-center text-sm text-slate-500">
                <span>Select Images</span>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreviews.length > 0 ? (
                imagePreviews.map((preview, index) => (
                  <div key={preview} className="overflow-hidden rounded-2xl">
                    <img
                      src={preview}
                      alt={`New room ${index + 1}`}
                      className="h-full min-h-[110px] w-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-3 flex min-h-[110px] items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-[#fbfbff] text-sm text-slate-500">
                  Upload new images to replace the current gallery
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-3">
            <Link to="/" className="rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-700">
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <FaShieldAlt className="mt-1 text-blue-700" />
              <p>Only the room owner can update these details.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default EditRoom
