function Testimonials() {
  return (
    <section className="bg-blue-700 px-4 py-20 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <div className="text-4xl font-semibold text-white/70">99</div>
        <p className="mx-auto mt-8 max-w-3xl text-lg font-semibold leading-8 md:text-xl">
          "RoomSathi helped me find a great single room near my college in just two days. The verification badge gave me peace of mind as a student moving from another city."
        </p>
        <div className="mt-10 flex flex-col items-center">
          <div className="h-14 w-14 overflow-hidden rounded-full border-4 border-white/20 bg-white/90">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
              alt="Rahul Gupta"
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="mt-4 text-sm font-semibold">Rahul Gupta</h3>
          <p className="text-xs text-blue-100">Engineering Student</p>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
