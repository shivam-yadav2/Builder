const mongoose = require("mongoose");

const HomeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    fullAddress: { type: String, required: true },
    pincode: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    locality: { type: String, required: true },
    landmark: { type: String },
    landArea: { type: Number, required: true, min: [0, "Land area cannot be negative"] },
    images: [{ type: String, required: true }],
    nearby: [{ type: String }],
    amenities: [{ type: String }],
    unitPrice: { type: Number, required: true, min: [0, "Price cannot be negative"] },
    totalPrice: { type: Number, required: true, min: [0, "Price cannot be negative"] },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Available", "Sold", "Pending"],
      default: "Available",
    },
    propertyType: { type: String, default: "sale" },
    rooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    kitchen: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    floor: { type: Number, required: true },
    park: { type: Boolean, default: false },
    buildYear: { type: Number, required: true },
    isDelete: { type: Boolean, default: false },
    propertyFor: {
      type: String,
      enum: ["residencial", "commercial"],
      default: "residencial",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Home", HomeSchema);
