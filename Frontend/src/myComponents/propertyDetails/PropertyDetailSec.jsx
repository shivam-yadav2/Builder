import React from "react";

const PropertyDetailSec = ({ details, type }) => {
  if (!details) return null;

  // Helper function to check if a value exists (not null, undefined, or empty)
  const hasValue = (value) =>
    value !== null && value !== undefined && value !== "" && value !== 0;

  // Calculate total price
  const totalPrice =
    details?.unitPrice && details?.landArea
      ? (parseFloat(details?.unitPrice) * parseFloat(details?.landArea)).toLocaleString("en-IN")
      : details.totalPrice
      ? parseFloat(details?.totalPrice).toLocaleString("en-IN")
      : null;

  // Determine if the property is Home (explicit type or presence of Home-specific fields)
  const isHome =
    type?.toLowerCase() === "home" ||
    (details?.rooms && details?.bedrooms && details?.bathrooms);

  // Common fields for both Home and Land
  const commonFields = [
    // { label: "ID", value: details?._id, format: (v) => `#${v}` },
    { label: "Price", value: totalPrice, format: (v) => `₹${v}` },
    {
      label: "Size",
      value: details?.landArea,
      format: (v) => `${v} sq.ft`,
    },
    { 
      label: "Type", 
      value: details?.propertyType === "sale" 
        ? "Sale" 
        : details?.propertyType === "rent" 
          ? "Rent" 
          : "Rent and Sale" 
    },
    { label: "Status", value: details?.status },
  ];

  // Home-specific fields
  const homeFields = [
    { label: "Rooms", value: details?.rooms },
    { label: "Baths", value: details?.bathrooms },
    {
      label: "Beds",
      value: details?.bedrooms,
      format: (v) => Math.floor(v), // Handle float values
    },
    { label: "Year Built", value: details?.buildYear },
    {label: "Floor", value: details?.floor},
    {
      label: "Garage",
      value: details?.garage,
      format: (v) => (v ? "Yes" : "No"),
    },
    { label: "Kitchen", value: details?.kitchen },
  ];

  // Select fields based on type
  const fields = isHome ? [...commonFields, ...homeFields] : commonFields;

  // Split fields into two columns
  const leftColumn = fields.slice(0, Math.ceil(fields?.length / 2));
  const rightColumn = fields.slice(Math.ceil(fields?.length / 2));

  return (
    <div className="border border-gray-300 rounded-2xl mt-4">
      <h1 className="text-xl sm:text-2xl font-semibold pl-4 pt-4 sm:pl-6 sm:pt-6">
        Property Details
      </h1>
      <div className="text-sm sm:text-base grid grid-cols-2 gap-10 sm:gap-40 py-4 sm:py-6 px-4 sm:pl-6 sm:pr-20">
        {/* Left Column */}
        <div className="space-y-1 md:space-y-2">
          {leftColumn.map((field, index) =>
            hasValue(field?.value) ? (
              <div key={index} className="flex justify-between">
                <span className="font-semibold">{field?.label}:</span>
                <span>
                  {field?.format ? field?.format(field?.value) : field?.value}
                </span>
              </div>
            ) : null
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-1 md:space-y-2">
          {rightColumn.map((field, index) =>
            hasValue(field.value) ? (
              <div key={index} className="flex justify-between">
                <span className="font-semibold">{field.label}:</span>
                <span>
                  {field.format ? field.format(field.value) : field.value}
                </span>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailSec;