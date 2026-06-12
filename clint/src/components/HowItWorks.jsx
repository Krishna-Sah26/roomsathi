import { Home, Phone, Search } from "lucide-react"
import { useTheme } from "../hooks/useTheme"

function HowItWorks() {
  const { theme } = useTheme()

  return (
    <section className={theme === "dark" ? "bg-slate-900 px-4 py-14 md:py-20" : "bg-[#f1f0ff] px-4 py-14 md:py-20"}>
      <div className="mx-auto max-w-7xl text-center">
        <h2 className={theme === "dark" ? "text-2xl font-semibold tracking-tight text-white md:text-3xl" : "text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl"}>
          Finding a Room is Easy
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className={theme === "dark" ? "rounded-2xl bg-slate-950 p-6 shadow-sm ring-1 ring-slate-800 sm:p-8" : "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"}>
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Search size={22} />
            </div>
            <h3 className={theme === "dark" ? "mb-2 text-base font-semibold text-white sm:text-lg" : "mb-2 text-base font-semibold text-slate-900 sm:text-lg"}>1. Search</h3>
            <p className={theme === "dark" ? "text-sm leading-6 text-slate-400" : "text-sm leading-6 text-slate-500"}>
              Browse through hundreds of verified listings in Birgunj based on your budget and location.
            </p>
          </div>
          <div className={theme === "dark" ? "rounded-2xl bg-slate-950 p-6 shadow-sm ring-1 ring-slate-800 sm:p-8" : "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"}>
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <Phone size={22} />
            </div>
            <h3 className={theme === "dark" ? "mb-2 text-base font-semibold text-white sm:text-lg" : "mb-2 text-base font-semibold text-slate-900 sm:text-lg"}>2. Visit</h3>
            <p className={theme === "dark" ? "text-sm leading-6 text-slate-400" : "text-sm leading-6 text-slate-500"}>
              Contact owners directly via WhatsApp or call to schedule a physical visit to the property.
            </p>
          </div>
          <div className={theme === "dark" ? "rounded-2xl bg-slate-950 p-6 shadow-sm ring-1 ring-slate-800 sm:p-8" : "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"}>
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Home size={22} />
            </div>
            <h3 className={theme === "dark" ? "mb-2 text-base font-semibold text-white sm:text-lg" : "mb-2 text-base font-semibold text-slate-900 sm:text-lg"}>3. Move In</h3>
            <p className={theme === "dark" ? "text-sm leading-6 text-slate-400" : "text-sm leading-6 text-slate-500"}>
              Finalize the deal, sign the simple rental agreement, and get your keys to your new home.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
