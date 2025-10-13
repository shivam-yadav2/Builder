import { useEffect, useState, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import PropertyCard from "../utils/PropertyCard";
import Layout from "@/layout/Layout";
import WhoWeAre from "@/myComponents/about/WhoWeAre";
import FootContact from "@/myComponents/home/FootContact";
import MyContext from "@/context/MyContext";
import { Loader2 } from "lucide-react";

const FilteredProperties = () => {
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { homeData, landData } = useContext(MyContext);

  console.log(homeData, landData)

  useEffect(() => {
    // Combine and filter properties from context
    const combineProperties = () => {
      setLoading(true);
      setError(null);

      try {
        // Combine homeData and landData
        const allProperties = [...(homeData || []), ...(landData || [])].filter(
          (property) => property.status === "Available" && !property.isDelete
        );

        // Extract query parameters
        const queryParams = new URLSearchParams(location.search);
        const filters = {
          intent: queryParams.get("intent") || "rent",
          type: queryParams.get("type") || "",
          propertyType: queryParams.get("propertyType") || "",
          location: queryParams.get("location")?.toLowerCase() || "",
          budget: queryParams.get("budget") ? parseInt(queryParams.get("budget")) : null,
          area: queryParams.get("area") ? parseInt(queryParams.get("area")) : null,
        };

        console.log(filters)

        // Client-side filtering (match at least one criterion)
        const filtered = allProperties.filter((property) => {
          let matchesAny = false;

          console.log(property)

          // Intent-based filters
          if (filters.intent === "rent") {
            if (
              property.type === "Home" &&
              ["rent", "both"].includes(property.propertyType)
            ) {
              matchesAny = true;
            }
            // Match propertyType (commercial/residential)
            if (
              filters.propertyType &&
              property.propertyType === filters.propertyType
            ) {
              matchesAny = true;
            }
          } else if (filters.intent === "buy") {
            console.log("in buy")
            if (
              ["Home", "Land"].includes(property.type) &&
              ["sale", "both"].includes(property.propertyType)
            ) {
              console.log("in buy 2")

              matchesAny = true;
            }
            // Match area (±10% range)
            if (filters.area && property.landArea) {
              const minArea = filters.area * 0.9;
              const maxArea = filters.area * 1.1;
              if (property.landArea >= minArea && property.landArea <= maxArea) {
                matchesAny = true;
              }
            }
          }

          // Location filter (partial match)
          if (
            filters.location &&
            property.location?.toLowerCase().includes(filters.location)
          ) {
            matchesAny = true;
          }

          // Budget filter
          if (filters.budget && property.unitPrice <= filters.budget) {
            matchesAny = true;
          }

          return matchesAny;
        });

        setFilteredProperties(filtered);
      } catch (err) {
        console.error("Error processing properties:", err);
        setError("Failed to process properties. Please try again.");
        toast.error("Error processing properties", {
          description: err.message || "An error occurred",
        });
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    combineProperties();
  }, [homeData, landData, location.search]);

  // Determine page title based on intent
  const pageTitle =
    (new URLSearchParams(location.search).get("intent") || "rent") === "buy"
      ? "Filtered Properties for Buy"
      : "Filtered Properties for Rent";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl lg:text-4xl font-semibold text-gray-800 mb-4 text-center">
          {pageTitle}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Note: Properties shown match at least one of your filter criteria (e.g., location, budget, type).
        </p>
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <Link
                to={`/property-details/${property.type}/${property._id}`}
                key={property._id}
              >
                <PropertyCard
                  title={property.title}
                  location={property.location}
                  sqft={property.landArea}
                  price={property.unitPrice}
                  image={
                    property.images?.[0]
                      ? `https://backend.rsusb2sbuildersconstructions.com/${property.images[0]}`
                      : "/placeholder-image.jpg"
                  }
                  name={property?.creator?.name || "Unknown"}
                  city={property?.city}
                  type={property?.propertyType}
                  avatar={
                    property?.creator?.avatar
                      ? `https://backend.rsusb2sbuildersconstructions.com/${property.creator.avatar}`
                      : "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                  }
                />
              </Link>
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500 text-lg">
              No properties match your filters.
            </p>
          )}
        </div>
      </div>
      <WhoWeAre />
      <FootContact />
    </Layout>
  );
};

export default FilteredProperties;