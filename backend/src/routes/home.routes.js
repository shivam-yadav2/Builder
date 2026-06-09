const express = require('express');
const router = express.Router();
const {
    createHome,
    getAllHomes,
    getHomeById,
    updateHome,
    deleteHome,
    getHomesByStatus,
} = require('../controllers/home.controller.js');

const { upload } = require("../middelware/multer.middelware.js");
const { verifyAdminJwt } = require('../middelware/adminAuth.middelware.js');

router.route('/add-home').post(
    upload.fields([{ name: 'images', maxCount: 5 }]),
    verifyAdminJwt,
    createHome
);

router.route('/update-home').post(
    upload.fields([{ name: 'images', maxCount: 5 }]),
    verifyAdminJwt,
    updateHome
);

router.route('/get-home').get(getAllHomes);
router.route('/get-home-status').get(getHomesByStatus);
router.route('/home-detail').post(getHomeById);
router.route('/delete-home').post(verifyAdminJwt, deleteHome);

module.exports = router;
