import { useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useTheme } from "../hooks/useTheme"

function Contact() {
  const { theme } = useTheme()

  useEffect(() => {
    document.title = "Contact Us | RoomSathi"
  }, [])

  return (
    <div className={theme === "dark" ? "bg-slate-950 pt-16 text-slate-100" : "bg-white pt-16 text-slate-900"}>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-14 md:px-6">
        <div className={theme === "dark" ? "rounded-3xl bg-slate-900 p-8 ring-1 ring-slate-800 md:p-12" : "rounded-3xl bg-white p-8 ring-1 ring-slate-200 md:p-12"}>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">Contact Us</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">We are here to help.</h1>
          <p className={theme === "dark" ? "mt-6 max-w-3xl text-lg leading-8 text-slate-300" : "mt-6 max-w-3xl text-lg leading-8 text-slate-600"}>
            Reach out for support, listing questions, or partnership inquiries.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Email", "roomsathi.contact@gmail.com", "mailto:roomsathi.contact@gmail.com"],
              ["Website", "https://roomsathi-blush.vercel.app", "https://roomsathi-blush.vercel.app"],
              ["Location", "Birgunj, Nepal", null],
            ].map(([label, value, href]) => (
              <div key={label} className={theme === "dark" ? "rounded-2xl bg-slate-950 p-5 ring-1 ring-slate-800" : "rounded-2xl bg-[#f7f7ff] p-5 ring-1 ring-slate-200"}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">{label}</h2>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="mt-3 block text-lg font-semibold break-words transition hover:text-blue-700"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="mt-3 text-lg font-semibold">{value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Contact
