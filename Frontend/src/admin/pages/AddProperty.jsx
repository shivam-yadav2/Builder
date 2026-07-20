import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios"; // Add axios
import FormData from "form-data"; // Add form-data

import {
  MapPin,
  Image as ImageIcon,
  Video,
  Home,
  LandPlot,
  DollarSign,
  HomeIcon,
  FileCheck,
  Building2,
  ArrowLeft,
  Info,
  CheckCircle2,
  Loader2,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Button } from "@admin/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@admin/components/ui/select";
import { Label } from "@admin/components/ui/label";
import { Input } from "@admin/components/ui/input";
import { Textarea } from "@admin/components/ui/textarea";
import { Checkbox } from "@admin/components/ui/checkbox";
import { Progress } from "@admin/components/ui/progress";
// import DashboardLayout from "@admin/layout/DashboardLayout";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Layout from "@admin/layout/Layout";

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
  nearby: z.array(z.string()).optional(),
  images: z.any().optional(),
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
  amenities: z.array(z.string()).optional(),
});

const landSchema = commonSchema.extend({
  propertyType: z.enum(["land"]),
});

const schema = z.union([houseSchema, landSchema]);

// ---- Small UI helpers to keep the form readable & consistent ----

// Label with optional required marker (*) and a small grey hint line.
const FieldLabel = ({ children, required, hint }) => (
  <div className="mb-1">
    <Label className="text-sm font-medium text-gray-800">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </Label>
    {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
  </div>
);

// Inline field error message.
const FieldError = ({ error }) =>
  error ? <p className="mt-1 text-xs text-red-500">{error.message}</p> : null;

// A highlighted note / callout box for guidance.
const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
  };
  return (
    <div
      className={`flex gap-2 rounded-lg border p-3 text-sm ${tones[tone]}`}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="space-y-1">{children}</div>
    </div>
  );
};

// Helper for numeric inputs so they stay controlled and don't show NaN/0.
const numberValue = (v) => (Number.isFinite(v) ? v : "");

// Component
const AddProperty = () => {
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]); // step history for the Back button
  const [propertyIntent, setPropertyIntent] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [apiError, setApiError] = useState(null); // State for API errors
  const [submitting, setSubmitting] = useState(false); // submit loading state

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

  const navigate = useNavigate();

  // Navigation helpers that record history so the user can always go Back.
  const goTo = (next) => {
    setHistory((h) => [...h, step]);
    setStep(next);
  };
  const goBack = () => {
    setHistory((h) => {
      const copy = [...h];
      const prev = copy.pop();
      setStep(prev ?? 1);
      return copy;
    });
  };

  // Live preview of total = land area × unit price (for the details step).
  const watchedArea = watch("landArea");
  const watchedUnitPrice = watch("perUnitPrice");
  const watchedImages = watch("images");
  const livePrice =
    Number.isFinite(watchedArea) && Number.isFinite(watchedUnitPrice)
      ? watchedArea * watchedUnitPrice
      : null;
  const imageCount = watchedImages?.length || 0;

  const onSubmit = async (data) => {
    console.log("Form Data:", data); // Log form data for debugging
    // Guard the image count client-side so the user gets a clear message
    // instead of a server-side upload rejection.
    if (data.images?.length > 15) {
      setApiError("You can upload a maximum of 15 images.");
      return;
    }
    try {
      setApiError(null); // Clear previous errors
      setSubmitting(true);
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
      // if (data.video) {
      //   formData.append("video", data.video);
      // }

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

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url:
          data.propertyType === "house"
            ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/home/add-home`
            : `${import.meta.env.VITE_API_BASE_URL}/api/v1/land/add-land`,
        headers: {
          Authorization: `Bearer ${Cookies.get("accessTokenAdmin")}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        data: formData,
      };

      // Make API request
      const response = await axios.request(config);
      console.log("API Response:", JSON.stringify(response.data));
      setStep(6); // Move to success step
      setTimeout(() => {
        navigate("/dashboard/all_property"); // Redirect to My Properties after 1 second
      }, 1000);
    } catch (error) {
      console.error("API Error:", error);
      setApiError(
        error.response?.data?.message ||
          "Failed to submit property. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // If validation blocks submission, jump the user to the form so they see the errors.
  const onInvalid = () => {
    setApiError("Please fix the highlighted fields before submitting.");
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

  // Friendly label for the current selection, shown as a recap chip on later steps.
  const selectionSummary = () => {
    const parts = [];
    if (propertyIntent) parts.push(`For ${propertyIntent}`);
    if (propertyType) parts.push(propertyType === "house" ? "House/Building" : "Land Plot");
    if (propertyType === "house" && purpose)
      parts.push(purpose === "residencial" ? "Residential" : "Commercial");
    return parts;
  };

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
            <p className="text-sm text-gray-500">
              Pick how this property will be listed. You can change it by going
              back.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                variant={propertyIntent === "sale" ? "default" : "outline"}
                className="h-16 flex-1"
                onClick={() => {
                  setPropertyIntent("sale");
                  setValue("propertyIntent", "sale");
                  goTo(2);
                }}
              >
                <DollarSign className="mr-2 h-4 w-4" /> Sale
              </Button>
              <Button
                variant={propertyIntent === "rent" ? "default" : "outline"}
                className="h-16 flex-1"
                onClick={() => {
                  setPropertyIntent("rent");
                  setValue("propertyIntent", "rent");
                  setPropertyType("house");
                  setValue("propertyType", "house");
                  goTo(3);
                }}
              >
                <HomeIcon className="mr-2 h-4 w-4" /> Rent
              </Button>
              <Button
                variant={propertyIntent === "both" ? "default" : "outline"}
                className="h-16 flex-1"
                onClick={() => {
                  setPropertyIntent("both");
                  setValue("propertyIntent", "both");
                  goTo(2);
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
            <p className="text-sm text-gray-500">
              Houses ask for extra details (rooms, amenities, etc.). Land plots
              keep it short.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                variant={propertyType === "house" ? "default" : "outline"}
                className="h-16 flex-1"
                onClick={() => {
                  setPropertyType("house");
                  setValue("propertyType", "house");
                  goTo(3);
                }}
              >
                <Home className="mr-2 h-4 w-4" /> House
              </Button>
              <Button
                variant={propertyType === "land" ? "default" : "outline"}
                className="h-16 flex-1"
                onClick={() => {
                  setPropertyType("land");
                  setValue("propertyType", "land");
                  goTo(5);
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
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                variant={purpose === "residencial" ? "default" : "outline"}
                className="h-16 flex-1"
                onClick={() => {
                  setPurpose("residencial");
                  setValue("purpose", "residencial");
                  goTo(4);
                }}
              >
                <HomeIcon className="mr-2 h-4 w-4" /> Residential
              </Button>
              <Button
                variant={purpose === "commercial" ? "default" : "outline"}
                className="h-16 flex-1"
                onClick={() => {
                  setPurpose("commercial");
                  setValue("purpose", "commercial");
                  goTo(4);
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
            <NoteBox tone="blue">
              <p className="font-medium">Before you continue, keep ready:</p>
              <ul className="ml-4 list-disc">
                <li>Property name, full address, pincode, state &amp; city</li>
                <li>Land area and price</li>
                <li>Clear photos of the property (you can add several)</li>
              </ul>
            </NoteBox>
            <Button onClick={() => goTo(5)}>Proceed to Add Details</Button>
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
            <div className="space-y-2">
              <CardTitle>
                {propertyType === "house"
                  ? `Add ${purpose} House Details`
                  : "Add Land Plot Details"}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Fields marked <span className="text-red-500">*</span> are
                required.
              </p>
            </div>

            <NoteBox tone="amber">
              <p>
                Use real, accurate details — this is exactly what buyers see on
                the public site. Add good quality photos for more enquiries.
              </p>
            </NoteBox>

            {apiError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {apiError}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              className="space-y-6"
            >
              {/* ---- Basic Info ---- */}
              <div>
                <h3 className="mb-3 border-b pb-2 text-base font-semibold text-gray-900">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel required hint="Public title buyers will see">
                      Property Name
                    </FieldLabel>
                    <Controller
                      name="propertyName"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g., Sunshine Villa" />
                      )}
                    />
                    <FieldError error={errors.propertyName} />
                  </div>
                  <div>
                    <FieldLabel required hint="Short area / road name">
                      Location
                    </FieldLabel>
                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g., Near Main Road" />
                      )}
                    />
                    <FieldError error={errors.location} />
                  </div>
                  <div className="md:col-span-2">
                    <FieldLabel
                      required
                      hint="Highlight what makes this property attractive — condition, view, connectivity, etc."
                    >
                      Description
                    </FieldLabel>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="Describe the property"
                        />
                      )}
                    />
                    <FieldError error={errors.description} />
                  </div>
                </div>
              </div>

              {/* ---- Address ---- */}
              <div>
                <h3 className="mb-3 border-b pb-2 text-base font-semibold text-gray-900">
                  Address
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel required>Full Address</FieldLabel>
                    <Controller
                      name="fullAddress"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g., 123 Main St" />
                      )}
                    />
                    <FieldError error={errors.fullAddress} />
                  </div>
                  <div>
                    <FieldLabel required hint="6-digit Indian pincode">
                      Pincode
                    </FieldLabel>
                    <Controller
                      name="pincode"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          maxLength={6}
                          inputMode="numeric"
                          placeholder="e.g., 123456"
                        />
                      )}
                    />
                    <FieldError error={errors.pincode} />
                  </div>
                  <div>
                    <FieldLabel required>State</FieldLabel>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g., California" />
                      )}
                    />
                    <FieldError error={errors.state} />
                  </div>
                  <div>
                    <FieldLabel required>City</FieldLabel>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g., Los Angeles" />
                      )}
                    />
                    <FieldError error={errors.city} />
                  </div>
                  <div>
                    <FieldLabel required>Locality</FieldLabel>
                    <Controller
                      name="locality"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g., Downtown" />
                      )}
                    />
                    <FieldError error={errors.locality} />
                  </div>
                  <div>
                    <FieldLabel hint="A well-known point nearby (optional)">
                      Landmark
                    </FieldLabel>
                    <Controller
                      name="landmark"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g., Near City Mall" />
                      )}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FieldLabel hint="Paste a Google Maps link so buyers find it easily (optional)">
                      Location Link
                    </FieldLabel>
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
                    <FieldError error={errors.locationLink} />
                  </div>
                </div>
              </div>

              {/* ---- Pricing ---- */}
              <div>
                <h3 className="mb-3 border-b pb-2 text-base font-semibold text-gray-900">
                  Area &amp; Pricing
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel required hint="Total plot size in square feet">
                      Land Area (sq.ft)
                    </FieldLabel>
                    <Controller
                      name="landArea"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          value={numberValue(field.value)}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                          placeholder="e.g., 1000"
                        />
                      )}
                    />
                    <FieldError error={errors.landArea} />
                  </div>
                  <div>
                    <FieldLabel
                      required
                      hint={
                        propertyType === "house"
                          ? "Price per sq.ft"
                          : "Price per sq.ft of the plot"
                      }
                    >
                      {propertyType === "house"
                        ? "Total Price"
                        : "Per Unit Price"}
                    </FieldLabel>
                    <Controller
                      name="perUnitPrice"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          value={numberValue(field.value)}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                          placeholder="e.g., 5000"
                        />
                      )}
                    />
                    <FieldError error={errors.perUnitPrice} />
                  </div>
                </div>
                {livePrice !== null && (
                  <p className="mt-2 text-sm text-gray-600">
                    Estimated total{" "}
                    <span className="font-semibold text-gray-900">
                      (area × price): ₹{livePrice.toLocaleString("en-IN")}
                    </span>
                  </p>
                )}
              </div>

              {/* ---- Nearby ---- */}
              <div>
                <h3 className="mb-1 text-base font-semibold text-gray-900">
                  What is Nearby?
                </h3>
                <p className="mb-3 text-xs text-gray-500">
                  Tick everything within easy reach — it helps the listing rank
                  with buyers.
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {nearbyOptions.map((option) => (
                    <Controller
                      key={option}
                      name="nearby"
                      control={control}
                      render={({ field }) => (
                        <label className="flex cursor-pointer items-center space-x-2 rounded-md border p-2 hover:bg-gray-50">
                          <Checkbox
                            checked={field.value?.includes(option)}
                            onCheckedChange={(checked) => {
                              const updated = checked
                                ? [...(field.value || []), option]
                                : field.value.filter((v) => v !== option);
                              field.onChange(updated);
                            }}
                          />
                          <span className="text-sm">{option}</span>
                        </label>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* ---- House-Specific Fields ---- */}
              {propertyType === "house" && (
                <div>
                  <h3 className="mb-3 border-b pb-2 text-base font-semibold text-gray-900">
                    House Details
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <FieldLabel required hint="Total number of rooms">
                        Rooms
                      </FieldLabel>
                      <Controller
                        name="rooms"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            value={numberValue(field.value)}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                            placeholder="e.g., 4"
                          />
                        )}
                      />
                      <FieldError error={errors.rooms} />
                    </div>
                    <div>
                      <FieldLabel required>Bedrooms</FieldLabel>
                      <Controller
                        name="bedrooms"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            value={numberValue(field.value)}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                            placeholder="e.g., 3"
                          />
                        )}
                      />
                      <FieldError error={errors.bedrooms} />
                    </div>
                    <div>
                      <FieldLabel required>Kitchen</FieldLabel>
                      <Controller
                        name="kitchen"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            value={numberValue(field.value)}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                            placeholder="e.g., 1"
                          />
                        )}
                      />
                      <FieldError error={errors.kitchen} />
                    </div>
                    <div>
                      <FieldLabel required>Floors</FieldLabel>
                      <Controller
                        name="floors"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            value={numberValue(field.value)}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                            placeholder="e.g., 2"
                          />
                        )}
                      />
                      <FieldError error={errors.floors} />
                    </div>
                    <div>
                      <FieldLabel required>Bathrooms</FieldLabel>
                      <Controller
                        name="bathrooms"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            value={numberValue(field.value)}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                            placeholder="e.g., 2"
                          />
                        )}
                      />
                      <FieldError error={errors.bathrooms} />
                    </div>
                    <div>
                      <FieldLabel required hint="Built-up usable area">
                        Carpet Area (sq.ft)
                      </FieldLabel>
                      <Controller
                        name="areas"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            value={numberValue(field.value)}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                            placeholder="e.g., 1200"
                          />
                        )}
                      />
                      <FieldError error={errors.areas} />
                    </div>
                    <div>
                      <FieldLabel hint="Enter 0 if none">
                        Parking Slots
                      </FieldLabel>
                      <Controller
                        name="parking"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            value={numberValue(field.value)}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                            placeholder="e.g., 1"
                          />
                        )}
                      />
                      <FieldError error={errors.parking} />
                    </div>
                    <div>
                      <FieldLabel required hint="Year of construction">
                        Build Year
                      </FieldLabel>
                      <Controller
                        name="buildYear"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            value={numberValue(field.value)}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                            placeholder="e.g., 2020"
                          />
                        )}
                      />
                      <FieldError error={errors.buildYear} />
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="mb-1 text-sm font-semibold text-gray-900">
                        Amenities
                      </h4>
                      <p className="mb-3 text-xs text-gray-500">
                        Select all facilities available at the property.
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {amenitiesOptions.map((option) => (
                          <Controller
                            key={option}
                            name="amenities"
                            control={control}
                            render={({ field }) => (
                              <label className="flex cursor-pointer items-center space-x-2 rounded-md border p-2 hover:bg-gray-50">
                                <Checkbox
                                  checked={field.value?.includes(option)}
                                  onCheckedChange={(checked) => {
                                    const updated = checked
                                      ? [...(field.value || []), option]
                                      : field.value.filter((v) => v !== option);
                                    field.onChange(updated);
                                  }}
                                />
                                <span className="text-sm">{option}</span>
                              </label>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---- File Uploads ---- */}
              <div>
                <h3 className="mb-3 border-b pb-2 text-base font-semibold text-gray-900">
                  Photos
                </h3>
                <div>
                  <FieldLabel hint="Upload up to 15 clear photos (JPG/PNG). The first one is used as the cover.">
                    Images
                  </FieldLabel>
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
                  {imageCount > 0 && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      {imageCount} {imageCount === 1 ? "image" : "images"}{" "}
                      selected
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={submitting || history.length === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" /> Submit Property
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        );
      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="space-y-4 text-center"
          >
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
            <CardTitle>Property Added Successfully!</CardTitle>
            <p className="text-gray-600">
              Your property has been submitted. Redirecting to All Properties…
            </p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4">
        <Card className="w-full max-w-7xl">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Add a New Property</CardTitle>
              {/* Global Back button (hidden on success step) */}
              {step !== 6 && history.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  disabled={submitting}
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </Button>
              )}
            </div>

            {/* Selection recap chips */}
            {selectionSummary().length > 0 && step !== 6 && (
              <div className="flex flex-wrap gap-2">
                {selectionSummary().map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-1">
              <Progress value={(step / 6) * 100} className="w-full" />
              <p className="text-right text-xs text-gray-500">
                Step {step} of 6
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AddProperty;
