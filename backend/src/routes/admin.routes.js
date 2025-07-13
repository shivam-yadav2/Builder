const express = require("express");
const { loginAdmin, registerAdmin, getAdminAllProperties, updateLandApprovalStatus } = require("../controllers/Admin.controller.js");
const { verifyAdminJwt } = require("../middelware/adminAuth.middelware.js");

const router = express.Router();

router.route("/login").post(loginAdmin);
// router.route("/update-land-status").post(loginAdmin);
router.route("/get-all-properties").get(verifyAdminJwt , getAdminAllProperties);
router.route("/update-property-status").post(verifyAdminJwt,updateLandApprovalStatus);


module.exports = router;
