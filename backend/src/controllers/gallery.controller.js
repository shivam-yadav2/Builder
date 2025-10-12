const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const { asyncHandler } = require("../utils/asyncHandler.utils.js");
const Gallery = require("../models/gallery.model.js");

const createGallery = asyncHandler(async (req, res) => {
  const { name, location, sold_price, sold_date, tags } = req.body;
  const files = req.files?.images || [];

  if ([name, location, sold_price, sold_date].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const imageUrls = files.map((file) =>
    file.path?.replace("public\\", "")?.replace(/\\/g, "/").replace("public/", "")
  );

  if (imageUrls.length === 0) {
    throw new ApiError(400, "Please upload at least one image");
  }

  // Parse tags if they are sent as a string
  let parsedTags = [];
  if (tags) {
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }
  }

  const gallery = await Gallery.create({
    name,
    location,
    sold_price,
    sold_date,
    images: imageUrls,
    tags: parsedTags,
  });

  if (!gallery) {
    throw new ApiError(500, "Gallery item not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, gallery, "Gallery item created successfully"));
});

const getAllGallery = asyncHandler(async (req, res) => {
  const gallery = await Gallery.find({ isDeleted: false })
    .sort({ sold_date: -1 }) // Sort by sold_date descending (newest first)
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, gallery, "Gallery items fetched successfully"));
});

const getGalleryById = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new ApiError(400, "Gallery ID is required");
  }

  const gallery = await Gallery.findById(id).lean();

  if (!gallery || gallery.isDeleted) {
    throw new ApiError(404, "Gallery item not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, gallery, "Gallery item fetched successfully"));
});

const updateGallery = asyncHandler(async (req, res) => {
  const { id, name, location, sold_price, sold_date, tags } = req.body;
  const files = req.files?.images || [];

  if (!id) {
    throw new ApiError(400, "Gallery ID is required");
  }

  const gallery = await Gallery.findById(id);
  if (!gallery || gallery.isDeleted) {
    throw new ApiError(404, "Gallery item not found");
  }

  const imageUrls =
    files.length > 0 ? files.map((file) => 
      file.path?.replace("public\\", "")?.replace(/\\/g, "/").replace("public/", "")
    ) : gallery.images;

  // Parse tags if they are sent as a string
  let parsedTags = gallery.tags;
  if (tags !== undefined) {
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }
  }

  gallery.name = name || gallery.name;
  gallery.location = location || gallery.location;
  gallery.sold_price = sold_price || gallery.sold_price;
  gallery.sold_date = sold_date || gallery.sold_date;
  gallery.images = imageUrls;
  gallery.tags = parsedTags;

  await gallery.save();

  return res
    .status(200)
    .json(new ApiResponse(200, gallery, "Gallery item updated successfully"));
});

const deleteGallery = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new ApiError(400, "Gallery ID is required");
  }

  const gallery = await Gallery.findById(id);
  if (!gallery || gallery.isDeleted) {
    throw new ApiError(404, "Gallery item not found");
  }

  gallery.isDeleted = true;
  await gallery.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Gallery item deleted successfully"));
});

module.exports = {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGallery,
  deleteGallery,
};
