import React, { useContext } from "react";
import PropertyCard from "../utils/PropertyCard";
import Layout from "@/layout/Layout"; // Layout component
import WhatWeOffer from "@/myComponents/about/WhatWeOffer";
import WhoWeAre from "@/myComponents/about/WhoWeAre";
import FootContact from "@/myComponents/home/FootContact";
import { Link } from "react-router-dom";
import MyContext from "@/context/MyContext";
import ContactSection from "@/myComponents/home/ContactSection";

const RentProperties = () => {
  const { homeData, landData, userData } = useContext(MyContext);
  //console.log("homeData:", homeData);
  //console.log("landData:", landData);

  const properties = [...(homeData || []), ...(landData || [])].filter(
    (property) => property?.status === "Available" && !property?.isDelete
  );


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
                  image={`https://backend.rsusb2sbuildersconstructions.com/${property.images?.[0]}`}
                  name={property?.creator?.name}
                  city={property?.city}
                  type={property?.propertyType}
                  avatar={property?.creator?.avatar ? `https://backend.rsusb2sbuildersconstructions.com/${property?.creator?.avatar} ` : `https://cdn-icons-png.flaticon.com/512/9187/9187604.png`}
                  property={property}
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
      <ContactSection/>

    </Layout>
  );
};

export default RentProperties;
