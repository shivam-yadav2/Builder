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
    landArea: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    nearby: [
      {
        type: String,
        required: true,
      },
    ],
    amenities: [
      {
        type: String,
        required: true,
      },
    ],
    unitPrice: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Sold", "Pending"],
      default: "Available",
    },
    propertyType: { type: String, enum: ["rent", "sale"], default: "sale" },
    rooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    kitchen: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    floor: { type: Number, required: true },
    park: { type: Boolean, default: false },
    buildYear: { type: Number, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    creatorType: {
      type: String,
      required: true,
      enum: ["User", "Admin"], // Possible models this can reference
    },
    isDelete: { type: Boolean, default: false },
    // Admin approval fields
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
    adminMessage: {
      type: String,
      default: "",
    },
    propertyFor: {
      type: String,
      enum: ["residencial", "commercial"],
      default: "residencial",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Home", HomeSchema);
