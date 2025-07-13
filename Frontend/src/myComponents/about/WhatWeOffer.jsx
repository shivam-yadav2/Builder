import TextContentCard from '@/utils/TextContentCard'
import React from 'react'

const WhatWeOffer = () => {
  return (
      <div>
          {/* what we offer */}
          <div className="p-5  mt-10     md:mb-10 md:p-10 bg-[#F5F5F5]">
              <h1 className="text-3xl lg:text-4xl font-bold text-center mb-10">What We Offer ?</h1>

              <div className="md:grid grid-cols-3  gap-7">
                  <div className="col-span-1 mb-5 md:mb-0">
                      <TextContentCard src="assets/img/image6.png" title="Green Valey" des="Austin, Texas" />

                  </div>

                  <div className="col-span-1 mb-5 md:mb-0">
                      <TextContentCard src="assets/img/image6.png" title="Green Valey" des="Austin, Texas" />
                  </div>

                  <div className="col-span-1 mb-5 md:mb-0">
                      <TextContentCard src="assets/img/image6.png" title="Green Valey" des="Austin, Texas" />
                  </div>
              </div>
          </div>
    </div>
  )
}

export default WhatWeOffer