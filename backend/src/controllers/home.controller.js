const Home = require("../models/home.model.js");
const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const { asyncHandler } = require("../utils/asyncHandler.utils.js");

// Create a new home
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
    creator,
    creatorType,
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
    !buildYear ||
    !amenities ||
    !nearby
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  const existingHome = await Home.findOne({ title, fullAddress });
  if (existingHome) {
    throw new ApiError(
      400,
      "Home listing with this title and address already exists"
    );
  }

  const images = req.files.images.map((file) =>
    file.path.replace("public\\", "").replace(/\\/g, "/")
  );

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
    creator,
    creatorType,
    propertyFor
  });

  res
    .status(201)
    .json(new ApiResponse(201, home, "Home Listing Created Successfully"));
});

// Get all home
exports.getAllHomes = asyncHandler(async (req, res) => {
  // Fetch home with creatorType: "User" and populate creator
  const userHome = await Home.find({ creatorType: "User" })
    .populate({
      path: "creator",
      model: "User", // Specify the User model
      select: "name email phone avatar",
    })
    .lean(); // Convert to plain JavaScript objects for easier merging

  // Fetch home with creatorType: "Admin" and populate creator
  const adminHome = await Home.find({ creatorType: "Admin" })
    .populate({
      path: "creator",
      model: "Admin", // Specify the Admin model
    })
    .lean();

  // Combine the results
  // const home = [...userHome, ...adminHome];

  const home = [...userHome, ...adminHome].map((land) => ({
    ...land,
    type: "Home",
  }));

  res
    .status(200)
    .json(new ApiResponse(200, home, "Home Listings Fetched Successfully"));
});

exports.getAllHomeForUser = asyncHandler(async (req, res) => {
  const userHome = await Home.find({ creatorType: "User", isDelete: false })
    .populate({
      path: "creator",
      model: "User", // Specify the User model
      select: "name email phone", // Specify fields to include from User model
    })
    .lean();

  // Fetch home with creatorType: "Admin" and populate creator with specific fields
  const adminHome = await Home.find({ creatorType: "Admin", isDelete: false })
    .populate({
      path: "creator",
      model: "Admin", // Specify the Admin model
    })
    .lean();
  const type = 'Home'

  const home = [...userHome, ...adminHome].map((land) => ({
    ...land,
    type: "Home",
  }));

  // Combine the results
  // const home = [...userHome, ...adminHome, type];
  res
    .status(200)
    .json(new ApiResponse(200, home, "User Properties Fetched Successfully"));
});

// Get a single home by ID
exports.getHomeById = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Fetch the home by ID
  let home = await Home.findById(id);

  if (!home) {
    throw new ApiError(404, "Home Listing Not Found");
  }

  // Populate creator based on creatorType
  if (home.creatorType === "User") {
    home = await Home.findById(id)
      .populate({
        path: "creator",
        model: "User",
        select: "name email phone avatar", // Select specific fields from User model
      })
      .lean();
  } else if (home.creatorType === "Admin") {
    home = await Home.findById(id)
      .populate({
        path: "creator",
        model: "Admin",
      })
      .lean();
  }

  res
    .status(200)
    .json(new ApiResponse(200, home, "Home Listing Fetched Successfully"));
});

// Update a home listing with optional image upload
exports.updateHome = asyncHandler(async (req, res) => {
  const { id, ...updateData } = req.body;

  const home = await Home.findById(id);
  if (!home || home.isDelete) {
    throw new ApiError(404, "Home Listing Not Found");
  }

  if (req.files && req.files.length > 0) {
    updateData.images = req.files.map((file) =>
      file.path.replace("public\\", "").replace(/\\/g, "/")
    );
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

//  delete a home
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

// Get all home by status
exports.getHomesByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const validStatuses = ["Available", "Sold", "Pending"];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const homes = await Home.find({ status, isDelete: false }).populate(
    "createdBy",
    "username email"
  );
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


exports.updateHomeApprovalStatus = asyncHandler(async (req, res) => {

  const { status, message, id } = req.body;

  // Validate status
  const validStatuses = ["approved", "denied"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status. Must be 'approved' or 'denied'");
  }

  const user = await Home.findById(id);
  if (!user) {
    throw new ApiError(404, "Home not found");
  }

  user.approvalStatus = status;
  user.adminMessage = message || "";

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, `Home ${status} successfully.`));
});