import React, { useContext } from "react";
import PropertyCard from "../utils/PropertyCard";
import MyContext from "@/context/MyContext";
import { Link } from "react-router-dom";

const TopProperty = () => {
  const { homeData = [], landData = [] } = useContext(MyContext);

  // Combine all property data
  const allProperties = [...homeData, ...landData];

  // Filter top properties
  const bestProperties = allProperties.filter((property) => {
    const hasAmenities = Array.isArray(property.amenities) && property.amenities[0]?.length > 0;
    const hasNearby = Array.isArray(property.nearby) && property.nearby[0]?.length > 0;
    return hasAmenities && hasNearby
  });

  return (
    <section className="container my-[80px] mx-auto">
      <div className="w-full">
        <div className="flex flex-col gap-3 items-center justify-center py-5">
          <span className="text-[#004e2e] font-semibold text-[15px]">
            Top Properties
          </span>
          <h1 className="md:text-4xl text-3xl font-bold">
            Best Property Value
          </h1>
        </div>

        <div className="grid grid-cols-1 mt-5 md:grid-cols-3 gap-6 p-6 md:ml-10">
          {bestProperties.length > 0 ? (
            bestProperties.slice(0, 3).map((property, index) => (
              <Link to={`/property-details/${property?.type}/${property?._id}`} key={property?._id}>
                <PropertyCard key={index} title={property?.title}
                  location={property?.location}
                  sqft={property?.landArea}
                  price={property?.unitPrice}
                  image={`http://localhost:4000/${property?.images[0]}`}
                  name={property?.creator?.name}
                  city={property?.city}
                  type={property?.propertyType}
                  avatar={property?.creator?.avatar ? `http://localhost:4000/${property?.creator?.avatar} ` : `https://cdn-icons-png.flaticon.com/512/9187/9187604.png`} />
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-3">
              No suitable properties found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopProperty;
