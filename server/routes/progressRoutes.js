const express = require('express');
const router = express.Router();
const { addProgressLog, getMyProgress, getMemberProgress, deleteProgressLog } = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/auth');

router.get('/me', protect, getMyProgress);
router.get('/member/:userId', protect, authorize('trainer', 'admin'), getMemberProgress);
router.post('/', protect, authorize('member'), addProgressLog);
router.delete('/:id', protect, authorize('member'), deleteProgressLog);

module.exports = router;
