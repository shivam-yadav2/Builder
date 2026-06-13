const { ApiError } = require("../utils/ApiError.utils.js");
const Land = require("../models/land.model.js");
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

const createLand = asyncHandler(async (req, res) => {
  const {
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
    unitPrice,
    status,
    propertyType,
    nearby,
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
    !unitPrice
  ) {
    throw new ApiError(
      400,
      "Title, location, fullAddress, pincode, state, city, locality, landArea, and unitPrice are required"
    );
  }

  if (!req.files || !req.files.images || req.files.images.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  const existingLand = await Land.findOne({ title, fullAddress });
  if (existingLand) {
    throw new ApiError(
      400,
      "Land listing with this title and address already exists"
    );
  }

  const images = req.files.images.map((file) => cleanImagePath(file.path));

  const land = await Land.create({
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
    nearby,
    status: status || "Available",
    propertyType: propertyType || "sale",
  });

  res
    .status(201)
    .json(new ApiResponse(201, land, "Land Listing Created Successfully"));
});

const getAllLands = asyncHandler(async (req, res) => {
  const lands = await Land.find({ isDelete: false })
    .sort({ createdAt: -1 })
    .lean();
  const result = lands.map((l) => ({ ...l, type: "Land" }));
  res
    .status(200)
    .json(new ApiResponse(200, result, "Land Listings Fetched Successfully"));
});

const getLandById = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const land = await Land.findById(id).lean();
  if (!land || land.isDelete) {
    throw new ApiError(404, "Land Listing Not Found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, land, "Land Listing Fetched Successfully"));
});

const updateLand = asyncHandler(async (req, res) => {
  const { id, keepImages, ...updateData } = req.body;

  const land = await Land.findById(id);
  if (!land || land.isDelete) {
    throw new ApiError(404, "Land Listing Not Found");
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

  const updatedLand = await Land.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedLand) {
    throw new ApiError(404, "Land Listing Not Found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedLand, "Land Listing Updated Successfully")
    );
});

const deleteLand = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const land = await Land.findById(id);

  if (!land || land.isDelete) {
    throw new ApiError(404, "Land Listing Not Found");
  }

  await Land.findByIdAndUpdate(id, { isDelete: true }, { new: true });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Land Listing Deleted Successfully"));
});

const getLandsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const validStatuses = ["Available", "Sold", "Pending"];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const lands = await Land.find({
    status,
    isDelete: false,
  }).lean();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        lands,
        `Land Listings with ${status} Status Fetched Successfully`
      )
    );
});

module.exports = {
  createLand,
  getAllLands,
  getLandById,
  updateLand,
  deleteLand,
  getLandsByStatus,
};
