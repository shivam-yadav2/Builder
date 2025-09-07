const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const { asyncHandler } = require("../utils/asyncHandler.utils.js");
const Property = require("../models/property.model.js");

const createProperty = asyncHandler(async (req, res) => {
  const { title, location, price, soldDate } = req.body;
  const files = req.files?.images || [];

  if ([title, location, price, soldDate].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const imageUrls = req.files.images.map((file) =>
    file.path?.replace("public\\", "")?.replace(/\\/g, "/").replace("public/", "")
  );


  if (!imageUrls) {
    throw new ApiError(400, "Please upload an image");
  }

  const property = await Property.create({
    title,
    location,
    price,
    soldDate,
    images: imageUrls,
    
  });

  if (!property) {
    throw new ApiError(500, "Property not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, property, "Property created successfully"));
});

const getAllProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ isDeleted: false })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, properties, "Properties fetched successfully"));
});

const getPropertyById = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new ApiError(400, "Property ID is required");
  }

  const property = await Property.findById(id)
    .populate({
      path: "creator",
      select: "email",
    })
    .lean();

  if (!property || property.isDeleted) {
    throw new ApiError(404, "Property not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, property, "Property fetched successfully"));
});

const updateProperty = asyncHandler(async (req, res) => {
  const { id, title, location, price, soldDate } = req.body;
  const files = req.files?.images || [];

  if (!id) {
    throw new ApiError(400, "Property ID is required");
  }

  const property = await Property.findById(id);
  if (!property || property.isDeleted) {
    throw new ApiError(404, "Property not found");
  }

  const imageUrls =
    files.length > 0 ? files.map((file) => file.path) : property.images;

  property.title = title || property.title;
  property.location = location || property.location;
  property.price = price || property.price;
  property.soldDate = soldDate || property.soldDate;
  property.images = imageUrls;

  await property.save();

  return res
    .status(200)
    .json(new ApiResponse(200, property, "Property updated successfully"));
});

const deleteProperty = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new ApiError(400, "Property ID is required");
  }

  const property = await Property.findById(id);
  if (!property || property.isDeleted) {
    throw new ApiError(404, "Property not found");
  }

  property.isDeleted = true;
  await property.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Property deleted successfully"));
});

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
