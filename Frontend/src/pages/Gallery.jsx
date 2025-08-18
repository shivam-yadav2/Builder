import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, Home, Building2, Eye, DollarSign } from 'lucide-react';
import Layout from '@/layout/Layout';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Sample data - replace with your actual data
  const properties = [
    {
      id: 1,
      title: "Modern Villa in Downtown",
      type: "sold",
      category: "residential",
      price: "$850,000",
      location: "Downtown District",
      bedrooms: 4,
      bathrooms: 3,
      area: "2,400 sq ft",
      soldDate: "2024-03-15",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop"
      ],
      description: "Beautiful modern villa with contemporary design and premium finishes throughout."
    },
    {
      id: 2,
      title: "Luxury Apartment Complex",
      type: "constructed",
      category: "residential",
      price: "$2.5M Project",
      location: "Riverside Area",
      units: 24,
      floors: 6,
      area: "45,000 sq ft",
      completedDate: "2024-01-20",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"
      ],
      description: "State-of-the-art apartment complex with modern amenities and eco-friendly features."
    },
    {
      id: 3,
      title: "Commercial Office Building",
      type: "constructed",
      category: "commercial",
      price: "$4.2M Project",
      location: "Business District",
      floors: 12,
      area: "85,000 sq ft",
      completedDate: "2023-11-10",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop"
      ],
      description: "Premium office building with cutting-edge design and sustainable technologies."
    },
    {
      id: 4,
      title: "Family Home with Garden",
      type: "sold",
      category: "residential",
      price: "$625,000",
      location: "Suburban Heights",
      bedrooms: 3,
      bathrooms: 2,
      area: "1,800 sq ft",
      soldDate: "2024-02-28",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop"
      ],
      description: "Charming family home with spacious garden and traditional architecture."
    },
    {
      id: 5,
      title: "Retail Shopping Center",
      type: "constructed",
      category: "commercial",
      price: "$6.8M Project",
      location: "City Center",
      stores: 32,
      floors: 3,
      area: "120,000 sq ft",
      completedDate: "2023-09-15",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
      ],
      description: "Modern shopping center with diverse retail spaces and entertainment facilities."
    },
    {
      id: 6,
      title: "Penthouse Suite",
      type: "sold",
      category: "residential",
      price: "$1.2M",
      location: "Skyline Tower",
      bedrooms: 3,
      bathrooms: 2,
      area: "2,100 sq ft",
      soldDate: "2024-01-10",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
      ],
      description: "Stunning penthouse with panoramic city views and luxury amenities."
    }
  ];

  const filteredProperties = properties.filter(property => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'sold') return property.type === 'sold';
    if (selectedCategory === 'constructed') return property.type === 'constructed';
    return property.category === selectedCategory;
  });

  const PropertyCard = ({ property }) => (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant={property.type === 'sold' ? 'destructive' : 'default'} className="text-white">
            {property.type === 'sold' ? 'SOLD' : 'CONSTRUCTED'}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {property.category}
          </Badge>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{property.title}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    {property.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${property.title} ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
                    <DollarSign className="w-5 h-5" />
                    {property.price}
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {property.type === 'sold' && (
                      <>
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{property.bedrooms} Bedrooms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{property.bathrooms} Bathrooms</span>
                        </div>
                      </>
                    )}
                    {property.type === 'constructed' && (
                      <>
                        {property.floors && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{property.floors} Floors</span>
                          </div>
                        )}
                        {property.units && (
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{property.units} Units</span>
                          </div>
                        )}
                        {property.stores && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{property.stores} Stores</span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{property.area}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {property.type === 'sold' 
                      ? `Sold on ${new Date(property.soldDate).toLocaleDateString()}`
                      : `Completed on ${new Date(property.completedDate).toLocaleDateString()}`
                    }
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{property.description}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{property.location}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-green-600">{property.price}</span>
          <span className="text-sm text-gray-500">
            {property.type === 'sold' ? `${property.bedrooms}BR/${property.bathrooms}BA` : property.area}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Portfolio</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our collection of successfully sold properties and completed construction projects. 
              Each property represents our commitment to quality and excellence in real estate.
            </p>
          </div>

          {/* Filter Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="all" className="text-sm">All Projects</TabsTrigger>
              <TabsTrigger value="sold" className="text-sm">Sold Properties</TabsTrigger>
              <TabsTrigger value="constructed" className="text-sm">Constructed</TabsTrigger>
              <TabsTrigger value="residential" className="text-sm">Residential</TabsTrigger>
              <TabsTrigger value="commercial" className="text-sm">Commercial</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            {selectedCategory === 'all' ? 'All Projects' : 
             selectedCategory === 'sold' ? 'Sold Properties' :
             selectedCategory === 'constructed' ? 'Constructed Buildings' :
             selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) + ' Properties'}
          </h2>
          <span className="text-gray-600">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
            <p className="text-gray-500">Try selecting a different category to view more properties.</p>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">
                {properties.filter(p => p.type === 'sold').length}
              </div>
              <div className="text-blue-100">Properties Sold</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                {properties.filter(p => p.type === 'constructed').length}
              </div>
              <div className="text-blue-100">Buildings Constructed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                {properties.filter(p => p.category === 'residential').length}
              </div>
              <div className="text-blue-100">Residential Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                {properties.filter(p => p.category === 'commercial').length}
              </div>
              <div className="text-blue-100">Commercial Projects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Gallery;