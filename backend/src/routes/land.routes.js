const express = require("express");
const {
  createLand,
  getAllLands,
  getLandById,
  getAllLandsForUser,
  deleteLand,
  updateLand,
  updateLandApprovalStatus
} = require("../controllers/land.controller.js");

const { verifyJwt } = require("../middelware/auth.middelware.js");
const { upload } = require("../middelware/multer.middelware.js");
const { verifyAdminJwt } = require("../middelware/adminAuth.middelware.js");

const router = express.Router();

router
  .route("/add-land")
  .post(
    upload.fields([{ name: "images", maxCount: 5 }]),
    verifyJwt,
    createLand
  );
router
  .route("/add-land-admin")
  .post(
    upload.fields([{ name: "images", maxCount: 5 }]),
    verifyAdminJwt,
    createLand
  );
router
  .route("/update-land")
  .post(
    upload.fields([{ name: "images", maxCount: 5 }]),
    verifyJwt,
    updateLand
  );

router.route("/get-land").get(getAllLands);
router.route("/get-land-user").get(getAllLandsForUser);
router.route("/land-detail").post(getLandById);
router.route("/delete-land").post(verifyJwt, deleteLand);
router.route("/approve-land").post(verifyJwt, updateLandApprovalStatus);

module.exports = router;
