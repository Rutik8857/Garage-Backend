const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/upload.js');

// Use the real controller to create users
// POST /api/users
router.post('/', upload.single('profile_image'), userController.createUser);

router.get('/', userController.getAllUsers);

router.delete('/:id', userController.deleteUser)




router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);


module.exports = router;
