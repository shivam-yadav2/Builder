const express = require("express");
const {
  createEnquiry,
  getAllEnquiries,
  deleteEnquiry,
} = require("../controllers/enquiry.controller.js");

const router = express.Router();

router.route("/add-enquiry").post(createEnquiry);
router.route("/get-enquiry").get(getAllEnquiries);
router.route("/delete-enquiry").post(deleteEnquiry);

module.exports = router;
