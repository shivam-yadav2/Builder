import React from 'react'
import ButtonCustom from "@/utils/ButtonCustom"; // Custom button component


const Content = () => {
  return (
      <div>
          <div className=" bg-gray-50 flex md:items-center justify-center p-6 md:pt-12 md:p-12  mb-8 ">
              <div className="max-w-6xl w-full grid grid-cols-1 gap-12">
                  {/* Header Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-6">
                      <div>
                          <h1 className="text-3xl lg:text-4xl font-bold text-[#001324] md:leading-snug">
                              Your Trusted Partner for Real Estate and Construction Solutions
                              {/* <span className="inline lg:block"> real estate</span> */}
                          </h1>
                      </div>
                      <div className="text-xs lg:text-sm leading-relaxed">
                          <p className=" mb-8 text-[#353535]">
                              Rsusb2sbuilders Foundation specializes in real estate and civil construction services, connecting buyers, sellers, tenants, and investors with tailored solutions. From building your dream home to securing profitable investments, we provide expert guidance every step of the way.
                          </p>
                          <ButtonCustom
                              title={"Explore Our Services"}
                              onClick={() => console.log("Button clicked!")}
                          />
                      </div>
                  </div>

                  {/* Image Section */}
                  <div className="w-full text-center ">
                      <img
                          src="/assets/img/about1.png" // Replace with actual image URL
                          alt="Modern houses"
                          className="w-full h-auto rounded-xl shadow-lg"
                      />
                  </div>
              </div>
          </div>
    </div>
  )
}

export default Content