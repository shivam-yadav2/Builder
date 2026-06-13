const express = require("express");
const {
  createEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} = require("../controllers/enquiry.controller.js");

const router = express.Router();

router.route("/add-enquiry").post(createEnquiry);
router.route("/get-enquiry").get(getAllEnquiries);
router.route("/update-status").post(updateEnquiryStatus);
router.route("/delete-enquiry").post(deleteEnquiry);

module.exports = router;
