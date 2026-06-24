import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import API from "../services/api"
import { useTheme } from "../hooks/useTheme"

const seedFeedback = [
  {
    name: "Rahul Gupta",
    role: "Student",
    rating: 5,
    message: "The room details were clear and I found a verified place near my college quickly.",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Sanjay Shah",
    role: "Owner",
    rating: 5,
    message: "Listing my room was simple, and I started getting genuine inquiries right away.",
    image: "https://i.pravatar.cc/150?img=15",
  },
]

function Feedback() {
  const { theme } = useTheme()
  const [name, setName] = useState("")
  const [role, setRole] = useState("Student")
  const [message, setMessage] = useState("")
  const [rating, setRating] = useState(5)
  const [photo, setPhoto] = useState("")
  const [photoPreview, setPhotoPreview] = useState("")
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackItems, setFeedbackItems] = useState(seedFeedback)

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const { data } = await API.get("/feedback")
        if (Array.isArray(data) && data.length > 0) {
          setFeedbackItems(data)
        } else {
          setFeedbackItems(seedFeedback)
        }
      } catch {
        setFeedbackItems(seedFeedback)
      }
    }

    loadFeedback()
  }, [])

  useEffect(() => {
    if (feedbackItems.length <= 1) {
      return undefined
    }

    const interval = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % feedbackItems.length)
    }, 2000)

    return () => window.clearInterval(interval)
  }, [feedbackItems])

  const handlePhotoChange = (event) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      setPhoto("")
      setPhotoPreview("")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const imageUrl = typeof reader.result === "string" ? reader.result : ""
      setPhoto(imageUrl)
      setPhotoPreview(imageUrl)
    }
    reader.readAsDataURL(selectedFile)
  }

  const submitFeedback = async () => {
    if (isSubmitting) {
      return
    }

    if (!name.trim() || !message.trim()) {
      toast.error("Please add your name and feedback before submitting.")
      return
    }

    setIsSubmitting(true)

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null")
      const fallbackImage = `https://i.pravatar.cc/150?u=${encodeURIComponent(name.trim())}`
      const nextFeedback = {
        name: name.trim(),
        role: role.trim() || userInfo?.role || "Guest",
        rating,
        message: message.trim(),
        image: photo || userInfo?.image || fallbackImage,
      }

      const { data } = await API.post("/feedback", nextFeedback)
      const savedFeedback = data?.feedback || nextFeedback
      setFeedbackItems((current) => [savedFeedback, ...current])
      setFeaturedIndex(0)
      setName("")
      setMessage("")
      setRole("Student")
      setRating(5)
      setPhoto("")
      setPhotoPreview("")
      toast.success("Thank you for your feedback!")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={theme === "dark" ? "bg-slate-950 pt-16 text-slate-100" : "bg-white pt-16 text-slate-900"}>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className={theme === "dark" ? "rounded-3xl bg-slate-900 p-8 ring-1 ring-slate-800 md:p-10" : "rounded-3xl bg-white p-8 ring-1 ring-slate-200 md:p-10"}>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">Feedback</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">Tell us what you think.</h1>
            <p className={theme === "dark" ? "mt-4 text-sm leading-7 text-slate-300" : "mt-4 text-sm leading-7 text-slate-600"}>
              Share your experience as a student, owner, or visitor. Your feedback helps other users trust the platform.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className={theme === "dark" ? "rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-500" : "rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none placeholder:text-slate-400"}
              />
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className={theme === "dark" ? "rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none" : "rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none"}
              >
                <option>Student</option>
                <option>Owner</option>
                <option>Parent</option>
                <option>Guest</option>
              </select>
            </div>

            <div className="mt-4">
              <label className={theme === "dark" ? "mb-2 block text-sm font-semibold text-slate-200" : "mb-2 block text-sm font-semibold text-slate-700"}>
                Your Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className={theme === "dark" ? "block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:font-semibold file:text-white" : "block w-full rounded-xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:font-semibold file:text-white"}
              />
            </div>

            <textarea
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write your feedback..."
              className={theme === "dark" ? "mt-4 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-500" : "mt-4 w-full rounded-2xl border border-slate-300 bg-[#f7f7ff] px-4 py-3 outline-none placeholder:text-slate-400"}
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className={theme === "dark" ? "text-sm text-slate-300" : "text-sm text-slate-600"}>Rating:</span>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`h-10 w-10 rounded-full border text-sm font-semibold transition ${
                    rating >= value
                      ? "border-yellow-400 bg-yellow-400 text-slate-900"
                      : theme === "dark"
                        ? "border-slate-700 bg-slate-950 text-slate-300"
                        : "border-slate-300 bg-white text-slate-500"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <div className={theme === "dark" ? "mt-6 rounded-2xl bg-slate-950 p-4 ring-1 ring-slate-800" : "mt-6 rounded-2xl bg-[#f7f7ff] p-4 ring-1 ring-slate-200"}>
              <p className={theme === "dark" ? "text-sm font-semibold text-slate-200" : "text-sm font-semibold text-slate-700"}>
                Profile Preview
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={photoPreview || `https://i.pravatar.cc/150?u=${encodeURIComponent(name.trim() || "feedback-user")}`}
                  alt="Preview"
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-white"
                />
                <div>
                  <p className="font-semibold">{name.trim() || "Your Name"}</p>
                  <p className={theme === "dark" ? "text-sm text-slate-400" : "text-sm text-slate-600"}>{role}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={submitFeedback}
              disabled={isSubmitting}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </section>

          <aside className={theme === "dark" ? "rounded-3xl bg-slate-900 p-8 ring-1 ring-slate-800 md:p-10" : "rounded-3xl bg-white p-8 ring-1 ring-slate-200 md:p-10"}>
            <h2 className="text-2xl font-bold tracking-tight">Latest Feedback</h2>

            {feedbackItems[featuredIndex] ? (
              <article className={theme === "dark" ? "mt-6 rounded-3xl bg-slate-950 p-5 ring-1 ring-slate-800" : "mt-6 rounded-3xl bg-[#f7f7ff] p-5 ring-1 ring-slate-200"}>
                <div className="flex items-center gap-4">
                  <img
                    src={feedbackItems[featuredIndex].image}
                    alt={feedbackItems[featuredIndex].name}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-white"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{feedbackItems[featuredIndex].name}</h3>
                      <span className="rounded-full bg-blue-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                        {feedbackItems[featuredIndex].role}
                      </span>
                    </div>
                    <p className={theme === "dark" ? "mt-1 text-xs text-slate-400" : "mt-1 text-xs text-slate-500"}>
                      {Array.from({ length: feedbackItems[featuredIndex].rating }).map((_, starIndex) => (
                        <span key={starIndex}>★</span>
                      ))}
                    </p>
                  </div>
                </div>
                <p className={theme === "dark" ? "mt-4 text-sm leading-7 text-slate-300" : "mt-4 text-sm leading-7 text-slate-600"}>
                  {feedbackItems[featuredIndex].message}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  {feedbackItems.map((_, index) => (
                    <span
                      key={index}
                      className={`h-2 rounded-full transition-all ${index === featuredIndex ? "w-8 bg-blue-700" : "w-2 bg-blue-300"}`}
                    />
                  ))}
                </div>
              </article>
            ) : null}

            <div className="mt-6 space-y-4">
              {feedbackItems.map((item, index) => (
                <article key={`${item.name}-${index}`} className={theme === "dark" ? "rounded-2xl bg-slate-950 p-4 ring-1 ring-slate-800" : "rounded-2xl bg-[#f7f7ff] p-4 ring-1 ring-slate-200"}>
                  <div className="flex items-start gap-3">
                    <img src={item.image} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <span className="rounded-full bg-blue-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                          {item.role}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-yellow-500">
                        {Array.from({ length: item.rating }).map((_, starIndex) => (
                          <span key={starIndex}>★</span>
                        ))}
                      </p>
                      <p className={theme === "dark" ? "mt-3 text-sm leading-7 text-slate-300" : "mt-3 text-sm leading-7 text-slate-600"}>
                        {item.message}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme={theme === "dark" ? "dark" : "light"}
      />
      <Footer />
    </div>
  )
}

export default Feedback
