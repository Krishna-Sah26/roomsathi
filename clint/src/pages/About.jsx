import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useTheme } from "../hooks/useTheme"

function About() {
  const { theme } = useTheme()

  return (
    <div className={theme === "dark" ? "bg-slate-950 pt-16 text-slate-100" : "bg-white pt-16 text-slate-900"}>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-14 md:px-6">
        <div className={theme === "dark" ? "rounded-3xl bg-slate-900 p-8 ring-1 ring-slate-800 md:p-12" : "rounded-3xl bg-white p-8 ring-1 ring-slate-200 md:p-12"}>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">About RoomSathi</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">Built for verified rooms in Birgunj.</h1>
          <p className={theme === "dark" ? "mt-6 max-w-3xl text-lg leading-8 text-slate-300" : "mt-6 max-w-3xl text-lg leading-8 text-slate-600"}>
            RoomSathi helps students, families, and owners connect without brokers. We keep the experience simple, local, and trustworthy.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Verified Listings", "Only rooms with real owner contact and location details."],
              ["Birgunj Focused", "Search by neighborhood, landmark, and nearby places."],
              ["Direct Contact", "Call or WhatsApp owners directly from the listing."],
            ].map(([title, description]) => (
              <div key={title} className={theme === "dark" ? "rounded-2xl bg-slate-950 p-5 ring-1 ring-slate-800" : "rounded-2xl bg-[#f7f7ff] p-5 ring-1 ring-slate-200"}>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className={theme === "dark" ? "mt-2 text-sm leading-7 text-slate-400" : "mt-2 text-sm leading-7 text-slate-600"}>{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/rooms" className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800">
              Explore Rooms
            </Link>
            <Link to="/feedback" className={theme === "dark" ? "rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-100 transition hover:bg-slate-800" : "rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"}>
              Share Feedback
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default About
