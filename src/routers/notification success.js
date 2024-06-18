
// create router for notification
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

// Retrieve all notification
router.get("/",[passportJWT.isLogin,authentication.isUser], notificationController.findAll);

// Update a notification with id
router.put("/",[passportJWT.isLogin,authentication.isUser], notificationController.update);

// Mark all notifications as read
router.put("/mark-all-as-read", [passportJWT.isLogin, authentication.isUser], notificationController.markAllAsRead);

module.exports = router;