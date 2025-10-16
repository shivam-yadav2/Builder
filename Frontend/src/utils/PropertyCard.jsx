import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

const PropertyCard = ({ location, title, sqft, price, image, name, avatar, city, type , property }) => {
  // Format price for better display
  console.log(property)
  const formatPrice = (price) => {
    if (price >= 100000000) {
      return `IDR.${(price / 1000000).toFixed(0)}.000.000`;
    } else if (price >= 1000000) {
      return `IDR.${(price / 1000000).toFixed(0)}.000.000`;
    }
    return `IDR.${price?.toLocaleString()}`;
  };

  return (
    <Card className="group  bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-[#004e2e] border-0 cursor-pointer">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden p-[2px]">
          <img
            src={image || "/assets/img/homeCard.png"}
            alt={title}
            className="w-full h-full object-cover rounded-t-sm transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Property Tags */}
        <div className="absolute top-2 left-2 flex space-x-2">
          <span className="bg-[#004e2e] text-white text-xs font-semibold uppercase px-3 py-1 rounded-full">
            Available For {type === 'both' ? "Rent & Sale" : type}
          </span>
          <span className="bg-gray-800 text-white text-xs font-semibold capitalize px-3 py-1 rounded-full">
            {city}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="px-4 py-2 pt-4">
        {/* Location */}
        <p className="text-gray-600 group-hover:text-white flex items-center space-x-1 text-sm transition-colors duration-300">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </p>

        {/* Title and Price Row */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex-1">
            <h3 className="text-lg group-hover:text-white font-semibold mt-1 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-sm mb-2 group-hover:text-white text-gray-500 flex items-center space-x-1 transition-colors duration-300">
              <Square className="w-4 h-4" />
              <span>Sqft: {sqft}</span>
            </p>
          </div>
          <span className="text-lg font-bold group-hover:text-white text-gray-900 transition-colors duration-300">
            ₹ {price}
          </span>
        </div>

        {/* White Ribbon on Hover - Property Details */}
        <div className="mt-4  group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <div className="group-hover:bg-white bg-[#004e2e] rounded-lg p-3 shadow-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Bed className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-lg font-bold text-white group-hover:text-gray-900">{property?.bedrooms}</span>
                <span className="text-xs group-hover:text-gray-500 text-gray-100">Bedrooms</span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Bath className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-lg font-bold text-white group-hover:text-gray-900">{property?.bathrooms}</span>
                <span className="text-xs group-hover:text-gray-500 text-gray-100">Bathrooms</span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Square className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-lg font-bold text-white group-hover:text-gray-900">{property?.kitchen}</span>
                <span className="text-xs group-hover:text-gray-500 text-gray-100">Kitchen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Property Type Badge */}
        {/* <div className="mt-4 flex justify-start">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-300 ${
            type === 'Jual' || type === 'sale'
              ? 'bg-emerald-100 text-emerald-700 group-hover:bg-white group-hover:text-emerald-700' 
              : type === 'Sewa' || type === 'rent'
              ? 'bg-red-100 text-red-700 group-hover:bg-white group-hover:text-red-700'
              : 'bg-blue-100 text-blue-700 group-hover:bg-white group-hover:text-blue-700'
          }`}>
            {type === 'Jual' || type === 'sale' ? 'Property Baru' : type === 'Sewa' || type === 'rent' ? 'Sewa' : type}
          </span>
        </div> */}
      </CardContent>
    </Card>
  );
};

// Demo Component with Sample Data
const PropertyShowcase = () => {
  const sampleProperties = [
    {
      _id: '1',
      title: 'Modern Minimalist House',
      location: 'Jl. Soekarno Hatta No.1',
      landArea: '360',
      unitPrice: 200000000,
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      creator: { name: 'John Doe', avatar: null },
      city: 'Jakarta',
      propertyType: 'Jual',
      type: 'sale'
    },
    {
      _id: '2',
      title: 'Luxury Family Home',
      location: 'Jl. Soekarno Hatta No.1',
      landArea: '360',
      unitPrice: 200000000,
      images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      creator: { name: 'Jane Smith', avatar: null },
      city: 'Bandung',
      propertyType: 'Jual',
      type: 'sale'
    },
    {
      _id: '3',
      title: 'Contemporary Villa',
      location: 'Jl. Soekarno Hatta No.1',
      landArea: '360',
      unitPrice: 200000000,
      images: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      creator: { name: 'Ahmad Rahman', avatar: null },
      city: 'Surabaya',
      propertyType: 'Sewa',
      type: 'rent'
    },
    {
      _id: '4',
      title: 'Elegant Two-Story House',
      location: 'Jl. Soekarno Hatta No.1',
      landArea: '360',
      unitPrice: 200000000,
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      creator: { name: 'Maria Santos', avatar: null },
      city: 'Yogyakarta',
      propertyType: 'Sewa',
      type: 'rent'
    },
    {
      _id: '5',
      title: 'Modern Architectural Home',
      location: 'Jl. Soekarno Hatta No.1',
      landArea: '360',
      unitPrice: 200000000,
      images: ['https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      creator: { name: 'David Lee', avatar: null },
      city: 'Bali',
      propertyType: 'Sewa',
      type: 'rent'
    },
    {
      _id: '6',
      title: 'Luxury Modern Villa',
      location: 'Jl. Soekarno Hatta No.1',
      landArea: '360',
      unitPrice: 200000000,
      images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      creator: { name: 'Sarah Wilson', avatar: null },
      city: 'Medan',
      propertyType: 'Sewa',
      type: 'rent'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-green-50/50">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3e%3cpath d='m 40 0 l 0 40 l -40 0 l 0 -40 z' fill='none' stroke='%23059669' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`,
          }} />
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-32 left-20 w-3 h-3 bg-emerald-200 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-64 right-40 w-2 h-2 bg-green-300 rounded-full animate-bounce opacity-30" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-40 w-4 h-4 bg-teal-200 rounded-full animate-pulse opacity-25" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="inline-block relative">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-6 relative">
                Rekomendasi Rumah Untuk Mu
                {/* Decorative underline */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              </h1>
            </div>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleProperties.map((property, index) => (
              <div key={property._id} className="transform transition-all duration-300">
                <PropertyCard
                  title={property.title}
                  location={property.location}
                  sqft={property.landArea}
                  price={property.unitPrice}
                  image={property.images[0]}
                  name={property.creator.name}
                  city={property.city}
                  type={property.propertyType}
                  avatar={property.creator.avatar || `https://cdn-icons-png.flaticon.com/512/9187/9187604.png`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;