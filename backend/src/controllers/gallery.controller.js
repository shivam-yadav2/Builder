const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const { asyncHandler } = require("../utils/asyncHandler.utils.js");
const Gallery = require("../models/gallery.model.js");

// Normalises the `keepImages` field (existing image paths to retain on update).
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

const cleanGalleryPath = (filePath) =>
  filePath
    ?.replace("public\\", "")
    ?.replace(/\\/g, "/")
    .replace("public/", "");

// Normalise comma-separated or array tags into a clean array.
const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
};

const createGallery = asyncHandler(async (req, res) => {
  const {
    name,
    location,
    description,
    tags,
    category,
    sold_price,
    sold_date,
    project_type,
    area,
    completed_date,
  } = req.body;
  const files = req.files?.images || [];

  const cat = category === "construction" ? "construction" : "sold";

  // Common required fields
  if (!name?.trim() || !location?.trim()) {
    throw new ApiError(400, "Name and location are required");
  }
  // Sold items must record the sale price & date
  if (cat === "sold" && (!sold_price?.trim() || !sold_date?.trim())) {
    throw new ApiError(400, "Sold price and sold date are required");
  }

  const imageUrls = files.map((f) => cleanGalleryPath(f.path));
  if (imageUrls.length === 0) {
    throw new ApiError(400, "Please upload at least one image");
  }

  const gallery = await Gallery.create({
    category: cat,
    name,
    location,
    description,
    images: imageUrls,
    tags: parseTags(tags),
    // sold
    sold_price: cat === "sold" ? sold_price : undefined,
    sold_date: cat === "sold" ? sold_date : undefined,
    // construction
    project_type: cat === "construction" ? project_type : undefined,
    area: cat === "construction" ? area : undefined,
    completed_date: cat === "construction" ? completed_date || undefined : undefined,
  });

  if (!gallery) {
    throw new ApiError(500, "Gallery item not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, gallery, "Gallery item created successfully"));
});

const getAllGallery = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = { isDeleted: false };

  // Legacy items have no category — treat anything that isn't explicitly
  // "construction" as a sold item.
  if (category === "construction") {
    filter.category = "construction";
  } else if (category === "sold") {
    filter.category = { $ne: "construction" };
  }

  const gallery = await Gallery.find(filter)
    .sort({ createdAt: -1 }) // Newest added items first
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
  const {
    id,
    name,
    location,
    description,
    sold_price,
    sold_date,
    project_type,
    area,
    completed_date,
    tags,
    keepImages,
  } = req.body;
  const files = req.files?.images || [];

  if (!id) {
    throw new ApiError(400, "Gallery ID is required");
  }

  const gallery = await Gallery.findById(id);
  if (!gallery || gallery.isDeleted) {
    throw new ApiError(404, "Gallery item not found");
  }

  // Merge retained existing images with newly uploaded ones. Fall back to the
  // current images only when the client sends neither.
  const newImages = files.map((f) => cleanGalleryPath(f.path));
  let imageUrls = gallery.images;
  if (keepImages !== undefined || newImages.length > 0) {
    imageUrls = [...parseKeepImages(keepImages), ...newImages];
    if (imageUrls.length === 0) {
      throw new ApiError(400, "A gallery item must have at least one image");
    }
  }

  gallery.name = name || gallery.name;
  gallery.location = location || gallery.location;
  if (description !== undefined) gallery.description = description;
  if (tags !== undefined) gallery.tags = parseTags(tags);
  gallery.images = imageUrls;

  // Update only the fields relevant to this item's category.
  if (gallery.category === "construction") {
    if (project_type !== undefined) gallery.project_type = project_type;
    if (area !== undefined) gallery.area = area;
    if (completed_date) gallery.completed_date = completed_date;
  } else {
    if (sold_price) gallery.sold_price = sold_price;
    if (sold_date) gallery.sold_date = sold_date;
  }

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
