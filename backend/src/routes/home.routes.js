const express = require('express');
const router = express.Router();
const {
    createHome,
    getAllHomes,
    getHomeById,
    updateHome,
    deleteHome,
    getHomesByStatus,
    getAllHomeForUser,
    updateHomeApprovalStatus
} = require('../controllers/home.controller.js');

const { upload } = require("../middelware/multer.middelware.js");
const { verifyJwt } = require("../middelware/auth.middelware.js");
const { verifyAdminJwt } = require('../middelware/adminAuth.middelware.js');

router.route('/add-home').post(
    upload.fields([{ name: 'images', maxCount: 5 }]),
    verifyJwt,
    createHome
);
router.route('/add-home-admin').post(
    upload.fields([{ name: 'images', maxCount: 5 }]),
    verifyAdminJwt,
    createHome
);

router.route('/update-home').post(
    upload.fields([{ name: 'images', maxCount: 5 }]),
    verifyJwt,
    updateHome
)

router.route('/get-home').get(getAllHomes);
router.route('/get-home-user').get(getAllHomeForUser);
router.route('/get-home-status').get(getHomesByStatus);
router.route('/home-detail').post(getHomeById);
router.route('/delete-home').post(verifyJwt, deleteHome);
router.route('/approve-home').post(verifyJwt, updateHomeApprovalStatus);

module.exports = router;