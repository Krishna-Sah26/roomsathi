import { useNavigate } from "react-router-dom"
import BrandLogo from "./BrandLogo"
import ThemeToggle from "./ThemeToggle"
import { useTheme } from "../hooks/useTheme"

function Navbar() {
  const navigate = useNavigate()
  const { theme } = useTheme()

  const goToLogin = (role) => {
    navigate(`/login?role=${role}`)
  }

  return (
    <nav className={theme === "dark" ? "fixed left-0 top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 backdrop-blur md:px-6" : "fixed left-0 top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 px-4 py-3 text-slate-900 backdrop-blur md:px-6"}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <BrandLogo
          to="/"
          size="lg"
          textClassName={theme === "dark" ? "text-xl text-white md:text-[1.35rem]" : "text-xl text-blue-700 md:text-[1.35rem]"}
        />

        <div className="flex flex-wrap items-center justify-end gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => goToLogin("owner")}
            className="rounded-full bg-blue-700 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-800 sm:px-4 sm:text-sm"
          >
            I&apos;m an Owner
          </button>
          <button
            type="button"
            onClick={() => goToLogin("user")}
            className="rounded-full bg-blue-700 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-800 sm:px-4 sm:text-sm"
          >
            I&apos;m a Seeker
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
