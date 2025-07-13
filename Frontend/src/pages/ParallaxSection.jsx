import React from 'react';
import { FaSearch, FaHome } from 'react-icons/fa';

const ParallaxSection = () => {
  return (
    <section className="relative w-full h-[50vh] my-15 overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-fixed bg-cover bg-center" 
        style={{ backgroundImage: `url('assets/img/skyscraper.jpg')` }}
      ></div>
      
      
      
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 w-full max-w-4xl">
         
          <div className="bg-blue-500 cursor-pointer bg-opacity-90 p-6 rounded-lg text-white w-full md:max-w-sm group ">
            <div className="flex items-center mb-4">
              <FaSearch className="w-8 h-8 mr-2" />
              <h2 className="text-xl font-bold group-hover:underline">
                Looking for the new home?
              </h2>
            </div>
            <p className="text-sm md:text-base"> 
              10 new offers every day. 350 offers on site, trusted by a community of thousands of users. 
            </p>
          </div>
          
          
          <div className="bg-blue-500 cursor-pointer bg-opacity-90 p-6 rounded-lg text-white w-full md:max-w-sm group ">
            <div className="flex items-center mb-4">
              <div className="relative">
                <FaHome className="w-8 h-8 mr-2" />
               
              </div>
              <h2 className="text-xl font-bold group-hover:underline">
                Want to sell your home?
              </h2>
            </div>
            <p className="text-sm md:text-base"> 
              10 new offers every day. 350 offers on site, trusted by a community of thousands of users. 
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParallaxSection;