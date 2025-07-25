import { Separator } from "@/components/ui/separator";
import React from "react";
import '../../src/index.css'

const PropertyCard = ({ location, title, sqft, price, image, name, avatar, city, type }) => {
  // console.log(name)
  return (
    <div className="max-w-md  group shadow-xl onHover transition duration-1000 hover:bg-[#004e2e] hover:shadow-lg  bg-white rounded-lg overflow-hidden">
      <div className="relative overflow-hidden">
        <div className=" p-[2px]">
          <img
            src={image ? `${image}` : "/assets/img/homeCard.png"}
            alt={title}
            className="w-full h-full object-cover rounded-t-sm"
          />
        </div>

        <div className="absolute top-2 left-2 flex space-x-2">
          <span className="bg-[#004e2e] text-white text-xs font-semibold uppercase px-3 py-1 rounded-full">
            Available For {type == 'both' ? "Rent & Sale" : type}

          </span>
          <span className="bg-gray-800 text-white text-xs font-semibold capitalize px-3 py-1 rounded-full">
            {city}

          </span>
        </div>
      </div>
      <div className="px-4 py-2 pt-4">
        <p className="text-gray-600 flex items-center space-x-1">
          <span className="text-sm group-hover:text-[white]">📍 {location}</span>
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="">

            <h3 className="text-lg group-hover:text-[white] font-semibold mt-1">{title}</h3>
            <p className="text-sm mb-2 group-hover:text-[white] text-gray-500">🏠 Sqft: {sqft}</p>
          </div>
          <span className="text-lg font-bold group-hover:text-[white] text-gray-900">₹ {price}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
