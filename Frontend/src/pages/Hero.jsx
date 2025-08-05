import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-emerald-500 overflow-hidden">
      {/* Background gradient image - replace with your asset */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600"
        style={{ backgroundImage: 'url("/assets/img/bg/Rectangle.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}
      ></div>

      {/* White dot pattern - top left - replace with your asset */}
      <div className="absolute top-32 left-20  opacity-50">
        {/* Placeholder dots - replace with your white circle pattern asset */}
        {/* <div className="grid grid-cols-8 gap-1">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
          ))}
        </div> */}
        {/* Replace above with: */}
        <img src="/assets/img/bg/dot1.png" alt="pattern" className="w-full  object-contain z-20" />
      </div>

      {/* White dot pattern - middle right - replace with your asset */}
      <div className="absolute top-1/3 right-32 opacity-50">
        {/* Placeholder dots - replace with your white circle pattern asset */}
        {/* <div className="grid grid-cols-6 gap-1">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
          ))}
        </div> */}
        {/* Replace above with: */}
        {/* <img src="your-white-dot-pattern.png" alt="pattern" className="w-full h-full object-contain" /> */}
        <img src="/assets/img/bg/dot.png" alt="pattern" className="w-full  object-contain" />

      </div>

      {/* Main content container */}
      <div className="relative z-10  ">
        <div className="grid grid-cols-2  w-full h-full">
          
          {/* Left content */}
          <div className=" text-white mb-12 lg:mb-0 pr-8">
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Membantu Temukan<br />
              Rumah Impian.
            </h1>
            
            <p className="text-lg lg:text-xl mb-12 leading-relaxed opacity-90 max-w-lg">
              <span className="font-semibold">Rumah Impian</span> hadir untuk temukan rumah terbaik 
              untukmu, untuk di jual ataupun di sewa dengan sumber 
              terpercaya.
            </p>

            <button className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors duration-300 flex items-center group">
              Temukan Rumah
              <svg 
                className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Right content - House image */}
          <div className=" flex items-end justify-end">
            {/* Building PNG - replace with your asset */}
            <div className="relative w-full h-full ">
              {/* Placeholder building - replace with your building PNG */}
              {/* <div className="building-placeholder w-full h-96 bg-gray-200 rounded-lg shadow-2xl flex items-center justify-center">
                <span className="text-gray-500 text-lg font-semibold">Building PNG Asset</span>
              </div> */}
              {/* Replace above div with: */}
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
      <div className="absolute bottom-20 left-16 w-16 h-16 opacity-30">
        {/* Placeholder dots - replace with your white circle pattern asset */}
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white rounded-full opacity-60"></div>
          ))}
        </div>
        {/* Replace above with: */}
        {/* <img src="your-white-dot-pattern-small.png" alt="pattern" className="w-full h-full object-contain" /> */}
      </div>

      {/* Right side background elements - if needed */}
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
        {/* Add any additional background elements here if needed */}
      </div>
    </div>
  );
};

export default HeroSection;