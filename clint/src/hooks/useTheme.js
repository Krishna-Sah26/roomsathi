import { useEffect, useState } from "react"

const THEME_EVENT = "roomsathi-theme-change"

export function getInitialTheme() {
  if (typeof window === "undefined") {
    return "light"
  }

  const savedTheme = localStorage.getItem("roomsathi-theme")
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function setThemePreference(theme) {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem("roomsathi-theme", theme)
  document.documentElement.dataset.theme = theme
  window.dispatchEvent(new Event(THEME_EVENT))
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    setThemePreference(theme)
  }, [theme])

  useEffect(() => {
    const handleThemeChange = () => {
      const nextTheme = getInitialTheme()
      setTheme(nextTheme)
    }

    window.addEventListener("storage", handleThemeChange)
    window.addEventListener(THEME_EVENT, handleThemeChange)

    return () => {
      window.removeEventListener("storage", handleThemeChange)
      window.removeEventListener(THEME_EVENT, handleThemeChange)
    }
  }, [])

  return { theme, setTheme }
}
