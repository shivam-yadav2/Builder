const express = require('express');
const router = express.Router();
const { createRentFilter, getRentFilters, updateRentFilter } = require('../controllers/rentFilter.controller');


router.post('/new-rent-inquiry', createRentFilter);

router.get('/rent-inquiry', protectAdmin, getRentFilters);

router.put('/update-rent-inquiry/:id', protectAdmin, updateRentFilter);

module.exports = router;