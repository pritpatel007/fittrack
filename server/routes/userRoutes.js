const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateProfile, updateUser, deleteUser, getMembers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/members', protect, authorize('admin', 'trainer'), getMembers);
router.get('/:id', protect, getUserById);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
