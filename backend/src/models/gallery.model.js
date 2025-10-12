const mongoose = require("mongoose");
const { Schema } = mongoose;

const GallerySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    sold_price: {
      type: String,
      required: true,
    },
    sold_date: {
      type: Date,
      required: true,
    },
    images: [{
      type: String,
      required: true,
    }],
    tags: [{
      type: String,
    }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema);
