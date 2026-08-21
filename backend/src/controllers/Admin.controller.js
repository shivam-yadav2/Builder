const Admin = require("../models/auth.model.js");
const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const { asyncHandler } = require("../utils/asyncHandler.utils.js");
const Land = require("../models/land.model.js");
const Home = require("../models/home.model.js");
const Gallery = require("../models/gallery.model.js");
const jwt = require("jsonwebtoken");

const generateAccessAndRefreshTokens = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    const refreshToken = admin.generateRefreshToken();
    const accessToken = admin.generateAccessToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Token not generated");
  }
};

const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email.trim() === "" || password.trim() === "") {
    throw new ApiError(400, "All fields are required");
  }

  const isAlreadyExist = await Admin.findOne({ email });
  if (isAlreadyExist) {
    throw new ApiError(409, "Admin Already Exists");
  }

  const admin = await Admin.create({ email, password });
  if (!admin) {
    throw new ApiError(500, "Admin not created");
  }

  const createdAdmin = await Admin.findById(admin._id).select("-password");
  if (!createdAdmin) {
    throw new ApiError(500, "Admin not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdAdmin, "Admin Created"));
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedAdmin = await Admin.findOne({ email });
  if (!existedAdmin) {
    throw new ApiError(404, "Admin not found");
  }

  const isPasswordCorrect = await existedAdmin.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    existedAdmin._id
  );

  const loggedInAdmin = await Admin.findById(existedAdmin._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { admin: loggedInAdmin, accessToken, refreshToken },
        "Admin Logged In"
      )
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.user?._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Admin logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const admin = await Admin.findById(decodedToken?._id);
    if (!admin) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== admin?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired");
    }

    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(admin._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const getAdminAllProperties = asyncHandler(async (req, res) => {
  const [lands, homes] = await Promise.all([
    Land.find({ isDelete: false }).sort({ createdAt: -1 }).lean(),
    Home.find({ isDelete: false }).sort({ createdAt: -1 }).lean(),
  ]);

  const properties = [
    ...lands.map((l) => ({ ...l, type: "Land" })),
    ...homes.map((h) => ({ ...h, type: "Home" })),
  ];

  res
    .status(200)
    .json(
      new ApiResponse(200, properties, "All properties fetched successfully")
    );
});

// Mark a property as Sold and copy it into the public Showcase (sold category).
const markPropertySold = asyncHandler(async (req, res) => {
  const { id, type, sold_price, sold_date } = req.body;

  if (!id || !["Home", "Land"].includes(type)) {
    throw new ApiError(400, "Valid property id and type are required");
  }
  if (!sold_price || !sold_date) {
    throw new ApiError(400, "Sold price and sold date are required");
  }

  const Model = type === "Land" ? Land : Home;
  const property = await Model.findById(id);
  if (!property || property.isDelete) {
    throw new ApiError(404, "Property not found");
  }

  // Mark the listing as sold.
  property.status = "Sold";
  await property.save();

  // Create the matching Showcase (sold) entry, reusing the property's media.
  const gallery = await Gallery.create({
    category: "sold",
    name: property.title,
    location: property.location || property.fullAddress,
    description: property.description,
    images: property.images,
    tags: property.nearby || [],
    sold_price: sold_price.toString(),
    sold_date,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      { property, gallery },
      "Property marked as sold and added to showcase"
    )
  );
});

module.exports = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  getAdminAllProperties,
  markPropertySold,
};
