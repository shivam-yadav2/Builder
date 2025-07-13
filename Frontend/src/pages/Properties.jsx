import React, { useContext } from "react";
import PropertyCard from "../utils/PropertyCard";
import Layout from "@/layout/Layout"; // Layout component
import WhatWeOffer from "@/myComponents/about/WhatWeOffer";
import WhoWeAre from "@/myComponents/about/WhoWeAre";
import FootContact from "@/myComponents/home/FootContact";
import { Link } from "react-router-dom";
import MyContext from "@/context/MyContext";

const RentProperties = () => {
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


  return (
    <Layout>
      <div className="container mx-auto ">
        <h1 className="pt-6 pl-6 md:pl-16 ml-[30%] text-3xl lg:text-4xl font-semibold">Featured Listing Properties For Rent</h1>
        <div className="grid grid-cols-1 mt-5 md:grid-cols-3 gap-6 p-6 md:ml-10 ">
          {properties.length > 0 ? (
            properties.map((property, i) => (
              <Link to={`/property-details/${property?.type}/${property?._id}`} key={property._id}>
                <PropertyCard
                  title={property.title}
                  location={property.location}
                  sqft={property.landArea}
                  price={property.unitPrice}
                  image={`https://admin.samadhaangroups.co.in/${property.images?.[0]}`}
                  name={property?.creator?.name}
                  city={property?.city}
                  type={property?.propertyType}
                  avatar={property?.creator?.avatar ? `https://admin.samadhaangroups.co.in/${property?.creator?.avatar} ` : `https://cdn-icons-png.flaticon.com/512/9187/9187604.png`}
                />
              </Link>
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">No properties available</p>
          )}
        </div>
      </div>

      {/* <WhatWeOffer /> */}
      <WhoWeAre />
      <FootContact />
    </Layout>
  );
};

export default RentProperties;
