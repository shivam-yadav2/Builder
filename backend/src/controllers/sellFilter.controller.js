const SellFilter = require("../models/sellfilter.model");
const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const { asyncHandler } = require("../utils/asyncHandler.utils.js");

const VALID_STATUSES = ["new", "lost", "contacted", "converted", "fake"];
const VALID_TYPES = ["home", "land"];

const createSellFilter = asyncHandler(async (req, res) => {
  const { type, location, area, budget, name, number, status } = req.body;

  if (!type || !VALID_TYPES.includes(type)) {
    throw new ApiError(400, "type must be 'home' or 'land'");
  }
  if (!location || typeof location !== "string" || !location.trim()) {
    throw new ApiError(400, "location is required");
  }
  if (typeof area !== "number" || area <= 0) {
    throw new ApiError(400, "area must be a positive number");
  }
  if (typeof budget !== "number" || budget <= 0) {
    throw new ApiError(400, "budget must be a positive number");
  }
  if (!name || typeof name !== "string" || !name.trim()) {
    throw new ApiError(400, "name is required");
  }
  if (!number || typeof number !== "string" || !number.trim()) {
    throw new ApiError(400, "number is required");
  }

  const sellFilter = await SellFilter.create({
    type,
    location: location.trim(),
    area,
    budget,
    name: name.trim(),
    number: number.trim(),
    status: status && VALID_STATUSES.includes(status) ? status : "new",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, sellFilter, "Sell inquiry created"));
});

const getSellFilters = asyncHandler(async (req, res) => {
  const sellFilters = await SellFilter.find({}).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, sellFilters, "Sell inquiries fetched"));
});

const updateSellFilter = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`
    );
  }

  const sellFilter = await SellFilter.findById(req.params.id);
  if (!sellFilter) {
    throw new ApiError(404, "Sell inquiry not found");
  }

  sellFilter.status = status;
  await sellFilter.save();

  return res
    .status(200)
    .json(new ApiResponse(200, sellFilter, "Sell inquiry updated"));
});

const deleteSellFilter = asyncHandler(async (req, res) => {
  const sellFilter = await SellFilter.findByIdAndDelete(req.params.id);
  if (!sellFilter) {
    throw new ApiError(404, "Sell inquiry not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Sell inquiry deleted"));
});

module.exports = {
  createSellFilter,
  getSellFilters,
  updateSellFilter,
  deleteSellFilter,
};
