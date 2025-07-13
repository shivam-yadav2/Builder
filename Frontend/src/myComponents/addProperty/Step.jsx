// components/steps/Step1.jsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
// components/steps/Step2.jsx
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const Step1 = ({ register, control, watch, formData }) => {
  const purpose = watch("purpose", formData.purpose);
  const type = watch("type", formData.type);

  return (
    <div className="space-y-6">
      <div>
        <Label className="block text-sm font-medium mb-2">
          Property Purpose
        </Label>
        <Select
          {...register("purpose", { required: "Purpose is required" })}
          defaultValue={formData.purpose}
          onValueChange={(value) => (control._formValues.purpose = value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sale">Sale</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {purpose && (
        <div>
          <Label className="block text-sm font-medium mb-2">
            Property Type
          </Label>
          <Select
            {...register("type", { required: "Type is required" })}
            defaultValue={formData.type}
            onValueChange={(value) => (control._formValues.type = value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              {purpose === "sale" && (
                <SelectItem value="land">Land Plot</SelectItem>
              )}
            </SelectContent>
          </Select>
          {(purpose === "rent" || purpose === "both") && (
            <p className="text-sm text-gray-500 mt-1">
              Only House is available for Rent or Both.
            </p>
          )}
        </div>
      )}

      {type === "house" && (
        <div>
          <Label className="block text-sm font-medium mb-2">House Usage</Label>
          <Select
            {...register("usage", { required: "Usage is required" })}
            defaultValue={formData.usage}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select usage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

const Step2 = ({ register, formData }) => {
  const isHouse = formData.type === "house";

  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-6">
      {/* Common Fields */}
      <div>
        <Label className="block text-sm font-medium mb-2">Property Name</Label>
        <Input
          {...register("name", { required: "Name is required" })}
          placeholder="Property Name"
        />
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2">Location</Label>
        <Input {...register("location")} placeholder="Location" />
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2">Description</Label>
        <Input {...register("description")} placeholder="Description" />
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2">Full Address</Label>
        <Input
          {...register("address", { required: "Address is required" })}
          placeholder="Full Address"
        />
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2">Pincode</Label>
        <Input
          {...register("pincode", { required: "Pincode is required" })}
          placeholder="Pincode"
        />
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2">State</Label>
        <Input
          {...register("state", { required: "State is required" })}
          placeholder="State"
        />
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2">City</Label>
        <Input
          {...register("city", { required: "City is required" })}
          placeholder="City"
        />
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2">Locality</Label>
        <Input {...register("locality")} placeholder="Locality" />
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2">Landmark</Label>
        <Input {...register("landmark")} placeholder="Landmark" />
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2">Location Link</Label>
        <Input {...register("locationLink")} placeholder="Location Link" />
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2">Land Area</Label>
        <Input
          {...register("landArea", { required: "Land Area is required" })}
          type="number"
          placeholder="Land Area"
        />
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2">Per Unit Price</Label>
        <Input
          {...register("price", { required: "Price is required" })}
          type="number"
          placeholder="Per Unit Price"
        />
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2">What’s Nearby</Label>
        <div className="space-y-2">
          {["Police Station", "School", "Hospital", "Grocery Market"].map(
            (item) => (
              <label key={item} className="flex items-center">
                <Checkbox {...register(`nearby.${item}`)} />
                <span className="ml-2">{item}</span>
              </label>
            )
          )}
        </div>
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2">Images</Label>
        <Input {...register("images")} type="file" multiple />
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2">Video</Label>
        <Input {...register("video")} type="file" />
      </div>

      {/* House-Specific Fields */}
      {isHouse && (
        <>
          <div>
            <Label className="block text-sm font-medium mb-2">Rooms</Label>
            <Input {...register("rooms")} type="number" placeholder="Rooms" />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2">Bedrooms</Label>
            <Input
              {...register("bedrooms")}
              type="number"
              placeholder="Bedrooms"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2">Kitchen</Label>
            <Input
              {...register("kitchen")}
              type="number"
              placeholder="Kitchen"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2">Floors</Label>
            <Input {...register("floors")} type="number" placeholder="Floors" />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2">Bathrooms</Label>
            <Input
              {...register("bathrooms")}
              type="number"
              placeholder="Bathrooms"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2">Areas</Label>
            <Input {...register("areas")} placeholder="Areas" />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2">Park</Label>
            <Checkbox {...register("park")} />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2">Build Year</Label>
            <Input
              {...register("buildYear")}
              type="number"
              placeholder="Build Year"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2">Amenities</Label>
            <div className="space-y-2">
              {["Pool", "Gym", "Garden", "Security"].map((item) => (
                <label key={item} className="flex items-center">
                  <Checkbox {...register(`amenities.${item}`)} />
                  <span className="ml-2">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { Step1, Step2 };
