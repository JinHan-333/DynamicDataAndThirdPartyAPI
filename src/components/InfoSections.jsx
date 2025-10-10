function InfoSections() {
  return (
    <div className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section 1: Text Left, Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="text-gray-300">
            <p className="text-lg leading-relaxed">
              Shake things up with one click, try a random cocktail, search by ingredient, or
              browse by category. Each recipe comes with clear steps, vibrant images and
              options to translate or check nutrition. Mixing drinks has never been this easy!
            </p>
          </div>
          <div className="relative">
            <img
              src="/images/info-left.jpg"
              alt="Colorful cocktails"
              className="rounded-lg shadow-2xl w-full h-100 object-cover"
            />
          </div>
        </div>

        {/* Section 2: Image Left, Text Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <img
              src="/images/info-right.jpg"
              alt="Cocktail glass with ice"
              className="rounded-lg shadow-2xl w-full h-100 object-cover"
            />
          </div>
          <div className="text-gray-300 order-1 lg:order-2">
            <p className="text-lg leading-relaxed">
              Love cocktails but tired of scattered recipes? Discover new drinks, see
              nutrition details and get recipes in your language—all in one place. From
              inspiration to mindful choices, it's never been easier.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default InfoSections
