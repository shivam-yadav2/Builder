const mongoose = require("mongoose");
const { Schema } = mongoose;

const GallerySchema = new Schema(
  {
    // "sold" = sold-property showcase, "construction" = completed construction projects
    category: {
      type: String,
      enum: ["sold", "construction"],
      default: "sold",
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],

    // Sold-property fields
    sold_price: {
      type: String,
    },
    sold_date: {
      type: Date,
    },

    // Construction-project fields
    project_type: {
      type: String, // e.g. Residential / Commercial / Villa
    },
    area: {
      type: String, // e.g. "2400 sq.ft"
    },
    completed_date: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema);
