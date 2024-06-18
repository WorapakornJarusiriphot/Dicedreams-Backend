// create router for users

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passportJWT = require('../middleware/passportJWT');

// Create a new user
router.post('/', userController.create);

// Retrieve all users
router.get('/', userController.findAll);

// Retrieve a single user with id
router.get('/:id',[passportJWT.isLogin], userController.findOne);

// Update a user with id
router.put('/:id',[passportJWT.isLogin], userController.update);

// Delete a user with id
router.delete('/:id', userController.delete);

// Delete all users
router.delete('/', userController.deleteAll);

module.exports = router;
