import React from "react";

const AmentiesFeatures = ({ amenities }) => {
  // Safely get the amenities list from a comma-separated string
  const amenitiesList =
    Array.isArray(amenities?.amenities) && amenities?.amenities.length > 0
      ? amenities?.amenities[0]?.split(',').map((item) => item.trim())
      : [];

  // Render fallback if no amenities are listed
  if (amenitiesList.length === 0) {
    return (
      <div className="border border-gray-300 rounded-2xl mt-4 p-4 sm:p-6">
        <h1 className="font-semibold text-xl sm:text-2xl pb-4 sm:pb-6">
          Amenities and Features
        </h1>
        <p className="text-gray-500 text-sm">No amenities listed.</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-2xl mt-4 p-4 sm:p-6">
      <h1 className="font-semibold text-xl sm:text-2xl pb-4 sm:pb-6">
        Amenities and Features
      </h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 list-disc list-inside text-gray-700 font-semibold text-sm">
        {amenitiesList.map((amenity, index) => (
          <li key={index}>{amenity}</li>
        ))}
      </ul>
    </div>
  );
};

export default AmentiesFeatures;

