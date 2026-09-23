const express = require('express');
const router = express.Router();
const { createWorkoutPlan, updateWorkoutPlan, getMemberWorkoutPlan, getMyAssignedPlans, getMyWorkoutPlan } = require('../controllers/workoutController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, authorize('member'), getMyWorkoutPlan);
router.get('/assigned', protect, authorize('trainer'), getMyAssignedPlans);
router.get('/member/:memberId', protect, authorize('trainer', 'admin'), getMemberWorkoutPlan);
router.post('/', protect, authorize('trainer', 'admin'), createWorkoutPlan);
router.put('/:id', protect, authorize('trainer', 'admin'), updateWorkoutPlan);

module.exports = router;
