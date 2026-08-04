import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative bg-emerald-500 overflow-hidden flex flex-col min-h-[calc(100svh-64px)] sm:min-h-[calc(100svh-72px)] lg:min-h-[calc(100svh-96px)]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600"
        style={{ backgroundImage: 'url("/assets/img/bg/Rectangle.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}
      ></div>

      {/* Dot pattern – top left */}
      <div className="absolute top-8 left-4 sm:top-16 sm:left-8 md:top-24 md:left-12 lg:top-32 lg:left-20 opacity-50 hidden sm:block">
        <img src="/assets/img/bg/dot1.png" alt="" className="w-24 sm:w-32 md:w-40 lg:w-full object-contain z-20" />
      </div>

      {/* Dot pattern – middle right */}
      <div className="absolute top-1/4 right-4 sm:right-8 md:right-16 lg:right-32 opacity-50 hidden sm:block">
        <img src="/assets/img/bg/dot.png" alt="" className="w-24 sm:w-32 md:w-40 lg:w-full object-contain" />
      </div>

      {/* Main content – flex-1 fills remaining height so hero spans full viewport */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row px-4 sm:px-6 md:px-8 lg:px-12 pt-8 sm:pt-10 lg:pt-0">
        {/* Left: text */}
        <div className="text-white flex flex-col justify-center py-6 lg:py-12 lg:w-1/2 lg:pr-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Construction Services<br />For Your Home
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed opacity-90 max-w-md">
            <span className="font-semibold">RsusBuilders and Constructions</span> is here to help with
            trusted construction services and simple real estate support,
            whether you are building a new home, buying property, or selling your property through us.
          </p>

          <button
            onClick={() =>
              document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="bg-white text-emerald-600 px-5 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-50 transition-colors duration-300 flex items-center group w-fit cursor-pointer"
          >
            Explore Our Services
            <svg
              className="ml-2 sm:ml-3 w-4 sm:w-5 h-4 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Right: building image – fills remaining height, image sticks to bottom */}
        <div className="flex-1 flex items-end justify-center lg:justify-end mt-2 sm:mt-4 lg:mt-0 lg:w-1/2">
          <img
            src="/assets/img/bg/building.png"
            alt="Modern House"
            className="w-full object-contain object-bottom drop-shadow-2xl
                       max-h-[38svh] min-h-[150px]
                       sm:max-h-[45svh]
                       lg:max-h-none lg:h-full lg:max-w-full"
          />
        </div>
      </div>

      {/* Bottom-left dot grid decoration */}
      <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-12 sm:w-14 h-12 sm:h-14 opacity-30">
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white rounded-full opacity-60"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
