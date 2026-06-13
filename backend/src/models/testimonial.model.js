const mongoose = require("mongoose");
const { Schema } = mongoose;

const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "Customer" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    text: { type: String, required: true },
    avatar: { type: String }, // optional image path
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", TestimonialSchema);
