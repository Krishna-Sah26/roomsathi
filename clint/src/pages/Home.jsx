import { useState } from "react"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Categories from "../components/Categories"
import FeaturedRooms from "../components/FeaturedRooms"
import Neighborhoods from "../components/Neighborhoods"
import HowItWorks from "../components/HowItWorks"
import TrustedOwners from "../components/TrustedOwners"
import ReviewSlider from "../components/ReviewSlider"
import Footer from "../components/Footer"
import { useTheme } from "../hooks/useTheme"
import { Link } from "react-router-dom"

function Home() {
  const [search, setSearch] = useState("")
  const { theme } = useTheme()

  return (
    <div className={theme === "dark" ? "bg-slate-950 pt-16 text-slate-100" : "bg-white pt-16 text-slate-900"}>
      <Navbar />
      <Hero search={search} onSearch={setSearch} />
      <Categories />
      <FeaturedRooms search={search} />
      <Neighborhoods />
      <HowItWorks />
      <TrustedOwners />
      <ReviewSlider />
      <section className={theme === "dark" ? "bg-slate-950 px-4 py-12 text-center" : "bg-white px-4 py-12 text-center"}>
        <div className={theme === "dark" ? "mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900 px-6 py-10" : "mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-[#f7f7ff] px-6 py-10"}>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
            Feedback
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">
            Share your experience with RoomSathi
          </h2>
          <p className={theme === "dark" ? "mt-4 text-sm leading-7 text-slate-300 md:text-base" : "mt-4 text-sm leading-7 text-slate-600 md:text-base"}>
            Students, owners, and parents can share feedback to help others trust the platform more.
          </p>
          <Link
            to="/feedback"
            className="mt-6 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Open Feedback Page
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Home
