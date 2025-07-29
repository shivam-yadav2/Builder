const mongoose = require("mongoose");

const LandSchema = new mongoose.Schema({
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
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  nearby: [{
    type: String,
    required: true
  }],
  unitPrice: {
    type: String,
    required: true
  },
  status: { type: String, enum: ["Available", "Sold", "Pending"], default: "Available" },
  propertyType: { type: String, default: "sale" },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  creatorType: {
    type: String,
    required: true,
    enum: ["User", "Admin"] // Possible models this can reference
  },

  isDelete: { type: Boolean, default: false },
  // Admin approval fields
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'approved'
  },
  adminMessage: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model("Land", LandSchema);