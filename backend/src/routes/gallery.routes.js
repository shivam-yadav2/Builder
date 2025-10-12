const express = require('express');
const router = express.Router();
const {
    createGallery,
    getAllGallery,
    getGalleryById,
    updateGallery,
    deleteGallery,
} = require('../controllers/gallery.controller.js');

const { upload } = require("../middelware/multer.middelware.js");
const { verifyJwt } = require("../middelware/auth.middelware.js");
const { verifyAdminJwt } = require('../middelware/adminAuth.middelware.js');

// Create gallery item (Admin only)
router.route('/add').post(
    upload.fields([{ name: 'images', maxCount: 10 }]),
    verifyAdminJwt,
    createGallery
);

// Update gallery item (Admin only)
router.route('/update').post(
    upload.fields([{ name: 'images', maxCount: 10 }]),
    verifyAdminJwt,
    updateGallery
);

// Get all gallery items (Public)
router.route('/get-all').get(getAllGallery);

// Get gallery item by ID (Public)
router.route('/get-by-id').post(getGalleryById);

// Delete gallery item (Admin only)
router.route('/delete').post(verifyAdminJwt, deleteGallery);

module.exports = router;
