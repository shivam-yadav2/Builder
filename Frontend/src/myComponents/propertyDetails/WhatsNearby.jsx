import React from 'react';

const WhatsNearby = ({ nearby }) => {
  // Safely check if nearby?.nearby is an array and has at least one string
  const nearBy =
    Array.isArray(nearby?.nearby) && nearby?.nearby.length > 0 ? nearby.nearby[0].split(',').map((item) => item.trim())
      : [];

  return (
    <div className="border border-gray-300 rounded-2xl mt-4 p-4 sm:p-6">
      <h1 className="font-semibold text-xl sm:text-2xl pb-4">What's Nearby?</h1>
      <p className='text-sm sm:text-base'>
        Explore nearby amenities to precisely locate your property and identify surrounding conveniences, providing a comprehensive overview of the living environment and the property's convenience.
      </p>

      {nearBy.length > 0 ? (
        <div className="sm:grid grid-cols-1 sm:pr-30 lg:pr-70 gap-30 lg:gap-60 pt-6 text-sm sm:text-base px-9">
          <div className="space-y-1">
            
              
               <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 list-disc list-inside text-gray-700 font-semibold text-sm">
        {nearBy.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
           
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 pt-4 px-9">No nearby places listed.</p>
      )}
    </div>
  );
};

export default WhatsNearby;
