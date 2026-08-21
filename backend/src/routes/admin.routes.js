const express = require("express");
const {
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  getAdminAllProperties,
  markPropertySold,
} = require("../controllers/Admin.controller.js");
const { verifyAdminJwt } = require("../middelware/adminAuth.middelware.js");

const router = express.Router();

router.route("/login").post(loginAdmin);
router.route("/logout").post(verifyAdminJwt, logoutAdmin);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/get-all-properties").get(verifyAdminJwt, getAdminAllProperties);
router.route("/mark-sold").post(verifyAdminJwt, markPropertySold);

module.exports = router;
