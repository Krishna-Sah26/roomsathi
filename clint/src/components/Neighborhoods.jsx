import { useTheme } from "../hooks/useTheme"

const neighborhoods = [
  {
    title: "Birgunj Market",
    subtitle: "The heart of commerce and convenience.",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=1400&auto=format&fit=crop",
    span: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Adarshnagar",
    subtitle: "Premium residential community.",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1400&auto=format&fit=crop",
    span: "md:col-span-1",
  },
  {
    title: "Pratima Chowk",
    subtitle: "Up-and-coming living hub.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop",
    span: "md:col-span-1",
  },
]

const fallbackImage =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Crect width='1200' height='800' fill='%230f172a'/%3E%3Cpath d='M0 560 C 240 500, 360 680, 600 620 S 960 500, 1200 580 L 1200 800 L 0 800 Z' fill='%231d4ed8' fill-opacity='.18'/%3E%3Ccircle cx='980' cy='180' r='110' fill='%23f59e0b' fill-opacity='.18'/%3E%3Ctext x='60' y='110' fill='%23ffffff' font-family='Arial, sans-serif' font-size='54' font-weight='700'%3ERoomSathi%3C/text%3E%3Ctext x='60' y='170' fill='%23cbd5e1' font-family='Arial, sans-serif' font-size='28'%3ENeighborhood preview unavailable%3C/text%3E%3C/svg%3E"

function Neighborhoods() {
  const { theme } = useTheme()

  return (
    <section className={theme === "dark" ? "bg-slate-950 px-4 py-14 md:py-20" : "bg-white px-4 py-14 md:py-20"}>
      <div className="mx-auto max-w-7xl">
        <h2 className={theme === "dark" ? "text-center text-2xl font-semibold tracking-tight text-white md:text-3xl" : "text-center text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl"}>
          Popular Neighborhoods
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:auto-rows-[180px]">
          {neighborhoods.map((neighborhood, index) => (
            <article
              key={neighborhood.title}
              className={`relative overflow-hidden rounded-2xl ${index === 0 ? "min-h-[260px] sm:min-h-[320px] md:row-span-2 md:min-h-[380px]" : "min-h-[180px]"} ${neighborhood.span}`}
            >
              <img
                src={neighborhood.image}
                alt={neighborhood.title}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = fallbackImage
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-base font-semibold sm:text-lg">{neighborhood.title}</h3>
                <p className="text-xs text-white/80">{neighborhood.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Neighborhoods
