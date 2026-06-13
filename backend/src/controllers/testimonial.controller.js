const Testimonial = require("../models/testimonial.model.js");
const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const { asyncHandler } = require("../utils/asyncHandler.utils.js");

const cleanImagePath = (filePath) =>
  filePath?.replace(/^public[\\/]/, "").replace(/\\/g, "/");

const createTestimonial = asyncHandler(async (req, res) => {
  const { name, role, rating, text } = req.body;
  const avatarFile = req.files?.avatar?.[0] || req.files?.images?.[0];

  if (!name || !text) {
    throw new ApiError(400, "Name and testimonial text are required");
  }

  const testimonial = await Testimonial.create({
    name,
    role: role || "Customer",
    rating: rating ? Number(rating) : 5,
    text,
    avatar: avatarFile ? cleanImagePath(avatarFile.path) : undefined,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, testimonial, "Testimonial created successfully"));
});

const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .lean();
  return res
    .status(200)
    .json(new ApiResponse(200, testimonials, "Testimonials fetched successfully"));
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const { id, name, role, rating, text } = req.body;
  const avatarFile = req.files?.avatar?.[0] || req.files?.images?.[0];

  if (!id) throw new ApiError(400, "Testimonial ID is required");

  const testimonial = await Testimonial.findById(id);
  if (!testimonial || testimonial.isDeleted) {
    throw new ApiError(404, "Testimonial not found");
  }

  if (name !== undefined) testimonial.name = name;
  if (role !== undefined) testimonial.role = role;
  if (rating !== undefined) testimonial.rating = Number(rating);
  if (text !== undefined) testimonial.text = text;
  if (avatarFile) testimonial.avatar = cleanImagePath(avatarFile.path);

  await testimonial.save();

  return res
    .status(200)
    .json(new ApiResponse(200, testimonial, "Testimonial updated successfully"));
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) throw new ApiError(400, "Testimonial ID is required");

  const testimonial = await Testimonial.findById(id);
  if (!testimonial || testimonial.isDeleted) {
    throw new ApiError(404, "Testimonial not found");
  }

  testimonial.isDeleted = true;
  await testimonial.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Testimonial deleted successfully"));
});

module.exports = {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
};
