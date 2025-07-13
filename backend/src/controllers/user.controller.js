const { User } = require("../models/user.model.js");
const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const { asyncHandler } = require("../utils/asyncHandler.utils.js");
const Home = require("../models/home.model.js");
const Land = require("../models/land.model.js");

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log("Id", userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    console.log(refreshToken, accessToken);
    user.refreshToken = refreshToken;

    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Token not generated");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user detail
  // validation
  // check if user already exist
  // files hai ya nhi
  //extract url from response
  // check image uploaded or not?
  // create user object - create entry in DB
  // remove password and refresh token
  // is response , is user created?
  // return response

  const { name, email, password, phone, location } = req.body;

  
  if (
    [name, email, password, phone, location].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const isAlreadyExist = await User.findOne({ email });

  if (isAlreadyExist) {
    throw new ApiError(409, "User Already Exist");
  }

  console.log("req", req.files.avatar[0].path);

  const avatarLocalPath =
    req.files &&
    req.files.avatar[0].path?.replace("public\\", "")?.replace(/\\/g, "/");
  

  if (!avatarLocalPath) {
    throw new ApiError(400, "Please upload an image");
  }

  const user = await User.create({
    name, email, password, phone, location,
    avatar: avatarLocalPath
  });

  if (!user) {
    throw new ApiError(500, "User not created");
  }

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User Created", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  // get user detail
  // validation
  // check if user already exist
  // check password
  // create token
  // return response

  const { email, password } = req.body;
  console.log(email);

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });

  console.log(user);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.approvalStatus !== "approved") {
    throw new ApiError(
      403,
      `Account is ${user.approvalStatus}. Please contact admin.`
    );
  }

  const isPasswordMatched = await user.isPasswordCorrect(password);

  if (!isPasswordMatched) {
    throw new ApiError(400, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
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
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In"
      )
    );
});

const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find();
  res
    .status(200)
    .json(new ApiResponse(200, users, "User Fetched Successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
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
    .json(new ApiResponse(200, {}, "user logged out successfully"));
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

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, " Refresh Token is expired");
    }

    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "Access Token Refreshed SuccessFully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is Incorrect");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password Update SuccessFully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

const updateUserData = asyncHandler(async (req, res) => {
  const { name, email, phone, location, purpose, aadhaar_number } = req.body;

  if (name) {
    throw new ApiError(401, "Full Name and USer name is required");
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        name,
        email,
        phone,
        location,
        purpose,
        aadhaar_number,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "User Details Updated SuccessFully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  // Handle images
  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }
  const avatarLocalPath = req.file.path
    .replace("public\\", "")
    .replace(/\\/g, "/");

  // const avatar = await uploadOnCloudinary(avatarLocalPath)

  // if (avatar.url) {
  //     throw new ApiError(400, "Error while uploading avatar")
  // }

  const updatedAvatar = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatarLocalPath,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAvatar, "Avatar Updated SuccessFully"));
});

const updateUserApprovalStatus = asyncHandler(async (req, res) => {
  const { status, message, id } = req.body;

  // Validate status
  const validStatuses = ["approved", "denied"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status. Must be 'approved' or 'denied'");
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.approvalStatus = status;
  user.adminMessage = message || "";

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, `User ${status} successfully.`));
});

const getUserProperties = asyncHandler(async (req, res) => {
  const { userId, creatorType } = req.body;

  if (!userId || !creatorType) {
    throw new ApiError(400, "User ID and creatorType are required");
  }

  const landProperties = await Land.find({
    creator: userId,
    creatorType,
    isDelete: false,
  }).populate("creator");

  const homeProperties = await Home.find({
    creator: userId,
    creatorType,
    isDelete: false,
  }).populate("creator");

  const properties = [...landProperties, ...homeProperties];

  res
    .status(200)
    .json(
      new ApiResponse(200, properties, "User properties fetched successfully")
    );
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changePassword,
  updateUserData,
  getAllUser,
  updateUserApprovalStatus,
  updateAvatar,
  getUserProperties,
};
