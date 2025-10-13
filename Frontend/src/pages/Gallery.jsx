import { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  IndianRupee,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Award,
  Home,
  Star,
} from "lucide-react";
import Layout from "@/layout/Layout";
import axios from "axios";

// Helper function to check if a URL is a video
const isVideo = (url) => {
  const videoExtensions = ['.mp4', '.webm', '.ogg'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

const Gallery = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState([]);

  // Fetch gallery items from backend
  useEffect(() => {
    fetchGalleryProperties();
  }, []);

  const fetchGalleryProperties = async () => {
    try {
      const response = await axios.get(
        "https://backend.rsusb2sbuildersconstructions.com/api/v1/gallery/get-all"
      );
      setGallery(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch gallery items:", err);
      setLoading(false);
    }
  };


  const openModal = (property) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (
      selectedProperty &&
      currentImageIndex < selectedProperty.images.length - 1
    ) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Render media (image or video)
  const renderMedia = (url, alt, index, isThumbnail = false) => {
    console.log(url)
    const fullUrl = `https://backend.rsusb2sbuildersconstructions.com/${url}` ;
    if (isVideo(url)) {
      return (
        <video
          key={index}
          src={fullUrl}
          className={isThumbnail ? "w-full h-full object-cover" : "w-full h-80 object-cover rounded-2xl"}
          controls={!isThumbnail}
          muted={true}
          autoPlay
        />
      );
    }
    return (
      <img
        key={index}
        src={fullUrl}
        alt={alt}
        className={isThumbnail ? "w-full h-full object-cover" : "w-full h-80 object-cover rounded-2xl"}
      />
    );
  };

  const PropertyCard = ({ property, index }) => (
    <div
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
          <Star className="w-3 h-3 fill-current" />
          <span>SOLD</span>
        </div>
      </div>

      <div className="relative overflow-hidden h-64">
        {renderMedia(property.images[0], property.title, 0)}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => openModal(property)}
            className="bg-white/95 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center space-x-2 transform scale-95 group-hover:scale-100 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
          {property.name}
        </h3>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
            <span className="text-sm">{property.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-sm">
              Sold on {new Date(property.sold_date).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center text-emerald-600 font-bold text-lg pt-2">
            <IndianRupee className="w-5 h-5 mr-1" />
            <span>{property.sold_price}</span>
          </div>
        </div>

        {property.tags && property.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {property.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {property.tags.length > 3 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                +{property.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-6 py-16">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Our Success Stories
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse"
              >
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Enhanced Header Section */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-bounce"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 py-16">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="text-white font-medium">
                  Premium Portfolio Showcase
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Our Success Stories
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Discover our collection of successfully sold properties,
                showcasing our commitment to excellence in real estate and our
                clients' dreams fulfilled.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Results Header */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Sold Properties
            </h2>
            <p className="text-gray-600 text-lg">
              {gallery.length}{" "}
              {gallery.length === 1 ? "property" : "properties"} successfully
              sold
            </p>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallery.map((property, index) => (
              <PropertyCard
                key={property._id}
                property={property}
                index={index}
              />
            ))}
          </div>

          {/* No Results */}
          {gallery.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                No properties found
              </h3>
              <p className="text-gray-500 mb-6">
                No sold properties available at the moment.
              </p>
              <button
                onClick={fetchGalleryProperties}
                className="bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-600 transition-colors"
              >
                Refresh
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Modal */}
        {isModalOpen && selectedProperty && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedProperty.name}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Media Gallery */}
                  <div className="space-y-4">
                    <div className="relative">
                      {renderMedia(
                        selectedProperty.images?.[currentImageIndex],
                        `${selectedProperty.name} ${currentImageIndex + 1}`,
                        currentImageIndex
                      )}
                      {selectedProperty.images &&
                        selectedProperty.images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              disabled={currentImageIndex === 0}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white disabled:opacity-50 rounded-full p-2 transition-all"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={nextImage}
                              disabled={
                                currentImageIndex ===
                                selectedProperty.images.length - 1
                              }
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white disabled:opacity-50 rounded-full p-2 transition-all"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}
                    </div>

                    {/* Thumbnail Gallery */}
                    {selectedProperty.images &&
                      selectedProperty.images.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto">
                          {selectedProperty.images.map((media, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                idx === currentImageIndex
                                  ? "border-emerald-500"
                                  : "border-transparent"
                              }`}
                            >
                              {renderMedia(media, `Thumbnail ${idx + 1}`, idx, true)}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* Property Details */}
                  <div className="space-y-6">
                    <div className="flex items-center text-2xl font-bold text-emerald-600">
                      <IndianRupee className="w-5 h-5 mr-1" />
                      {selectedProperty.sold_price}
                    </div>

                    {selectedProperty.description && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Description
                        </h4>
                        <p className="text-gray-700">
                          {selectedProperty.description}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-3 text-emerald-500" />
                        <span>{selectedProperty.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                        <span>
                          Sold on{" "}
                          {new Date(
                            selectedProperty.sold_date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {selectedProperty.tags && selectedProperty.tags.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProperty.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                      <div className="flex items-center mb-2">
                        <Star className="w-5 h-5 text-emerald-600 fill-current mr-2" />
                        <h4 className="font-semibold text-emerald-800">
                          Successfully Sold
                        </h4>
                      </div>
                      <p className="text-emerald-700 text-sm">
                        This property has been successfully sold and represents
                        our commitment to delivering excellent results for our
                        clients.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Styles */}
        <style jsx>{`
          @keyframes slide-in-from-bottom-4 {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-in {
            animation-fill-mode: both;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Gallery;
// export default Gallery;/