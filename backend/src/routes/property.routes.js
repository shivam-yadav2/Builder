const express = require('express');
const router = express.Router();
const {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
} = require('../controllers/property.controller.js');

const { upload } = require("../middelware/multer.middelware.js");
const { verifyJwt } = require("../middelware/auth.middelware.js");
const { verifyAdminJwt } = require('../middelware/adminAuth.middelware.js');

router.route('/add-gallery').post(
    upload.fields([{ name: 'images', maxCount: 5 }]),
    verifyAdminJwt,
    createProperty
);

router.route('/update-gallery').post(
    upload.fields([{ name: 'images', maxCount: 5 }]),
    verifyAdminJwt,
    updateProperty
);

router.route('/get-gallery').get(getAllProperties);
router.route('/gallery-detail').post(getPropertyById);
router.route('/delete-gallery').post(verifyAdminJwt, deleteProperty);

module.exports = router;