// membershipRoutes.js
const express = require('express');
const router = express.Router();
const { getMyMembership, createMembership, getAllMemberships, updateMembership } = require('../controllers/membershipController');
const { protect, authorize } = require('../middleware/auth');

router.get('/me', protect, getMyMembership);
router.get('/', protect, authorize('admin'), getAllMemberships);
router.post('/', protect, createMembership);
router.put('/:id', protect, authorize('admin'), updateMembership);

module.exports = router;
