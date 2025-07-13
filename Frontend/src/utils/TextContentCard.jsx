import React from 'react'
import { ArrowUpRight } from 'lucide-react';


const TextContentCard = ({src, title, des}) => {
  return (
    <div>
      <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <img
              src={src}
              alt="Property Image"
              className="w-full  object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div

              className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-t flex flex-col justify-end p-6 md:p-12   text-white"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.2189250700280112) 8%, rgba(0,0,0,0.2329306722689075) 46%, rgba(0,0,0,0.7203256302521008) 100%)",
              }}
            >
              <h3 className="text-xl capitalize font-semibold whitespace-nowrap">{title}  <ArrowUpRight className='inline'/></h3>
              <p className="text-md  ">{des}</p> 
            </div>
          </div>
    </div>
  )
}

export default TextContentCard
