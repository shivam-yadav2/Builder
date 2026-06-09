const express = require("express");
const {
  createLand,
  getAllLands,
  getLandById,
  deleteLand,
  updateLand,
  getLandsByStatus,
} = require("../controllers/land.controller.js");

const { upload } = require("../middelware/multer.middelware.js");
const { verifyAdminJwt } = require("../middelware/adminAuth.middelware.js");

const router = express.Router();

router
  .route("/add-land")
  .post(
    upload.fields([{ name: "images", maxCount: 5 }]),
    verifyAdminJwt,
    createLand
  );
router
  .route("/update-land")
  .post(
    upload.fields([{ name: "images", maxCount: 5 }]),
    verifyAdminJwt,
    updateLand
  );

router.route("/get-land").get(getAllLands);
router.route("/get-land-status").get(getLandsByStatus);
router.route("/land-detail").post(getLandById);
router.route("/delete-land").post(verifyAdminJwt, deleteLand);

module.exports = router;
