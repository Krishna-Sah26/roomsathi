import { useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useTheme } from "../hooks/useTheme"

function PrivacyPolicy() {
  const { theme } = useTheme()

  useEffect(() => {
    document.title = "Privacy Policy | RoomSathi"
  }, [])

  return (
    <div className={theme === "dark" ? "bg-slate-950 pt-16 text-slate-100" : "bg-white pt-16 text-slate-900"}>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-14 md:px-6">
        <div className={theme === "dark" ? "rounded-3xl bg-slate-900 p-8 ring-1 ring-slate-800 md:p-12" : "rounded-3xl bg-white p-8 ring-1 ring-slate-200 md:p-12"}>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">Privacy Policy</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">Your privacy matters to RoomSathi.</h1>
          <p className={theme === "dark" ? "mt-6 max-w-3xl text-lg leading-8 text-slate-300" : "mt-6 max-w-3xl text-lg leading-8 text-slate-600"}>
            Last Updated: June 2026
          </p>
          <p className={theme === "dark" ? "mt-4 max-w-3xl text-base leading-7 text-slate-300" : "mt-4 max-w-3xl text-base leading-7 text-slate-600"}>
            RoomSathi respects your privacy and is committed to protecting your personal information.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              {
                title: "Information We Collect",
                items: ["Name", "Email Address", "Google Account Information", "Room Listing Information", "Location Data (only when permission is granted)"],
              },
              {
                title: "How We Use Information",
                items: ["To provide room rental services", "To improve user experience", "To communicate with users", "To prevent fraud and abuse"],
              },
            ].map((section) => (
              <section key={section.title} className={theme === "dark" ? "rounded-2xl bg-slate-950 p-6 ring-1 ring-slate-800" : "rounded-2xl bg-[#f7f7ff] p-6 ring-1 ring-slate-200"}>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <ul className={theme === "dark" ? "mt-4 space-y-3 text-sm leading-7 text-slate-300" : "mt-4 space-y-3 text-sm leading-7 text-slate-600"}>
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-blue-700" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <section className={theme === "dark" ? "rounded-2xl bg-slate-950 p-6 ring-1 ring-slate-800" : "rounded-2xl bg-[#f7f7ff] p-6 ring-1 ring-slate-200"}>
              <h2 className="text-xl font-semibold">Data Security</h2>
              <p className={theme === "dark" ? "mt-3 text-sm leading-7 text-slate-300" : "mt-3 text-sm leading-7 text-slate-600"}>
                We use industry-standard security measures to protect user data.
              </p>
            </section>

            <section className={theme === "dark" ? "rounded-2xl bg-slate-950 p-6 ring-1 ring-slate-800" : "rounded-2xl bg-[#f7f7ff] p-6 ring-1 ring-slate-200"}>
              <h2 className="text-xl font-semibold">Third Party Services</h2>
              <p className={theme === "dark" ? "mt-3 text-sm leading-7 text-slate-300" : "mt-3 text-sm leading-7 text-slate-600"}>
                RoomSathi uses Google Firebase, Google Analytics, and other trusted services.
              </p>
            </section>
          </div>

          <section className={theme === "dark" ? "mt-5 rounded-2xl bg-slate-950 p-6 ring-1 ring-slate-800" : "mt-5 rounded-2xl bg-[#f7f7ff] p-6 ring-1 ring-slate-200"}>
            <h2 className="text-xl font-semibold">Contact</h2>
            <a href="mailto:roomsathi.contact@gmail.com" className="mt-3 inline-block text-sm font-medium text-blue-700 hover:text-blue-800">
              roomsathi.contact@gmail.com
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default PrivacyPolicy
