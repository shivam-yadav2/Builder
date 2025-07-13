import { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios"; // Add axios
import FormData from "form-data"; // Add form-data

import {
  MapPin,
  Image,
  Video,
  Home,
  LandPlot,
  DollarSign,
  HomeIcon,
  FileCheck,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
// import DashboardLayout from "@/layout/DashboardLayout";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Layout from "@/layout/Layout";
import DashboardLayout from "@/layout/DashboardLayout";
import MyContext from "@/context/MyContext";
import toast from "react-hot-toast";

// Zod schema for validation (unchanged)
const commonSchema = z.object({
  propertyName: z.string().min(1, "Property name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  fullAddress: z.string().min(1, "Address is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  locality: z.string().min(1, "Locality is required"),
  landmark: z.string().optional(),
  locationLink: z.string().url("Invalid URL").optional(),
  landArea: z.number().positive("Land area must be positive"),
  perUnitPrice: z.number().positive("Price must be positive"),
  propertyIntent: z.enum(["sale", "rent", "both"]),
  nearby: z.array(z.string()).min(1, "At least one nearby place is required"),
  images: z.any(),
  // video: z.any().optional(),
});

const houseSchema = commonSchema.extend({
  propertyType: z.enum(["house"]),
  purpose: z.enum(["residencial", "commercial"]),
  rooms: z.number().min(1, "At least 1 room required"),
  bedrooms: z.number().min(0, "Bedrooms cannot be negative"),
  kitchen: z.number().min(0, "Kitchens cannot be negative"),
  floors: z.number().min(1, "At least 1 floor required"),
  bathrooms: z.number().min(1, "At least 1 bathroom required"),
  areas: z.number().positive("Area must be positive"),
  parking: z.number().min(0, "Parking cannot be negative"),
  buildYear: z.number().min(1900, "Invalid year"),
  amenities: z.array(z.string()).min(1, "At least one amenity is required"),
});

const landSchema = commonSchema.extend({
  propertyType: z.enum(["land"]),
});

const schema = z.union([houseSchema, landSchema]);

// Component
const AddProperty = () => {
  const [step, setStep] = useState(1);
  const [propertyIntent, setPropertyIntent] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [apiError, setApiError] = useState(null); // State for API errors

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nearby: [],
      amenities: [],
      propertyType: "",
      propertyIntent: "",
      purpose: "",
    },
  });

  const context = useContext(MyContext);
  const { userData } = context;

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const id = toast.loading("Adding Property ...")
    if ( data?.images === undefined) {
      console.log("hello")
      toast.error('Atleast ! Image is Required', { id });
      return
    }

    console.log("Form Data:", data); // Log form data for debugging
    try {

      setApiError(null); // Clear previous errors
      const formData = new FormData();

      // Common fields mapping
      formData.append("title", data.propertyName);
      formData.append("description", data.description);
      formData.append("location", data.location);
      formData.append("fullAddress", data.fullAddress);
      formData.append("pincode", data.pincode);
      formData.append("state", data.state);
      formData.append("city", data.city);
      formData.append("locality", data.locality);
      formData.append("landmark", data.landmark || "");
      formData.append("landArea", data.landArea.toString());
      formData.append("unitPrice", data.perUnitPrice.toString());
      formData.append("status", "Available");
      formData.append("propertyType", data.propertyIntent);
      formData.append("creator", userData._id); // Hardcoded as per example
      formData.append("creatorType", "User");

      // Handle nearby and amenities (convert arrays to comma-separated strings if needed)
      if (data.nearby?.length) formData.append("nearby", data.nearby.join(","));
      if (data.amenities?.length)
        formData.append("amenities", data.amenities.join(","));

      // Handle file uploads
      if (data.images?.length) {
        Array.from(data.images).forEach((file, index) => {
          formData.append("images", file);
        });
      }
      

      // House-specific fields
      if (data.propertyType === "house") {
        formData.append("rooms", data.rooms.toString());
        formData.append("bedrooms", data.bedrooms.toString());
        formData.append("kitchen", data.kitchen.toString());
        formData.append("bathrooms", data.bathrooms.toString());
        formData.append("floor", data.floors.toString());
        formData.append("park", data.parking > 0 ? "true" : "false");
        formData.append("buildYear", data.buildYear.toString());
        formData.append("propertyFor", purpose.toString());
        formData.append(
          "totalPrice",
          (data.landArea * data.perUnitPrice).toString()
        ); // Calculate total price
      }

      // API configuration
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url:
          data.propertyType === "house"
            ? "https://admin.samadhaangroups.co.in/api/v1/home/add-home"
            : "https://admin.samadhaangroups.co.in/api/v1/land/add-land",
        headers: {
          Authorization: Cookies.get("accessToken"),
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        data: formData,
      };

      // Make API request
      const response = await axios.request(config);
      console.log("API Response:", JSON.stringify(response.data));
      toast.success("Property added successfully!", { id });
      setStep(6); // Move to success step
      setTimeout(() => {
        navigate("/my_properties"); // Redirect to My Properties after 1 second
      }, 1000);
    }
    catch (error) {
      console.error("API Error:", error);
      setApiError(
        error.response?.data?.message ||
        "Failed to submit property. Please try again."
      );
      console.error("Error logging in:", error.response?.data || error.message);

      // Get error data from response
      const errorData = error.response?.data;

      if (errorData) {
        // Show main error message

        // If there are specific field errors, show them too
        if (errorData.errors && errorData.errors.length > 0) {
          errorData.errors.forEach((err, index) => {
            // For field-specific errors
            if (err.field) {
              toast.error(`${err.field}: ${err.message}`, {
                id: id,
                duration: 4000,
              });
            }
            // For general errors without field
            else if (err.message) {
              toast.error(err.message, {
                id: id,
                duration: 4000,
              });
            }
          });
        } else {
          toast.error(errorData.message || "An error occurred", { id });
        }
      } else {
        // Fallback for network errors or unexpected errors
        toast.error("Network error. Please try again.", { id });
      }
    }
  };

  const nearbyOptions = [
    "Police Station",
    "School",
    "Hospital",
    "Grocery Market",
    "Mall",
    "Park",
  ];
  const amenitiesOptions = [
    "Pool",
    "Gym",
    "Lift",
    "Garden",
    "Clubhouse",
    "Security",
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="space-y-4"
          >
            <CardTitle>Is the property for sale, rent, or both?</CardTitle>
            <div className="flex space-x-4">
              <Button
                variant={propertyIntent === "sale" ? "default" : "outline"}
                className="flex-1"
                onClick={() => {
                  setPropertyIntent("sale");
                  setValue("propertyIntent", "sale");
                  setStep(2);
                }}
              >
                <DollarSign className="mr-2 h-4 w-4" /> Sale
              </Button>
              <Button
                variant={propertyIntent === "rent" ? "default" : "outline"}
                className="flex-1"
                onClick={() => {
                  setPropertyIntent("rent");
                  setValue("propertyIntent", "rent");
                  setPropertyType("house");
                  setValue("propertyType", "house");
                  setStep(3);
                }}
              >
                <HomeIcon className="mr-2 h-4 w-4" /> Rent
              </Button>
              <Button
                variant={propertyIntent === "both" ? "default" : "outline"}
                className="flex-1"
                onClick={() => {
                  setPropertyIntent("both");
                  setValue("propertyIntent", "both");
                  setStep(2);
                }}
              >
                <FileCheck className="mr-2 h-4 w-4" /> Both
              </Button>
            </div>
            {errors.propertyIntent && (
              <p className="text-red-500">{errors.propertyIntent.message}</p>
            )}
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="space-y-4"
          >
            <CardTitle>
              Is the property a house/building or a land plot?
            </CardTitle>
            <div className="flex space-x-4">
              <Button
                variant={propertyType === "house" ? "default" : "outline"}
                className="flex-1"
                onClick={() => {
                  setPropertyType("house");
                  setValue("propertyType", "house");
                  setStep(3);
                }}
              >
                <Home className="mr-2 h-4 w-4" /> House
              </Button>
              <Button
                variant={propertyType === "land" ? "default" : "outline"}
                className="flex-1"
                onClick={() => {
                  setPropertyType("land");
                  setValue("propertyType", "land");
                  setStep(5);
                }}
              >
                <LandPlot className="mr-2 h-4 w-4" /> Land Plot
              </Button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="space-y-4"
          >
            <CardTitle>
              Is the house for residential or commercial use?
            </CardTitle>
            <div className="flex space-x-4">
              <Button
                variant={purpose === "residencial" ? "default" : "outline"}
                className="flex-1"
                onClick={() => {
                  setPurpose("residencial");
                  setValue("purpose", "residencial");
                  setStep(4);
                }}
              >
                <HomeIcon className="mr-2 h-4 w-4" /> Residential
              </Button>
              <Button
                variant={purpose === "commercial" ? "default" : "outline"}
                className="flex-1"
                onClick={() => {
                  setPurpose("commercial");
                  setValue("purpose", "commercial");
                  setStep(4);
                }}
              >
                <Building2 className="mr-2 h-4 w-4" /> Commercial
              </Button>
            </div>
            {errors.purpose && (
              <p className="text-red-500">{errors.purpose.message}</p>
            )}
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="space-y-4"
          >
            <CardTitle>Confirm Your Selections</CardTitle>
            <p>
              You’re adding a{" "}
              {propertyType === "house"
                ? `house for ${purpose} use`
                : "land plot"}{" "}
              for {propertyIntent}.
            </p>
            <Button onClick={() => setStep(5)}>Proceed to Add Details</Button>
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="space-y-6"
          >
            <CardTitle>
              {propertyType === "house"
                ? `Add ${purpose} House Details`
                : "Add Land Plot Details"}
            </CardTitle>
            {apiError && <p className="text-red-500">{apiError}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Property Name</Label>
                  <Controller
                    name="propertyName"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g., Sunshine Villa" />
                    )}
                  />
                  {errors.propertyName && (
                    <p className="text-red-500">
                      {errors.propertyName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Location</Label>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g., Near Main Road" />
                    )}
                  />
                  {errors.location && (
                    <p className="text-red-500">{errors.location.message}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Describe the property"
                      />
                    )}
                  />
                  {errors.description && (
                    <p className="text-red-500">{errors.description.message}</p>
                  )}
                </div>
                <div>
                  <Label>Full Address</Label>
                  <Controller
                    name="fullAddress"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g., 123 Main St" />
                    )}
                  />
                  {errors.fullAddress && (
                    <p className="text-red-500">{errors.fullAddress.message}</p>
                  )}
                </div>
                <div>
                  <Label>Pincode</Label>
                  <Controller
                    name="pincode"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g., 123456" />
                    )}
                  />
                  {errors.pincode && (
                    <p className="text-red-500">{errors.pincode.message}</p>
                  )}
                </div>
                <div>
                  <Label>State</Label>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g., California" />
                    )}
                  />
                  {errors.state && (
                    <p className="text-red-500">{errors.state.message}</p>
                  )}
                </div>
                <div>
                  <Label>City</Label>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g., Los Angeles" />
                    )}
                  />
                  {errors.city && (
                    <p className="text-red-500">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <Label>Locality</Label>
                  <Controller
                    name="locality"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g., Downtown" />
                    )}
                  />
                  {errors.locality && (
                    <p className="text-red-500">{errors.locality.message}</p>
                  )}
                </div>
                <div>
                  <Label>Landmark (Optional)</Label>
                  <Controller
                    name="landmark"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g., Near City Mall" />
                    )}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Location Link (Optional)</Label>
                  <Controller
                    name="locationLink"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g., https://maps.google.com/..."
                      />
                    )}
                  />
                  {errors.locationLink && (
                    <p className="text-red-500">
                      {errors.locationLink.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Land Area (sq.ft)</Label>
                  <Controller
                    name="landArea"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="e.g., 1000"
                      />
                    )}
                  />
                  {errors.landArea && (
                    <p className="text-red-500">{errors.landArea.message}</p>
                  )}
                </div>
                <div>
                  <Label>{propertyType === "house" ? "Total Price" : "Per Unit Price"} </Label>
                  <Controller
                    name="perUnitPrice"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="e.g., 5000"
                      />
                    )}
                  />
                  {errors.perUnitPrice && (
                    <p className="text-red-500">
                      {errors.perUnitPrice.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Nearby Checkboxes */}
              <div>
                <Label>What is Nearby?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {nearbyOptions.map((option) => (
                    <Controller
                      key={option}
                      name="nearby"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value?.includes(option)}
                            onCheckedChange={(checked) => {
                              const updated = checked
                                ? [...(field.value || []), option]
                                : field.value.filter((v) => v !== option);
                              field.onChange(updated);
                            }}
                          />
                          <Label>{option}</Label>
                        </div>
                      )}
                    />
                  ))}
                </div>
                {errors.nearby && (
                    <p className="text-red-500">
                      {errors.nearby.message}
                    </p>
                  )}
              </div>

              {/* House-Specific Fields */}
              {propertyType === "house" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Rooms</Label>
                    <Controller
                      name="rooms"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="e.g., 4"
                        />
                      )}
                    />
                    {errors.rooms && (
                      <p className="text-red-500">{errors.rooms.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Bedrooms</Label>
                    <Controller
                      name="bedrooms"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="e.g., 3"
                        />
                      )}
                    />
                    {errors.bedrooms && (
                      <p className="text-red-500">{errors.bedrooms.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Kitchen</Label>
                    <Controller
                      name="kitchen"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="e.g., 1"
                        />
                      )}
                    />
                    {errors.kitchen && (
                      <p className="text-red-500">{errors.kitchen.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Floors</Label>
                    <Controller
                      name="floors"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="e.g., 2"
                        />
                      )}
                    />
                    {errors.floors && (
                      <p className="text-red-500">{errors.floors.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Bathrooms</Label>
                    <Controller
                      name="bathrooms"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="e.g., 2"
                        />
                      )}
                    />
                    {errors.bathrooms && (
                      <p className="text-red-500">{errors.bathrooms.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Carpet Area (sq.ft)</Label>
                    <Controller
                      name="areas"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="e.g., 1200"
                        />
                      )}
                    />
                    {errors.areas && (
                      <p className="text-red-500">{errors.areas.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Parking Slots</Label>
                    <Controller
                      name="parking"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="e.g., 1"
                        />
                      )}
                    />
                    {errors.parking && (
                      <p className="text-red-500">{errors.parking.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Build Year</Label>
                    <Controller
                      name="buildYear"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="e.g., 2020"
                        />
                      )}
                    />
                    {errors.buildYear && (
                      <p className="text-red-500">{errors.buildYear.message}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {amenitiesOptions.map((option) => (
                        <Controller
                          key={option}
                          name="amenities"
                          control={control}
                          render={({ field }) => (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.value?.includes(option)}
                                onCheckedChange={(checked) => {
                                  const updated = checked
                                    ? [...(field.value || []), option]
                                    : field.value.filter((v) => v !== option);
                                  field.onChange(updated);
                                }}
                              />
                              <Label>{option}</Label>
                            </div>
                          )}
                        />
                      ))}
                    </div>
                    {errors.amenities && (
                    <p className="text-red-500">
                      {errors.amenities.message}
                    </p>
                  )}
                  </div>
                </div>
              )}

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Images</Label>
                  <Controller
                    name="images"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    )}
                  />
                  {errors.images && (
                    <p className="text-red-500">
                      {errors.images.message}
                    </p>
                  )}
                </div>
                {/* <div>
                  <Label>Video (Optional)</Label>
                  <Controller
                    name="video"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => field.onChange(e.target.files[0])}
                      />
                    )}
                  />
                </div> */}
              </div>

              <Button type="submit">Submit Property</Button>
            </form>
          </motion.div>
        );
      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="space-y-4"
          >
            <CardTitle>Property Added Successfully!</CardTitle>
            <p>Your property has been submitted for review.</p>
            <Button onClick={() => setStep(1)}>Add Another Property</Button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4">
        <Card className="w-full max-w-7xl">
          <CardHeader>
            <CardTitle>Add a New Property</CardTitle>
            <Progress value={(step / 6) * 100} className="w-full" />
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;
