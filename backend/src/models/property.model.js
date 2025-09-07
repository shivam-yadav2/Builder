const mongoose = require("mongoose");
const { Schema } = mongoose;

const PropertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    soldDate: {
      type: Date,
      required: true,
    },
    images: [{
      type: String,
      required: true,
    }],
    
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", PropertySchema);