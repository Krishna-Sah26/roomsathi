import { Moon, Sun } from "lucide-react"
import { useTheme } from "../hooks/useTheme"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
        theme === "dark"
          ? "border-slate-700 bg-slate-900 text-amber-300 hover:bg-slate-800"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export default ThemeToggle
