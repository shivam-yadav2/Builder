import React from 'react'

const WhoWeAre = () => {
  return (
      <div >
          <div className="p-5 mt-10 md:p-10">
              <div className="text-center mb-10">
                  <h1 className="text-3xl lg:text-4xl font-bold text-[#001324]">
                      We are more than just a real
                      <span className="inline md:block"> estate agency</span>
                  </h1>
              </div>

              {/*  Section 2 -  subSec1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#F2FAFF] py-8 px-8 md:px-12 mb-10 rounded-xl">
                  {/* Who We Are Section */}
                  <div className="flex flex-col gap-4 p-6 pt-0 md:pt-6">
                      <h2 className="text-2xl font-semibold text-[#004e2e]">
                          WHO WE ARE
                      </h2>
                      <p className="text-[#353535] text-sm leading-relaxed">
                          Discover Rsusb2sbuilders Foundation – Your Trusted Partner for Real Estate and Civil Construction Solutions. We go beyond traditional real estate services, offering comprehensive support for buying, selling, renting, and construction needs with a focus on quality and transparency.
                      </p>
                  </div>
                  <div className="w-full">
                      <img
                          src="/assets/img/about2.png"
                          alt="Modern house exterior"
                          className="w-full h-auto rounded-lg shadow-lg"
                      />
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#F5F5F5] py-8 px-8 md:px-12 mb-12 rounded-xl">
                  {/* Who We Are Section */}
                  <div className="order-2 lg:order-1 w-full">
                      <img
                          src="/assets/img/about3.png"
                          alt="Modern house exterior"
                          className="w-full h-auto rounded-lg shadow-lg"
                      />
                  </div>

                  <div className="flex flex-col gap-4 p-6 pt-0 md:pt-6">
                      <h2 className="text-2xl font-semibold text-black">OUR MISSION</h2>
                      <p className="text-[#353535] text-sm leading-relaxed">
                          At Rsusb2sbuilders Foundation, our mission is to deliver a seamless real estate and construction experience. We empower clients with informed decisions, ensuring every step is rooted in trust, quality, and excellence. Let us help you build, buy, sell, or rent with confidence.
                      </p>
                  </div>


              </div>
          </div>
    </div>
  )
}

export default WhoWeAre