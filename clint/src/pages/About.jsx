import { useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useTheme } from "../hooks/useTheme"

function About() {
  const { theme } = useTheme()

  useEffect(() => {
    document.title = "About Us | RoomSathi"
  }, [])

  const features = [
    ["Verified Listings", "We focus on trust and real owner information."],
    ["Easy Search", "Find rooms, flats, and rentals faster with simple discovery."],
    ["Direct Owner Contact", "Connect directly with property owners without middlemen."],
    ["Location-Based Discovery", "Explore properties by area and nearby landmarks."],
  ]

  return (
    <div className={theme === "dark" ? "bg-slate-950 pt-16 text-slate-100" : "bg-white pt-16 text-slate-900"}>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-14 md:px-6">
        <div className={theme === "dark" ? "rounded-3xl bg-slate-900 p-8 ring-1 ring-slate-800 md:p-12" : "rounded-3xl bg-white p-8 ring-1 ring-slate-200 md:p-12"}>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">About RoomSathi</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">Simple, transparent room discovery for Birgunj.</h1>
          <p className={theme === "dark" ? "mt-6 max-w-3xl text-lg leading-8 text-slate-300" : "mt-6 max-w-3xl text-lg leading-8 text-slate-600"}>
            RoomSathi is a platform designed to help students, professionals, and families find rooms, flats, and rental properties in Birgunj.
          </p>
          <p className={theme === "dark" ? "mt-4 max-w-3xl text-base leading-7 text-slate-300" : "mt-4 max-w-3xl text-base leading-7 text-slate-600"}>
            Our mission is to make room hunting simple, transparent, and trustworthy.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {features.map(([title, description]) => (
              <div key={title} className={theme === "dark" ? "rounded-2xl bg-slate-950 p-5 ring-1 ring-slate-800" : "rounded-2xl bg-[#f7f7ff] p-5 ring-1 ring-slate-200"}>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className={theme === "dark" ? "mt-2 text-sm leading-7 text-slate-300" : "mt-2 text-sm leading-7 text-slate-600"}>
                  {description}
                </p>
              </div>
            ))}
          </div>

          <section className={theme === "dark" ? "mt-5 rounded-2xl bg-slate-950 p-6 ring-1 ring-slate-800" : "mt-5 rounded-2xl bg-[#f7f7ff] p-6 ring-1 ring-slate-200"}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Founded in Nepal 🇳🇵</p>
            <p className={theme === "dark" ? "mt-3 text-base leading-7 text-slate-300" : "mt-3 text-base leading-7 text-slate-600"}>
              Built with ❤️ for the people of Birgunj.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default About
