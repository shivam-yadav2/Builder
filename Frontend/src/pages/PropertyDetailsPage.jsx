import React, { useContext, useEffect, useState } from "react";
import Layout from "@/layout/Layout"; // Layout component
import HouseCarousel from "@/myComponents/propertyDetails/HouseCarousel";
import AboutProperty from "@/myComponents/propertyDetails/AboutProperty";
import VideoSection from "@/myComponents/propertyDetails/VideoSection";
import PropertyDetailSec from "@/myComponents/propertyDetails/PropertyDetailSec";
import AmentiesFeatures from "@/myComponents/propertyDetails/AmentiesFeatures";
import MapLocation from "@/myComponents/propertyDetails/MapLocation";
import WhatsNearby from "@/myComponents/propertyDetails/WhatsNearby";
import PropertyCard from "@/utils/PropertyCard";
import {
  LockKeyhole,
  CircleCheckBig,
  CalendarCheck,
  ShieldUser,
} from "lucide-react";
import { Link, NavLink, useParams } from "react-router-dom";
import axios from "axios";
import MyContext from "../context/MyContext";
import ContactSection from "@/myComponents/home/ContactSection";
const PropertyDetailsPage = () => {
  const { type, id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { homeData } = useContext(MyContext);
  //console.log(type)

  const fetchDetailProperty = async () => {
    // try {
    //   const data = JSON.stringify({
    //     id: id,
    //   });

    //   console.log(endpoint);

    //   const config = {
    //     method: "post",
    //     maxBodyLength: Infinity,
    //     url: `https://backend.rsusb2sbuildersconstructions.com/api/v1/${
    //       type === "Land"
    //         ? "land/land-detail"
    //         : type === "Home"
    //           ? "home/home-detail"
    //           : null
    //     }`,
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //     },
    //     data: data,
    //   };

    //   const response = await axios.request(config);
    //   setProperty(response.data?.data || null);
    //   setLoading(false);
    // } catch (error) {
    //   console.error("Error fetching property:", error);
    //   setProperty(null);
    //   setLoading(false);
    // }

    const data = JSON.stringify({
      id: id,
    });

    const Homeurl =
      "https://backend.rsusb2sbuildersconstructions.com/api/v1/home/home-detail";
    const Landurl =
      "https://backend.rsusb2sbuildersconstructions.com/api/v1/land/land-detail";

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: type === "Land" ? Landurl : Homeurl,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response?.data);
        setProperty(response?.data)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (id && type) {
      fetchDetailProperty();
    }
  }, [id, type]);

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

  // useEffect(() => {
  //   let config = {
  //     method: "post",
  //     maxBodyLength: Infinity,
  //     url: `https://backend.rsusb2sbuildersconstructions.com/api/v1/land/land-detail/${id}`,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // });

  const combinedProperties = [...(homeData || [])].filter(
    (property) => property?.status === "Available" && !property?.isDelete
  );


  // console.log(property);
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`/api/properties/${id}`);
        setProperty(response?.data);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading)
    return <p className="text-center text-4xl py-10">Loading property...</p>;
  if (!property)
    return <p className="text-center text-4xl py-10">Property not found.</p>;

  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-0">
        <HouseCarousel property={property?.data} />

        <div className="lg:grid grid-cols-12 mb-6">
          <div className="col-span-9">
            <AboutProperty property={property?.data} type={type} />
            {/* <VideoSection video={property.video} /> */}
            <PropertyDetailSec details={property?.data} />
            <AmentiesFeatures amenities={property?.data} />
            <MapLocation location={property?.data} />
            <WhatsNearby nearby={property?.data} />
          </div>

          <div className="hidden lg:block col-span-3">
            <div className=" pl-4">
              <div className="border-2 border-gray-300 rounded-xl  p-4">
                <h1 className="text-xl font-semibold">Why Choose Us?</h1>
                <div className="text-sm space-y-2 mt-4 text-gray-800">
                  <p>
                    <LockKeyhole className="inline size-4 mr-1" /> Secure
                    Booking
                  </p>
                  <p>
                    <CircleCheckBig className="inline size-4 mr-1" /> Best Price
                    Guarantee
                  </p>
                  <p>
                    <CalendarCheck className="inline size-4 mr-1" /> Easy
                    Booking Process
                  </p>
                  <p>
                    <ShieldUser className="inline size-4 mr-1" /> Available
                    Support 24/7
                  </p>
                </div>
              </div>

              <div className="border-2 border-gray-200 rounded-xl mt-6 p-4">
                <h1 className="text-2xl font-semibold">Latest Properties</h1>
                <div className="mt-4 space-y-6">
                  {combinedProperties?.length > 0 ? (
                    <>
                      {combinedProperties?.slice(0, 5)?.map((property, i) => (
                        <>
                          <PropertyCard
                            key={id}
                            title={property?.title}
                            location={property?.location}
                            sqft={property?.landArea}
                            price={property?.unitPrice}
                            image={`https://backend.rsusb2sbuildersconstructions.com/${property?.images[0]}`}
                          />

                        </>
                      ))}
                      {combinedProperties?.length > 5 && (
                        <div className="text-center pt-4">
                          <NavLink
                            to="/"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            More Properties
                          </NavLink>
                        </div>
                      )}

                    </>
                  ) : (
                    <p className="text-center col-span-3 text-gray-500">
                      No properties available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactSection/>

    </Layout>
  );
};

export default PropertyDetailsPage;
