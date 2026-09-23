const express = require('express');
const router = express.Router();
const { getClasses, getClassById, createClass, updateClass, deleteClass, getMyClasses } = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getClasses);
router.get('/mine', protect, authorize('trainer'), getMyClasses);
router.get('/:id', getClassById);
router.post('/', protect, authorize('admin', 'trainer'), createClass);
router.put('/:id', protect, authorize('admin', 'trainer'), updateClass);
router.delete('/:id', protect, authorize('admin'), deleteClass);

module.exports = router;
