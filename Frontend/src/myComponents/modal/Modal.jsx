import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const Modal = ({
  type,
  open,
  onOpenChange,
  formData,
  onInputChange,
  onSubmit,
}) => {
  

  const inputClass =
    "w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500";

  const renderFormFields = () => {
    switch (type?.toLowerCase()) {
      case "for rent":
        return (
          <>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="type">Type</Label>
              <Select
                onValueChange={(value) =>
                  onInputChange({ target: { name: "type", value } })
                }
                value={formData?.type}
              >
                <SelectTrigger className={`${inputClass} cursor-pointer`}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                onValueChange={(value) =>
                  onInputChange({ target: { name: "propertyType", value } })
                }
                value={formData?.propertyType}
              >
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent className="cursor-pointer">
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData?.location}
                onChange={onInputChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                name="budget"
                value={formData?.budget}
                onChange={onInputChange}
                className={`${inputClass} no-spinner`}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                value={formData?.name}
                onChange={onInputChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="number">Contact Number</Label>
              <Input
                id="number"
                type="number"
                name="number"
                value={formData?.number}
                onChange={onInputChange}
                className={`${inputClass} no-spinner`}
              />
            </div>
          </>
        );

      case "for buy":
        return (
          <>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="type">Type</Label>
              <Select
                onValueChange={(value) =>
                  onInputChange({ target: { name: "type", value } })
                }
                value={formData?.type}
              >
                <SelectTrigger className={`${inputClass} cursor-pointer`}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData?.location}
                onChange={onInputChange}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input
                id="area"
                type="number"
                name="area"
                value={formData?.area}
                onChange={onInputChange}
                className={`${inputClass} no-spinner`}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                name="budget"
                value={formData?.budget}
                onChange={onInputChange}
                className={`${inputClass} no-spinner`}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                value={formData?.name}
                onChange={onInputChange}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="number">Contact Number</Label>
              <Input
                id="number"
                type="number"
                name="number"
                value={formData?.number}
                onChange={onInputChange}
                className={`${inputClass} no-spinner`}
              />
            </div>
          </>
        );

      case "for construction":
        return (
          <>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="plotArea">Plot Area (sq ft)</Label>
              <Input
                id="plotArea"
                name="plotArea"
                value={formData?.plotArea}
                onChange={onInputChange}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="constructionArea">
                Construction Area (sq ft)
              </Label>
              <Input
                id="constructionArea"
                type="number"
                name="constructionArea"
                value={formData?.constructionArea}
                onChange={onInputChange}
                className={`${inputClass} no-spinner`}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                name="budget"
                value={formData?.budget}
                onChange={onInputChange}
                className={`${inputClass} no-spinner`}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData?.location}
                onChange={onInputChange}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                value={formData?.name}
                onChange={onInputChange}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="number">Contact Number</Label>
              <Input
                className={`${inputClass} no-spinner`}
                id="number"
                type="number"
                name="number"
                value={formData?.number}
                onChange={onInputChange}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-xl p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{type}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Use the fields below to filter and find properties that meet your
            needs.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {renderFormFields()}
        </div>

        <DialogFooter className="flex justify-end">
          <Button
            type="submit"
            onClick={onSubmit}
            className="px-6 bg-blue-500 hover:bg-blue-700 cursor-pointer text-white py-2"
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
