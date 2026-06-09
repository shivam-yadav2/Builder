const express = require('express');
const router = express.Router();
const {
  createRentFilter,
  getRentFilters,
  updateRentFilter,
  deleteRentFilter,
} = require('../controllers/rentFilter.controller');
const { verifyAdminJwt } = require('../middelware/adminAuth.middelware.js');

router.post('/add', createRentFilter);
router.get('/getAll', verifyAdminJwt, getRentFilters);
router.patch('/updateStatus/:id', verifyAdminJwt, updateRentFilter);
router.delete('/delete/:id', verifyAdminJwt, deleteRentFilter);

module.exports = router;
