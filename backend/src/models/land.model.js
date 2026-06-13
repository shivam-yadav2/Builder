const mongoose = require("mongoose");

const LandSchema = new mongoose.Schema(
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
    unitPrice: { type: Number, required: true, min: [0, "Price cannot be negative"] },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Available", "Sold", "Pending"],
      default: "Available",
    },
    propertyType: { type: String, default: "sale" },
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Land", LandSchema);
