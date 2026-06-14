import { useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useTheme } from "../hooks/useTheme"

function Terms() {
  const { theme } = useTheme()

  useEffect(() => {
    document.title = "Terms & Conditions | RoomSathi"
  }, [])

  const terms = [
    "Users must provide accurate information.",
    "Property owners are responsible for their listings.",
    "RoomSathi acts only as a platform connecting users and owners.",
    "RoomSathi is not responsible for rental disputes.",
    "Fake listings may be removed without notice.",
    "Users must not misuse the platform.",
  ]

  return (
    <div className={theme === "dark" ? "bg-slate-950 pt-16 text-slate-100" : "bg-white pt-16 text-slate-900"}>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-14 md:px-6">
        <div className={theme === "dark" ? "rounded-3xl bg-slate-900 p-8 ring-1 ring-slate-800 md:p-12" : "rounded-3xl bg-white p-8 ring-1 ring-slate-200 md:p-12"}>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">Terms &amp; Conditions</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">Please use RoomSathi responsibly.</h1>
          <p className={theme === "dark" ? "mt-6 max-w-3xl text-lg leading-8 text-slate-300" : "mt-6 max-w-3xl text-lg leading-8 text-slate-600"}>
            By using RoomSathi, you agree to the following terms:
          </p>

          <div className={theme === "dark" ? "mt-10 rounded-2xl bg-slate-950 p-6 ring-1 ring-slate-800" : "mt-10 rounded-2xl bg-[#f7f7ff] p-6 ring-1 ring-slate-200"}>
            <ul className={theme === "dark" ? "space-y-4 text-sm leading-7 text-slate-300" : "space-y-4 text-sm leading-7 text-slate-600"}>
              {terms.map((term) => (
                <li key={term} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-blue-700" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>

          <section className={theme === "dark" ? "mt-5 rounded-2xl bg-slate-950 p-6 ring-1 ring-slate-800" : "mt-5 rounded-2xl bg-[#f7f7ff] p-6 ring-1 ring-slate-200"}>
            <h2 className="text-xl font-semibold">Platform Rights</h2>
            <p className={theme === "dark" ? "mt-3 text-sm leading-7 text-slate-300" : "mt-3 text-sm leading-7 text-slate-600"}>
              RoomSathi reserves the right to modify these terms at any time.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Terms
