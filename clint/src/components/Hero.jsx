import SearchBox from "./SearchBox"

function Hero({ search, onSearch }) {
  return (
    <section
      className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-slate-950 bg-cover bg-center bg-no-repeat px-4 pt-28 sm:pt-24 md:min-h-[720px]"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/22/4b/c6/224bc671653d2f01dc2b0ea352b05cb6.jpg')",
        backgroundPosition: "center center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_60%)]" />

      <div className="relative z-10 w-full px-2 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold leading-tight drop-shadow-md sm:text-4xl md:text-6xl md:leading-[1.05]">
            Find Your Ideal Home in Birgunj
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-100/95 md:text-base md:leading-7">
            Verified flats, single rooms, and hostels in the heart of Birgunj market and surrounding areas.
          </p>
        </div>
        <div className="mt-8 md:mt-10">
          <SearchBox search={search} onSearch={onSearch} />
        </div>
      </div>
    </section>
  )
}

export default Hero
