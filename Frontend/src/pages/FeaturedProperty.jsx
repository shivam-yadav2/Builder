import { Link } from "react-router-dom";
import PropertyCard from "../utils/PropertyCard";
import { useContext } from "react";
import MyContext from "../context/MyContext";
// import React from 'react'

const FeaturedProperty = () => {
  // const properties = [
  //   {
  //     location: "145 Brooklyn Ave, California, New York",
  //     title: "Casa Lomas De Machalí Machas",
  //     sqft: "1200",
  //     price: "15000",
  //   },
  //   {
  //     location: "Amausi, Lucknow, UP",
  //     title: "2 BHK House For Sale In Amausi",
  //     sqft: "3250",
  //     price: "3900000",
  //   },
  //   {
  //     location: "Amausi, Lucknow, UP",
  //     title: "2 BHK House For Sale In Amausi",
  //     sqft: "3250",
  //     price: "3900000",
  //   },
  // ];

  const { homeData, landData, userData } = useContext(MyContext);
  //console.log("homeData:", homeData);
  //console.log("landData:", landData);

  const combinedProperties = [...(homeData || []), ...(landData || [])].filter(
    (property) => property?.status === "Available" && !property?.isDelete
  );


  //  console.log(homeData)

  return (
    <section className="container mx-auto">
      <div className="w-full  py-15 ">
        <div className="flex flex-col gap-3 items-center justify-center ">
          <span className="text-[#004e2e]   font-semibold text-[15px]">
            Featured Properties
          </span>
          <h1 className="md:text-4xl text-3xl font-bold ">
            Recommended For You
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:ml-10">
          {combinedProperties.length > 0 ? (
            combinedProperties.slice(0, 6).map((property) => (
              <Link
                to={`/property-details/${property?.type}/${property?._id}`}
                key={property?._id}
              >
                <PropertyCard
                  title={property?.title}
                  location={property?.location}
                  sqft={property?.landArea}
                  price={ property?.unitPrice}
                  image={`https://admin.samadhaangroups.co.in/${property?.images[0]}`}
                  name={property?.creator?.name}
                  city={property?.city}
                  type={property?.propertyType}
                  avatar={property?.creator?.avatar ? `https://admin.samadhaangroups.co.in/${property?.creator?.avatar} ` : `https://cdn-icons-png.flaticon.com/512/9187/9187604.png`}
                />
              </Link>
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">
              No properties available
            </p>
          )}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProperty;
