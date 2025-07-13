import React from "react";

const MapLocation = ({ location }) => {
  if (!location) return null;

  // Combine full address for Google Maps search query
  const fullAddress = `${location.fullAddress}, ${location.city}, ${location.state}, ${location.pincode}`;

  // Encode for URL safety
  const mapQuery = encodeURIComponent(fullAddress);

  return (
    <div className="border border-gray-300 rounded-2xl mt-4 p-4 sm:p-6">
      <h1 className="font-semibold text-xl sm:text-2xl pb-4 sm:pb-6">Map Location</h1>

      <iframe
        title="Google Map"
        className="w-full h-[30vh] lg:h-[70vh] rounded-xl mb-6"
        src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>

      <div className="sm:grid grid-cols-2 gap-6 text-sm sm:text-base">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="font-semibold">Address</span>
            <span>{location.fullAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">City</span>
            <span>{location.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">State</span>
            <span>{location.state}</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="font-semibold">Postal Code</span>
            <span>{location.pincode}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Landmark</span>
            <span>{location.landmark}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Locality</span>
            <span>{location.locality}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLocation;
