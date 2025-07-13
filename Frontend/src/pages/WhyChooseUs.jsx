import React from 'react'
import { FaCheckCircle, FaCogs, FaHandshake } from 'react-icons/fa';
const WhyChooseUs = () => {
  return (
    <>
      <section className="container mx-auto w-full py-10">
        <div className=" px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left Side: Image */}
            <div className="w-full md:w-1/2">
              <img
                src="assets/img/image6.png"
                alt="Modern living room"
                className="w-full h-[600px] object-cover   rounded-lg shadow-lg"
              />
            </div>

            {/* Right Side: Benefits */}
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              {/* Heading */}
              <div>
                <span className='text-[#1563df] font-semibold text-[15px]'>Our Benefit</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                  Why Choose HomeLengo
                </h2>
                <p className="text-gray-600 mt-3">
                  Our seasoned team excels in real estate with years of successful
                  market navigation, offering informed decisions and optimal
                  results.
                </p>
              </div>

              {/* Benefit Cards */}
              <div className="flex flex-col gap-6">
                {/* Proven Expertise */}
                <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-md">
                  <FaCheckCircle className="text-blue-500 text-5xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Proven Expertise
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Our seasoned team excels in real estate with years of
                      successful market navigation, offering informed decisions and
                      optimal results.
                    </p>
                  </div>
                </div>

                {/* Customized Solutions */}
                <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-md">
                  <FaCogs className="text-blue-500 text-5xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Customized Solutions
                    </h3>
                    <p className="text-gray-600 mt-1">
                      We pride ourselves on crafting personalized strategies to
                      match your unique goals, ensuring a seamless real estate
                      journey.
                    </p>
                  </div>
                </div>

                {/* Transparent Partnerships */}
                <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-md">
                  <FaHandshake className="text-blue-500 text-5xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Transparent Partnerships
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Transparency is key in our client relationships. We
                      prioritize clear communication and ethical practices,
                      fostering trust and reliability throughout.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default WhyChooseUs