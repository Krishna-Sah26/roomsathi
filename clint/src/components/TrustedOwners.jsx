import { useTheme } from "../hooks/useTheme"

const owners = [
  "Birgunj Realtors",
  "Adarsh Estates",
  "Madhesh Housing",
  "City Stay Co.",
]

function TrustedOwners() {
  const { theme } = useTheme()

  return (
    <section className={theme === "dark" ? "bg-slate-950 px-4 py-16 md:py-20" : "bg-white px-4 py-16 md:py-20"}>
      <div className="mx-auto max-w-7xl text-center">
        <h2 className={theme === "dark" ? "text-2xl font-semibold tracking-tight text-white md:text-3xl" : "text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl"}>
          Trusted by Birgunj Owners
        </h2>
        <p className={theme === "dark" ? "mt-3 text-sm text-slate-400" : "mt-3 text-sm text-slate-500"}>
          We work with the most reliable property owners in the city.
        </p>

        <div className={theme === "dark" ? "mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-slate-300" : "mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-slate-600"}>
          {owners.map((owner) => (
            <div key={owner} className="flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[10px] text-slate-500">
                *
              </span>
              <span>{owner}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustedOwners
