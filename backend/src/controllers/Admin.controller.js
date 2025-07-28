const Admin = require("../models/auth.model.js");
const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const { asyncHandler } = require("../utils/asyncHandler.utils.js");
const Land = require("../models/land.model.js");
const Home = require("../models/home.model.js");
const { User } = require("../models/user.model.js");

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

  console.log(email, password);

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const isAlreadyExist = await Admin.findOne({ email });

  if (isAlreadyExist) {
    throw new ApiError(409, "Admin Already Exists");
  }

  const user = await Admin.create({
    email,
    password,
  });

  if (!user) {
    throw new ApiError(500, "Admin not created");
  }

  const createdUser = await Admin.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "User not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Admin Created", createdUser));
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
        {
          admin: loggedInAdmin,
          accessToken,
          refreshToken,
        },
        "Admin Logged In"
      )
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
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
          { accessToken, newRefreshToken },
          "Access Token Refreshed Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const getAdminAllProperties = asyncHandler(async (req, res) => {
  // Fetch lands with creatorType: "User" and populate creator
  const userLands = await Land.find({ creatorType: "User" })
    .populate({
      path: "creator",
      model: "User",
      select: "name email phone avatar",
    })
    .lean()
    .then((lands) => lands.map((land) => ({ ...land, type: "Land" })));

  // Fetch lands with creatorType: "Admin" and populate creator
  const adminLands = await Land.find({ creatorType: "Admin" })
    .populate({
      path: "creator",
      model: "Admin",
    })
    .lean()
    .then((lands) => lands.map((land) => ({ ...land, type: "Land" })));

  // Fetch homes with creatorType: "User" and populate creator
  const userHome = await Home.find({ creatorType: "User" })
    .populate({
      path: "creator",
      model: "User",
      select: "name email phone avatar",
    })
    .lean()
    .then((homes) => homes.map((home) => ({ ...home, type: "Home" })));

  // Fetch homes with creatorType: "Admin" and populate creator
  const adminHome = await Home.find({ creatorType: "Admin" })
    .populate({
      path: "creator",
      model: "Admin",
    })
    .lean()
    .then((homes) => homes.map((home) => ({ ...home, type: "Home" })));

  const properties = [...userLands, ...adminLands, ...userHome, ...adminHome];

  res
    .status(200)
    .json(
      new ApiResponse(200, properties, "All properties fetched successfully")
    );
});

const updateLandApprovalStatus = asyncHandler(async (req, res) => {
  const { status, message, id, type } = req.body;

  // Validate status
  const validStatuses = ["approved", "denied"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status. Must be 'approved' or 'denied'");
  }

  if (type === "Land") {
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
  } else if (type === "Home") {
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
  }
});

module.exports = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  getAdminAllProperties,
  updateLandApprovalStatus
};
