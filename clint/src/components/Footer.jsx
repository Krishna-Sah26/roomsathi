import { Camera, Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { Link } from "react-router-dom"
import BrandLogo from "./BrandLogo"
import { useTheme } from "../hooks/useTheme"

function Footer() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const socialLinks = [
    { name: "Facebook", icon: Globe, url: "https://www.facebook.com/profile.php?id=61589455216388" },
    { name: "Instagram", icon: Camera, url: "https://www.instagram.com" },
    { name: "WhatsApp", icon: MessageCircle, url: "https://wa.me/+9779806840014" },
  ]

  return (
    <footer className={isDark ? "border-t border-slate-800 bg-slate-950 px-4 py-14 sm:py-16" : "border-t border-slate-200 bg-white px-4 py-14 sm:py-16"}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-5">
        <div className="max-w-sm">
          <BrandLogo
            to="/"
            className="mb-5"
            size="sm"
            textClassName="text-base text-blue-700"
          />
          <p className={isDark ? "max-w-sm text-sm leading-6 text-slate-400 sm:text-base sm:leading-7" : "max-w-sm text-sm leading-6 text-slate-500 sm:text-base sm:leading-7"}>
            Verified rooms in Birgunj for students, families, and owners.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  title={link.name}
                  aria-label={link.name}
                  className={isDark
                    ? "inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-blue-500 hover:text-blue-400"
                    : "inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:text-blue-700"}
                >
                  <Icon size={16} />
                </a>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className={isDark ? "mb-4 text-base font-semibold text-white" : "mb-4 text-base font-semibold text-slate-900"}>
            Quick Links
          </h3>
          <ul className={isDark ? "space-y-3 text-base text-slate-400" : "space-y-3 text-base text-slate-500"}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/rooms">All Rooms</Link></li>
            <li><Link to="/add-room">Add Room</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>

        <div>
          <h3 className={isDark ? "mb-4 text-base font-semibold text-white" : "mb-4 text-base font-semibold text-slate-900"}>
            Support
          </h3>
          <ul className={isDark ? "space-y-3 text-base text-slate-400" : "space-y-3 text-base text-slate-500"}>
            <li><a href="mailto:roomsathi.contact@gmail.com">Help Center</a></li>
            <li><a href="https://wa.me/+9779806840014" target="_blank" rel="noreferrer">Contact on WhatsApp</a></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms &amp; Conditions</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/contact">Contact Page</Link></li>
          </ul>
        </div>

        <div>
          <h3 className={isDark ? "mb-4 text-base font-semibold text-white" : "mb-4 text-base font-semibold text-slate-900"}>
            Reach Us
          </h3>
          <ul className={isDark ? "space-y-3 text-base text-slate-400" : "space-y-3 text-base text-slate-500"}>
            <li className="flex items-center gap-2"><MapPin size={16} /> Birgunj, Nepal</li>
            <li className="flex items-center gap-2"><Phone size={16} /> +977 9806840014</li>
            <li className="flex items-center gap-2"><Mail size={16} /> roomsathi.contact@gmail.com</li>
          </ul>
        </div>

        <div>
          <h3 className={isDark ? "mb-4 text-base font-semibold text-white" : "mb-4 text-base font-semibold text-slate-900"}>
            Feedback
          </h3>
          <p className={isDark ? "mb-4 text-base leading-7 text-slate-400" : "mb-4 text-base leading-7 text-slate-500"}>
            Tell us what should improve next. Real feedback helps RoomSathi grow.
          </p>
          <Link
            to="/feedback"
            className="inline-flex rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Share Feedback
          </Link>
        </div>
      </div>

      <div className={isDark ? "mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500" : "mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-400"}>
        (c) 2026 RoomSathi Nepal. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
