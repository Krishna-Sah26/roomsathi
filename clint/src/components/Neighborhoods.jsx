import { useTheme } from "../hooks/useTheme"

const neighborhoods = [
  {
    title: "Birgunj Market",
    subtitle: "The heart of commerce and convenience.",
    image:
      "https://nagarikmirror.com/19658/",
    span: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Adarshnagar",
    subtitle: "Premium residential community.",
    image:
      "https://nagarikmirror.com/19658/",
    span: "md:col-span-1",
  },
  {
    title: "Pratima Chowk",
    subtitle: "Up-and-coming living hub.",
    image:
      "https://scontent.fktm10-1.fna.fbcdn.net/v/t39.30808-6/474204031_1178340493791678_8797010872277763191_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=tjXgbxQJoA8Q7kNvwE3doOM&_nc_oc=AdoZLo6T6uGU_zRkcf7EllrCTxMMLXEOe9AQiy80Y5XZOKfCpJcFOdMi9EKNqnrpE_WzzUioEJSmHRYg3pfnR2pl&_nc_zt=23&_nc_ht=scontent.fktm10-1.fna&_nc_gid=k9sC12JWYQFfaeorUgn1OQ&_nc_ss=7b2a8&oh=00_Af6lwweiRWCyjJFEFo0WObMOr03CsIEydZTE8HIgMUX-bw&oe=6A1F2EDB",
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
