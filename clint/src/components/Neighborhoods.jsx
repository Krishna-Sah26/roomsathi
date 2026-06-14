import { useTheme } from "../hooks/useTheme"

const neighborhoods = [
  {
    title: "Birgunj Market",
    subtitle: "The heart of commerce and convenience.",
    image:
      "https://nagarikmirror.com/wp-content/uploads/2025/03/278289856_6062238937142182_7380655517912392123_n.jpg",
    span: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Adarshnagar",
    subtitle: "Premium residential community.",
    image:
      "https://nagarikmirror.com/wp-content/uploads/2025/03/278289856_6062238937142182_7380655517912392123_n.jpg",
    span: "md:col-span-1",
  },
  {
    title: "Pratima Chowk",
    subtitle: "Up-and-coming living hub.",
    image:
      "https://nagarikmirror.com/wp-content/uploads/2025/03/278289856_6062238937142182_7380655517912392123_n.jpg",
    span: "md:col-span-1",
  },
]

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
