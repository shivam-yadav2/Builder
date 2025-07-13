import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  Bookmark,
  Printer,
  BedDouble,
  Bath,
  Ruler,
  Pilcrow,
  Warehouse,
  Bed,
  Grid2x2,
  Hammer,
  Scale3d,
  CookingPot,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutProperty = ({ property, type }) => {
  const [liked, setLiked] = useState(false);

  console.log(property ,type)
 const navigate =   useNavigate()
  if (!property) return null;

  // Helper function to check if a value exists (not null, undefined, or empty string)
  const hasValue = (value) => value !== null && value !== undefined && value !== "";

  // Calculate total price if both unitPrice and landArea exist
  const totalPrice =
    (property?.unitPrice && property?.landArea) && (type == "Land")
      ? (parseFloat(property?.unitPrice) * parseFloat(property?.landArea)).toLocaleString("en-IN")
      : parseFloat(property?.unitPrice).toLocaleString("en-IN");

  // Determine if the property is Home or Land based on type prop
  const isHome = type?.toLowerCase() === "home";

  return (
    <div className="p-4 sm:p-6 mx-auto space-y-6 border rounded-lg">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          {hasValue(property?.title) && (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold">{property?.title}</h1>
              <span className="text-sm font-bold text-gray-600"> For  {property?.propertyType === "both" ? "RENT and SALE" : property?.propertyType?.toUpperCase()} </span>
            </>
          )}
          {totalPrice && (
            <p className="text-xl sm:text-2xl text-[#086DA5] font-semibold mt-2">
              ₹{totalPrice}
              <span className="text-sm text-gray-500"> total</span>
            </p>
          )}
          {hasValue(property?.location) && (
            <p className="text-gray-600 mt-1">{property?.location}</p>
          )}
          <div className="flex gap-4 text-sm mt-3">
            {isHome ? (
              <>
                {hasValue(property?.bedrooms) && (
                  <span className="flex items-center gap-1">
                    <BedDouble className="inline size-4" /> Beds: {property?.bedrooms}
                  </span>
                )}
                {hasValue(property?.bathrooms) && (
                  <span className="flex items-center gap-1">
                    <Bath className="inline size-4" /> Baths: {property?.bathrooms}
                  </span>
                )}
                {hasValue(property?.landArea) && (
                  <span className="flex items-center gap-1">
                    <Ruler className="inline size-4" /> Sqft: {property?.landArea}
                  </span>
                )}


              </>
            ) : (
              <>

                {hasValue(property?.landArea) && (
                  <span className="flex items-center gap-1">
                    <Ruler className="inline size-4" /> Sqft: {property?.landArea}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex md:justify-end gap-3">
          <Button variant="outline" onClick={() => setLiked(!liked)}>
            <Heart className={`w-4 h-4 ${liked ? "text-red-500 fill-red-500" : ""}`} />
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline">
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {hasValue(property?.status) && (
        <span
          className={`${property?.status === "Available"
              ? "bg-blue-600"
              : property?.status === "Sold"
                ? "bg-red-600"
                : "bg-gray-400"
            } text-white text-xs  font-semibold uppercase px-3 py-1 rounded-full`}
        >
          {property?.status} <br />
        </span>
      )}


      <Button onClick = {()=> navigate("/contact")} className="bg-blue-600 hover:bg-blue-700 mt-5 cursor-pointer text-white text-xl font-semibold flex flex-col md:flex-row md:px-3 md:py-3 -ml-2 px-3 py-8 leading-4 rounded-[40px] md:rounded-4xl"
      >
        <span> Contact</span> <span> Us </span>
      </Button>

      {hasValue(property?.description) && (
        <Card className="border-none shadow-none mb-0">
          <CardContent className="text-gray-700 px-0">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="mb-2">{property?.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="border border-bottom"></div>

      <Card className="border-none shadow-none mt-0 pt-0">
        <h1 className="text-xl sm:text-2xl font-semibold md:pl-4">Overview</h1>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-7 px-0 sm:px-4 text-gray-700 text-sm">
          {hasValue(property?.propertyType) && (
            <OverviewItem icon={Pilcrow} label="Type" value={type} />
          )}
          {isHome ? (
            <>
              {hasValue(property?.garages) && (
                <OverviewItem icon={Warehouse} label="Garages" value={property?.garages} />
              )}
              {hasValue(property?.kitchen) && (
                <OverviewItem icon={CookingPot} label="Kitchen" value={property?.kitchen} />
              )}
              {hasValue(property?.bedrooms) && (
                <OverviewItem icon={Bed} label="Bedrooms" value={property?.bedrooms} />
              )}
              {hasValue(property?.bathrooms) && (
                <OverviewItem icon={Grid2x2} label="Bathrooms" value={property?.bathrooms} />
              )}
              {hasValue(property?.buildYear) && (
                <OverviewItem icon={Hammer} label="Year Built" value={property?.buildYear} />
              )}
            </>
          ) : (
            <>
              {hasValue(property?.landArea) && (
                <OverviewItem icon={Scale3d} label="Land Size" value={`${property?.landArea} sqft`} />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const OverviewItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2">
    <Button variant="outline" className="size-9 sm:size-12">
      <Icon className="size-5 sm:size-6" />
    </Button>
    <div>
      <p className="font-medium">{label}:</p>
      <p>{value}</p>
    </div>
  </div>
);

export default AboutProperty;