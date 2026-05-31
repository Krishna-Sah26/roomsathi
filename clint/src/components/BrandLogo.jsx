import { Link } from "react-router-dom"

function BrandLogo({
  to = "/",
  className = "",
  showText = true,
  textClassName = "",
  roomClassName = "",
  sathiClassName = "",
  iconClassName = "",
  size = "md",
}) {
  const sizeClassName =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10"

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.01] ${className}`}
    >
      <span
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-blue-600 to-blue-700 shadow-sm ring-1 ring-blue-500/15 ${sizeClassName} ${iconClassName}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path
            d="M32 4c11.6 0 21 9.4 21 21 0 16.1-21 35-21 35S11 41.1 11 25C11 13.4 20.4 4 32 4Z"
            fill="#255eea"
          />
          <path
            d="M32 23.5 18.8 35.8h5.2v10.3h7.9V39h4.2v7.1h7.1V35.8h5.1L32 23.5Z"
            fill="#ffffff"
          />
          <path
            d="M24.1 35.8h15.8v7.8H24.1z"
            fill="#ffffff"
          />
          <circle cx="32" cy="37.6" r="5.5" fill="#ff7a18" />
        </svg>
      </span>
      {showText ? (
        <span className={`select-none font-semibold tracking-tight ${textClassName}`}>
          <span className={roomClassName || "text-blue-700"}>Room</span>
          <span className={sathiClassName || "text-orange-400"}>Sathi</span>
        </span>
      ) : null}
    </Link>
  )
}

export default BrandLogo
