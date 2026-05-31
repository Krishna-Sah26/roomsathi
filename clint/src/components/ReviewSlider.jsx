import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import reviews from "../data/reviews"
import { useTheme } from "../hooks/useTheme"

function ReviewSlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { theme } = useTheme()

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % reviews.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  const activeReview = reviews[activeIndex]

  return (
    <section className={theme === "dark" ? "bg-slate-800 px-4 py-20 text-center text-white" : "bg-blue-700 px-4 py-20 text-center text-white"}>
      <div className="mx-auto max-w-4xl">
        <div className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
          Trusted voices
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-8 md:text-2xl">
          &ldquo;{activeReview.review}&rdquo;
        </p>

        <div className="mt-8 flex items-center justify-center gap-1">
          {Array.from({ length: activeReview.stars }).map((_, index) => (
            <Star key={`${activeReview.name}-${index}`} size={18} fill="currentColor" />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center">
          <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-white/20 bg-white/90">
            <img
              src={activeReview.image}
              alt={activeReview.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="mt-4 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
            {activeReview.badge}
          </span>
          <h3 className="mt-4 text-base font-semibold">{activeReview.name}</h3>
          <p className="text-sm text-blue-100">{activeReview.role}</p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {reviews.map((review, index) => (
            <button
              key={review.name}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/40"
              }`}
              aria-label={`Show review from ${review.name}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ReviewSlider
