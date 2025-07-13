import React from 'react'
import { MoveRight } from 'lucide-react'
import { Link } from 'react-router-dom'


const WhyChooseUs = () => {
  return (
      <div>
          <div className="px-5 md:px-10 mt-5 pb-10">
              <h1 className="text-3xl lg:text-4xl font-bold text-center mb-10">Why Choose Us?</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:grid-rows-3 lg:grid-rows-2 gap-7">
                  <div className="bg-[#F2FAFF] rounded-lg p-7 pr-20 md:pr-24">
                      <img src="/assets/img/Frame1.svg" className="border-[1px] border-black p-2 rounded-full " alt="" />
                      <h3 className="text-xl font-semibold mt-5 mb-2">Market Expertise</h3>
                      <p className="text-sm leading-relaxed text-[#353535]">Unmatched Market Expertise in real estate and construction, backed by years of experience and deep industry knowledge to guide you every step of the way.</p>
                  </div>

                  <div className="bg-[#F2FAFF] rounded-lg p-7 pr-20 md:pr-24 md:order-3 lg:order-none  ">
                      <img src="/assets/img/Frame2.svg" className="border-[1px] border-black p-2 rounded-full" alt="" />
                      <h3 className="text-xl font-semibold mt-5 mb-2">Customized Approach</h3>
                      <p className="text-sm leading-relaxed text-[#353535] ">Tailored Solutions Designed for You – we understand your unique needs and provide personalized real estate and construction services to match your goals.</p>
                  </div>

                  <div className="bg-[#004e2e] text-white rounded-lg p-7 md:p-11 pr-20 md:pr-24 flex flex-col justify-between  md:row-span-2 order-4 md:order-2 lg:order-none">
                      <div>
                          <img src="/assets/img/Frame3.svg" className="border-[1px] border-white p-2 rounded-full " alt="" />
                          <h3 className="text-xl font-semibold mt-5 mb-2">Strong Network</h3>
                          <p className="text-sm leading-relaxed mb-20">A Strong Network of industry professionals, ensuring access to the best opportunities, resources, and partnerships for your real estate and construction projects.</p>
                      </div>
                      <Link to='/contact'>
                          <button className="flex bg-white w-fit items-center gap-3 cursor-pointer px-5 py-2 rounded-3xl text-[#001324]">Get in touch <MoveRight /></button>
                      </Link>
                  </div>

                  <div className="bg-[#F2FAFF] rounded-lg p-7 pr-24 md:order-4 lg:order-none  md:col-span-2">
                      <img src="/assets/img/Group.svg" className="border-[1px] border-black p-2 rounded-full " alt="" />
                      <h3 className="text-xl font-semibold mt-5 mb-2">Commitment to Excellence</h3>
                      <p className="text-sm leading-relaxed text-[#353535]">Committed to Excellence in Every Project – Trust Samadhaan Foundation for reliable, transparent, and result-driven real estate and construction solutions. Contact us today to start your journey!</p>
                  </div>
              </div>
          </div>
    </div>
  )
}

export default WhyChooseUs