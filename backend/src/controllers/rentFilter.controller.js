
const RentFilter = require('../models/rentfilter.model');
const { asyncHandler } = require("../utils/asyncHandler.utils.js");


const createRentFilter = asyncHandler(async (req, res) => {
  const { type, propertyType, location, budget, name, number, status } = req.body;

  //  missing required fields
  const rentFilterData = {
    type: type || 'home', 
    propertyType: propertyType || 'residential',
    location: location && typeof location === 'string' && location.trim() ? location : 'unknown', 
    budget: typeof budget === 'number' && budget > 0 ? budget : 0, 
    name: name && typeof name === 'string' && name.trim() ? name : 'anonymous', 
    number: number && typeof number === 'string' && number.trim() ? number : 'unknown', 
    status: status && ['new', 'lost', 'contacted', 'converted', 'fake'].includes(status) ? status : 'new', 
  };

  // Create new rent filter
  const rentFilter = await RentFilter.create(rentFilterData);

  res.status(201).json({
    success: true,
    data: rentFilter,
  });
});

const getRentFilters = asyncHandler(async (req, res) => {
  const rentFilters = await RentFilter.find({}).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: rentFilters.length,
    data: rentFilters,
  });
});


const updateRentFilter = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // Validate status
  if (!status || !['new', 'lost', 'contacted', 'converted', 'fake'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status. Must be one of: new, lost, contacted, converted, fake');
  }

  const rentFilter = await RentFilter.findById(req.params.id);

  if (!rentFilter) {
    res.status(404);
    throw new Error('Rent filter not found');
  }

  // Update only the status field
  rentFilter.status = status;
  const updatedRentFilter = await rentFilter.save();

  res.status(200).json({
    success: true,
    data: updatedRentFilter,
  });
});

module.exports = {
  createRentFilter,
  getRentFilters,
  updateRentFilter,
};

