const Home = require("../models/home.model.js");
const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const { asyncHandler } = require("../utils/asyncHandler.utils.js");

const cleanImagePath = (filePath) =>
  filePath.replace(/^public[\\/]/, "").replace(/\\/g, "/");

// Normalises the `keepImages` field (existing image paths the client wants to
// retain on update) into a clean array, whatever shape it arrives in.
const parseKeepImages = (keepImages) => {
  if (!keepImages) return [];
  if (Array.isArray(keepImages)) return keepImages.filter(Boolean);
  if (typeof keepImages === "string") {
    const trimmed = keepImages.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      // not JSON — fall back to comma separated
    }
    return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

exports.createHome = asyncHandler(async (req, res) => {
  const {
    title,
    location,
    description,
    fullAddress,
    pincode,
    state,
    nearby,
    amenities,
    city,
    locality,
    landmark,
    landArea,
    unitPrice,
    totalPrice,
    status,
    propertyType,
    rooms,
    bedrooms,
    kitchen,
    bathrooms,
    floor,
    park,
    propertyFor,
    buildYear,
  } = req.body;

  if (
    !title ||
    !location ||
    !fullAddress ||
    !pincode ||
    !state ||
    !city ||
    !locality ||
    !landArea ||
    !unitPrice ||
    !totalPrice ||
    !rooms ||
    !bedrooms ||
    !kitchen ||
    !bathrooms ||
    !floor ||
    !buildYear
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  if (!req.files || !req.files.images || req.files.images.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  const existingHome = await Home.findOne({ title, fullAddress });
  if (existingHome) {
    throw new ApiError(
      400,
      "Home listing with this title and address already exists"
    );
  }

  const images = req.files.images.map((file) => cleanImagePath(file.path));

  const home = await Home.create({
    title,
    location,
    description,
    fullAddress,
    pincode,
    state,
    city,
    locality,
    landmark,
    landArea,
    images,
    unitPrice,
    totalPrice,
    status: status || "Available",
    propertyType: propertyType || "sale",
    rooms,
    bedrooms,
    kitchen,
    bathrooms,
    floor,
    park,
    amenities,
    nearby,
    buildYear,
    propertyFor,
  });

  res
    .status(201)
    .json(new ApiResponse(201, home, "Home Listing Created Successfully"));
});

exports.getAllHomes = asyncHandler(async (req, res) => {
  const homes = await Home.find({ isDelete: false })
    .sort({ createdAt: -1 })
    .lean();
  const result = homes.map((h) => ({ ...h, type: "Home" }));
  res
    .status(200)
    .json(new ApiResponse(200, result, "Home Listings Fetched Successfully"));
});

exports.getHomeById = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const home = await Home.findById(id).lean();
  if (!home || home.isDelete) {
    throw new ApiError(404, "Home Listing Not Found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, home, "Home Listing Fetched Successfully"));
});

exports.updateHome = asyncHandler(async (req, res) => {
  const { id, keepImages, ...updateData } = req.body;

  const home = await Home.findById(id);
  if (!home || home.isDelete) {
    throw new ApiError(404, "Home Listing Not Found");
  }

  // Merge retained existing images with any newly uploaded ones, so editing a
  // listing no longer wipes its previous photos.
  const newImages =
    req.files?.images?.map((file) => cleanImagePath(file.path)) || [];
  if (keepImages !== undefined || newImages.length > 0) {
    const kept = parseKeepImages(keepImages);
    const merged = [...kept, ...newImages];
    if (merged.length === 0) {
      throw new ApiError(400, "A listing must have at least one image");
    }
    updateData.images = merged;
  }

  const updatedHome = await Home.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!updatedHome) {
    throw new ApiError(404, "Home Listing Not Found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedHome, "Home Listing Updated Successfully")
    );
});

exports.deleteHome = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const home = await Home.findById(id);

  if (!home || home.isDelete) {
    throw new ApiError(404, "Home Listing Not Found");
  }

  await Home.findByIdAndUpdate(id, { isDelete: true }, { new: true });
  res
    .status(200)
    .json(new ApiResponse(200, null, "Home Listing Deleted Successfully"));
});

exports.getHomesByStatus = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const validStatuses = ["Available", "Sold", "Pending"];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const homes = await Home.find({ status, isDelete: false }).lean();
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        homes,
        `Home Listings with ${status} Status Fetched Successfully`
      )
    );
});
