import React, { useContext } from "react";
import PropertyCard from "../utils/PropertyCard";
import Layout from "@/layout/Layout"; // Layout component
import WhoWeAre from "@/myComponents/about/WhoWeAre";
import FootContact from "@/myComponents/home/FootContact";
import WhatWeOffer from "@/myComponents/about/WhatWeOffer";
import { Link } from "react-router-dom";
import MyContext from "@/context/MyContext";

const BuyProperties = () => {
  const properties = [
    {
      location: "145 Brooklyn Ave, California, New York",
      title: "Casa Lomas De Machalí Machas",
      sqft: "1200",
      price: "15000",
    },
    {
      location: "Amausi, Lucknow, UP",
      title: "2 BHK House For Sale In Amausi",
      sqft: "3250",
      price: "3900000",
    },
    {
      location: "Amausi, Lucknow, UP",
      title: "2 BHK House For Sale In Amausi",
      sqft: "3250",
      price: "3900000",
    },
    {
      location: "145 Brooklyn Ave, California, New York",
      title: "Casa Lomas De Machalí Machas",
      sqft: "1200",
      price: "15000",
    },
    {
      location: "Amausi, Lucknow, UP",
      title: "2 BHK House For Sale In Amausi",
      sqft: "3250",
      price: "3900000",
    },
    {
      location: "Amausi, Lucknow, UP",
      title: "2 BHK House For Sale In Amausi",
      sqft: "3250",
      price: "3900000",
    },
  ];

  const { homeData, landData } = useContext(MyContext);

  const combinedProperties = [
    ...(homeData || []),
    ...(landData || [])
  ].filter((property) => property?.status === 'Available' && !property?.isDelete && (property?.propertyType === 'sale' || property?.propertyType === 'both'));

  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="pt-6 pl-6 md:pl-16 text-3xl ml-[30%] lg:text-4xl font-semibold">Featured Listing Properties For Buy</h1>
        <div className="grid grid-cols-1 mt-5 md:grid-cols-3 gap-6 p-6 md:ml-10 ">
          {combinedProperties.length > 0 ? (
            combinedProperties.map((property, i) => {
              console.log(property)
              return (
                <Link to={`/property-details/${property?.type}/${property?._id}`} key={property._id}>
                  <PropertyCard
                    title={property.title}
                    location={property.location}
                    sqft={property.landArea}
                    price={property.unitPrice}
                    image={`${import.meta.env.VITE_API_BASE_URL}/${property.images?.[0]}`}
                    city={property?.city}
                    type={property?.propertyType}
                  />
                </Link>
              )
            })
          ) : (
            <p className="text-center col-span-3 text-gray-500">No properties available</p>
          )}
        </div>
      </div>

      <WhoWeAre />
      {/* <WhatWeOffer /> */}

      <FootContact />
    </Layout>
  );
};

export default BuyProperties;
