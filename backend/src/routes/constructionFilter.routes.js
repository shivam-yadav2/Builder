
const express = require("express");
const router = express.Router();

const {
  createConstructionFilter,
  getConstructionFilters,
  getConstructionFilterById,
  // updateConstructionFilter,
  deleteConstructionFilter,
  changeConstructionFilterStatus,
} = require("../controllers/constructFilter.controller");


// Construction Filter Routes
router.route("/add").post(createConstructionFilter);
router.route("/getAll").get(getConstructionFilters);
router.route("/getById/:id").get(getConstructionFilterById);
// router.route("/updateById/:id").put(updateConstructionFilter);
router.route("/deleteById").post(deleteConstructionFilter);
router.route("/updateStatus/:id").patch(changeConstructionFilterStatus);


module.exports = router;