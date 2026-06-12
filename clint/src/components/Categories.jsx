import { useTheme } from "../hooks/useTheme"

const categories = [
  {
    title: "Full Flats",
    listings: "24 Listings",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Single Rooms",
    listings: "56 Listings",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Hostels",
    listings: "12 Listings",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop",
  },
]

function Categories() {
  const { theme } = useTheme()

  return (
    <section className={theme === "dark" ? "bg-slate-950 px-4 py-14 md:py-20" : "bg-white px-4 py-14 md:py-20"}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className={theme === "dark" ? "text-2xl font-semibold tracking-tight text-white md:text-3xl" : "text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl"}>
            Explore Categories
          </h2>
          <button className="self-start text-sm font-semibold text-blue-700 sm:self-auto">
            View All -&gt;
          </button>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {categories.map((item, index) => (
            <div
              key={index}
              className="group relative h-52 cursor-pointer overflow-hidden rounded-2xl bg-slate-900 shadow-md sm:h-56 md:h-60"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-base font-semibold sm:text-lg">{item.title}</h3>
                <p className="text-xs text-white/80">{item.listings}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
