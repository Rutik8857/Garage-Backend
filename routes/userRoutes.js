// // routes/user.routes.js
// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/user.controller');

// // --- User Routes ---

// // @route   POST /api/users/add
// // @desc    Add a new user
// // @access  Public
// router.post('/add', userController.createUser);

// // You can add more user-related routes here (e.g., get users, update user)
// // router.get('/', userController.getAllUsers);
// // router.get('/:id', userController.getUserById);

// module.exports = router;


const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Use the real controller to create users
// POST /api/users
router.post('/', userController.createUser);

router.get('/', userController.getAllUsers);

router.delete('/:id', userController.deleteUser)




router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);


module.exports = router;
