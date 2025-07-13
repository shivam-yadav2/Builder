const { ApiError } = require("../utils/ApiError.utils.js");
const Land = require("../models/land.model.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const { asyncHandler } = require("../utils/asyncHandler.utils.js");

// Create a new land listing with image upload
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
    creator,
    creatorType,
    nearby,
} = req.body;

// Check for required fields
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
  !creator ||
  !creatorType ||
  !nearby
) {
  throw new ApiError(
    400,
    "Title, location, fullAddress, pincode, state, city, locality, landArea, and unitPrice are required"
  );
}

// Check if images were uploaded
if (!req.files || req.files.length === 0) {
  throw new ApiError(400, "At least one image is required");
}

const existingLand = await Land.findOne({ title, fullAddress });
if (existingLand) {
  throw new ApiError(
    400,
    "Land listing with this title and address already exists"
  );
}

// Extract image paths from Multer
const images = req.files.images.map((file) =>
  file.path?.replace("public\\", "")?.replace(/\\/g, "/")
);

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
  creator,
  creatorType,
  nearby,
  status: status || "Available",
  propertyType: propertyType || "sale",
});

res
  .status(201)
  .json(new ApiResponse(201, land, "Land Listing Created Successfully"));
});

// Get all land listings
const getAllLands = asyncHandler(async (req, res) => {
  // Fetch lands with creatorType: "User" and populate creator
  const userLands = await Land.find({ creatorType: "User" })
    .populate({
      path: "creator",
      model: "User", // Specify the User model
      select: "name email phone avatar",
    })
    .lean(); // Convert to plain JavaScript objects for easier merging

  // Fetch lands with creatorType: "Admin" and populate creator
  const adminLands = await Land.find({ creatorType: "Admin" })
    .populate({
      path: "creator",
      model: "Admin", // Specify the Admin model
    })
    .lean();

  // Combine the results
  // Combine the results and add static type field
  const lands = [...userLands, ...adminLands].map((land) => ({
    ...land,
    type: "Land",
  }));

  res
    .status(200)
    .json(new ApiResponse(200, lands, "Land Listings Fetched Successfully"));
});

const getAllLandsForUser = asyncHandler(async (req, res) => {
  const userLands = await Land.find({ creatorType: "User", isDelete: false })
    .populate({
      path: "creator",
      model: "User", // Specify the User model
      select: "name email phone", // Specify fields to include from User model
    })
    .lean();

  // Fetch lands with creatorType: "Admin" and populate creator with specific fields
  const adminLands = await Land.find({ creatorType: "Admin", isDelete: false })
    .populate({
      path: "creator",
      model: "Admin", // Specify the Admin model
    })
    .lean();

  const type = "Land"

  // Combine the results
  // const lands = [...userLands, ...adminLands, type];
  // Combine the results and add static type field
  const lands = [...userLands, ...adminLands].map((land) => ({
    ...land,
    type: "Land",
  }));
  res
    .status(200)
    .json(new ApiResponse(200, lands, "User Properties Fetched Successfully"));
});

const updateLandApprovalStatus = asyncHandler(async (req, res) => {

  const { status, message, id } = req.body;

  // Validate status
  const validStatuses = ["approved", "denied"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status. Must be 'approved' or 'denied'");
  }

  const user = await Land.findById(id);
  if (!user) {
    throw new ApiError(404, "Land not found");
  }

  user.approvalStatus = status;
  user.adminMessage = message || "";

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, `Land ${status} successfully.`));
});

// Get a single land listing by ID
const getLandById = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Fetch the land by ID
  let land = await Land.findById(id);

  if (!land) {
    throw new ApiError(404, "Land Listing Not Found");
  }

  // Populate creator based on creatorType
  if (land.creatorType === "User") {
    land = await Land.findById(id)
      .populate({
        path: "creator",
        model: "User",
        select: "name email phone avatar", // Select specific fields from User model
      })
      .lean();
  } else if (land.creatorType === "Admin") {
    land = await Land.findById(id)
      .populate({
        path: "creator",
        model: "Admin",
      })
      .lean();
  }

  res
    .status(200)
    .json(new ApiResponse(200, land, "Land Listing Fetched Successfully"));
});

// Update a land listing with optional image upload
const updateLand = asyncHandler(async (req, res) => {
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
    id,
  } = req.body;

  // Find the existing land listing
  const land = await Land.findById(id);
  if (!land || land.isDelete) {
    throw new ApiError(404, "Land Listing Not Found");
  }

  // If new images are uploaded, update the images array
  //   let images = land.images; // Keep existing images by default
  //   if (req.files && req.files.length > 0) {
  //     images = req.files.map((file) => file.path); // Replace with new images
  //   }

  const updatedLand = await Land.findByIdAndUpdate(
    id,
    {
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
      status,
      propertyType,
    },
    { new: true, runValidators: true }
  );

  if (!updatedLand) {
    throw new ApiError(404, "Land Listing Not Found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedLand, "Land Listing Updated Successfully")
    );
});

// Soft delete a land listing
const deleteLand = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const land = await Land.findById(id);

  if (!land || land.isDelete) {
    throw new ApiError(404, "Land Listing Not Found");
  }

  const deletedLand = await Land.findByIdAndUpdate(
    id,
    { isDelete: true },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, null, "Land Listing Deleted Successfully"));
});

// Get all land listings by status
const getLandsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const validStatuses = ["Available", "Sold", "Pending"];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const lands = await Land.find({
    status,
    isDelete: false,
  }).populate("createdBy", "username email");

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
  getAllLandsForUser,
  updateLandApprovalStatus
};
