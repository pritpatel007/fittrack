const express = require('express');
const router = express.Router();
const { getAllTrainers, getTrainerById, upsertTrainerProfile, getMyProfile } = require('../controllers/trainerController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getAllTrainers);
router.get('/me', protect, authorize('trainer'), getMyProfile);
router.get('/:id', getTrainerById);
router.put('/profile', protect, authorize('trainer', 'admin'), upload.single('image'), upsertTrainerProfile);
router.put('/:id/profile', protect, authorize('admin'), upload.single('image'), upsertTrainerProfile);

module.exports = router;
