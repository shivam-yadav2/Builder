const express = require("express");
const router = express.Router();
const {
  createSellFilter,
  getSellFilters,
  updateSellFilter,
  deleteSellFilter,
} = require("../controllers/sellFilter.controller");
const { verifyAdminJwt } = require("../middelware/adminAuth.middelware.js");

router.post("/add", createSellFilter);
router.get("/getAll", verifyAdminJwt, getSellFilters);
router.patch("/updateStatus/:id", verifyAdminJwt, updateSellFilter);
router.delete("/delete/:id", verifyAdminJwt, deleteSellFilter);

module.exports = router;
