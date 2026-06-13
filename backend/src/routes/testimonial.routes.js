const express = require("express");
const router = express.Router();
const {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonial.controller.js");

const { upload } = require("../middelware/multer.middelware.js");
const { verifyAdminJwt } = require("../middelware/adminAuth.middelware.js");

const avatarUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "images", maxCount: 1 },
]);

// Public
router.route("/get-all").get(getAllTestimonials);

// Admin only
router.route("/add").post(avatarUpload, verifyAdminJwt, createTestimonial);
router.route("/update").post(avatarUpload, verifyAdminJwt, updateTestimonial);
router.route("/delete").post(verifyAdminJwt, deleteTestimonial);

module.exports = router;
