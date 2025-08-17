
const ConstructionFilter  = require("../models/constructfilter.model.js");
const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const { asyncHandler } = require("../utils/asyncHandler.utils.js");

const createConstructionFilter = asyncHandler(async (req, res) => {
  const { plotArea, constructionArea, budget, location, name, number } = req.body;

  // Validate required fields
 if (
  [location, name, number].some(
    (field) => typeof field !== "string" || field.trim() === ""
  ) ||
  [plotArea, constructionArea, budget].some(
    (field) => typeof field !== "number" || field <= 0
  )
) {
  throw new ApiError(400, "All fields are required and must be valid");
}


  // Validate plotArea
  if (typeof plotArea !== "number" || plotArea <= 0) {
    throw new ApiError(400, "Plot area must be a positive number");
  }

  // Validate constructionArea
  if (typeof constructionArea !== "number" || constructionArea <= 0) {
    throw new ApiError(400, "Construction area must be a positive number");
  }

  // Validate budget
  if (typeof budget !== "number" || budget <= 0) {
    throw new ApiError(400, "Budget must be a positive number");
  }

  // Check if similar filter already exists
  const existingFilter = await ConstructionFilter.findOne({
    plotArea,
    constructionArea,
    budget,
    location,
    number,
  });

  if (existingFilter) {
    throw new ApiError(409, "Similar construction filter already exists");
  }

  const constructionFilter = await ConstructionFilter.create({
    plotArea,
    constructionArea,
    budget,
    location,
    name,
    number,
  });

  if (!constructionFilter) {
    throw new ApiError(500, "Failed to create construction filter");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Construction filter created", constructionFilter));
});

const getConstructionFilters = asyncHandler(async (req, res) => {
  const constructionFilters = await ConstructionFilter.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Construction filters retrieved", constructionFilters));
});

const getConstructionFilterById = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new ApiError(400, "Construction filter ID is required");
  }

  const constructionFilter = await ConstructionFilter.findById(id);

  if (!constructionFilter) {
    throw new ApiError(404, "Construction filter not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Construction filter retrieved", constructionFilter));
});

// const updateConstructionFilter = asyncHandler(async (req, res) => {
//   const { id } = req.body;
// const { status } = req.body;

//   if (!id) {
//     throw new ApiError(400, "Rent filter ID is required");
//   }

//   if (!status) {
//     throw new ApiError(400, "Status is required");
//   }

//   if (!["new", "lost", "contacted", "converted", "fake"].includes(status)) {
//     throw new ApiError(400, "Invalid status");
//   }

//   const constructionFilter = await ConstructionFilter.findByIdAndUpdate(
//      id,
//     { status },
//     { new: true }
//   );

//   if (!constructionFilter) {
//     throw new ApiError(404, "Construction filter not found");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, "Construction filter updated", constructionFilter));
// });

const deleteConstructionFilter = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new ApiError(400, "Construction filter ID is required");
  }

  const constructionFilter = await ConstructionFilter.findByIdAndDelete(id);

  if (!constructionFilter) {
    throw new ApiError(404, "Construction filter not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Construction filter deleted", {}));
});

const changeConstructionFilterStatus = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const { status } = req.body;

  if (!id) {
    throw new ApiError(400, "Construction filter ID is required");
  }

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  if (!["new", "lost", "contacted", "converted", "fake"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const constructionFilter = await ConstructionFilter.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!constructionFilter) {
    throw new ApiError(404, "Construction filter not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Construction filter status updated", constructionFilter));
});

module.exports = {
  createConstructionFilter,
  getConstructionFilters,
  getConstructionFilterById,
  // updateConstructionFilter,
  deleteConstructionFilter,
  changeConstructionFilterStatus,
};