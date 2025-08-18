import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative bg-emerald-500 overflow-hidden min-h-screen lg:min-h-auto">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600"
        style={{ backgroundImage: 'url("/assets/img/bg/Rectangle.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}
      ></div>

      {/* White dot pattern - top left */}
      <div className="absolute top-8 left-4 sm:top-16 sm:left-8 md:top-24 md:left-12 lg:top-32 lg:left-20 opacity-50 hidden sm:block">
        <img src="/assets/img/bg/dot1.png" alt="pattern" className="w-24 sm:w-32 md:w-40 lg:w-full object-contain z-20" />
      </div>

      {/* White dot pattern - middle right */}
      <div className="absolute top-1/4 right-4 sm:right-8 md:right-16 lg:right-32 opacity-50 hidden sm:block">
        <img src="/assets/img/bg/dot.png" alt="pattern" className="w-24 sm:w-32 md:w-40 lg:w-full object-contain" />
      </div>

      {/* Main content container */}
      <div className="relative z-10 pt-8 px-4 sm:pt-12 sm:px-6 md:px-8 lg:pt-12 lg:ps-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full gap-6 lg:gap-0">
          {/* Left content */}
          <div className="text-white mb-8 lg:mb-0 pr-0 lg:pr-8 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight">
              Build Your<br />Dream Home
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-12 leading-relaxed opacity-90 max-w-full sm:max-w-md md:max-w-lg">
              <span className="font-semibold">RsusBuilders and Constructions</span> is here to craft your perfect home 
              with top-quality construction and trusted real estate solutions, 
              whether you're building, buying, or renting.
            </p>

            <button className="bg-white text-emerald-600 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-50 transition-colors duration-300 flex items-center group w-fit">
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

          {/* Right content - House image */}
          <div className="flex items-center lg:items-end justify-center lg:justify-end">
            <div className="relative w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-full h-auto">
              <img 
                src="/assets/img/bg/building.png" 
                alt="Modern House" 
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional decorative dot pattern - bottom left */}
      <div className="absolute bottom-8 left-4 sm:bottom-12 sm:left-8 md:bottom-16 md:left-12 lg:bottom-20 lg:left-16 w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 opacity-30">
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white rounded-full opacity-60"></div>
          ))}
        </div>
      </div>

      {/* Right side background elements */}
      <div className="absolute right-0 top-0 w-1/2 sm:w-1/3 h-full opacity-10 hidden lg:block">
        {/* Placeholder for additional background elements */}
      </div>
    </div>
  );
};

export default HeroSection;