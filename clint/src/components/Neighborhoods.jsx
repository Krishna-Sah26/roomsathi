import { useTheme } from "../hooks/useTheme"

const neighborhoods = [
  {
    title: "Birgunj Market",
    subtitle: "The heart of commerce and convenience.",
    image:
      "https://scontent.fktm7-1.fna.fbcdn.net/v/t39.30808-6/472721159_2188777714920366_450765007451783320_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=kJMyaoNtI8AQ7kNvwHg_k1B&_nc_oc=AdoQg-2md4Bfmdg0Y5K0KF-d1MzS4Gckj83bv41WhSMU6sG9R7rgR9uBHsj_VNInJUpi4djn4sFJAEBRfSF4BH8f&_nc_zt=23&_nc_ht=scontent.fktm7-1.fna&_nc_gid=hkFkZFN_fMrP4k8lKCx81A&_nc_ss=7b2a8&oh=00_Af4OXkr-vUdO9mjt0PHOpKGWJYEPpfW2t3BJL0Ap5h7K7g&oe=6A1F42FB",
    span: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Adarshnagar",
    subtitle: "Premium residential community.",
    image:
      "https://scontent.fktm7-1.fna.fbcdn.net/v/t39.30808-6/488509757_1049783497183546_8705668052756281786_n.jpg?stp=dst-jpg_s720x720_tt6&_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=m4bt7glugvAQ7kNvwGHF1Sn&_nc_oc=Adpbu3BqbBOV4mfMvlrUGneGOHGXGVE-Mv2dWV--oMsCoY9xAzAnN-h6rhcyc5dT2aiqa_jmts0P0WVShQKF5q1w&_nc_zt=23&_nc_ht=scontent.fktm7-1.fna&_nc_gid=wEDItQOskCLqfLPxn2ksRg&_nc_ss=7b2a8&oh=00_Af6GXpaIHhtk0doAicb0qnABvU-ZfH-gh5o6-tgOpY20wQ&oe=6A1F3FB1",
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
    <section className={theme === "dark" ? "bg-slate-950 px-4 py-16 md:py-20" : "bg-white px-4 py-16 md:py-20"}>
      <div className="mx-auto max-w-7xl">
        <h2 className={theme === "dark" ? "text-center text-2xl font-semibold tracking-tight text-white md:text-3xl" : "text-center text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl"}>
          Popular Neighborhoods
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:auto-rows-[180px]">
          {neighborhoods.map((neighborhood, index) => (
            <article
              key={neighborhood.title}
              className={`relative overflow-hidden rounded-2xl ${index === 0 ? "md:row-span-2 min-h-[380px]" : "min-h-[180px]"} ${neighborhood.span}`}
            >
              <img
                src={neighborhood.image}
                alt={neighborhood.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">{neighborhood.title}</h3>
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
