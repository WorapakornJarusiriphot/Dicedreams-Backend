// create router for notification
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management
 */

/**
 * @swagger
 * /notification:
 *   get:
 *     summary: Retrieve all notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   message:
 *                     type: string
 *                   is_read:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/", [passportJWT.isLogin, authentication.isStoreOrUser], notificationController.findAll);

/**
 * @swagger
 * /notification:
 *   put:
 *     summary: Update a notification with id
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notification_id:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["123e4567-e89b-12d3-a456-426614174000"]
 *     responses:
 *       200:
 *         description: Notification was updated successfully.
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Notification not found
 */
router.put("/", [passportJWT.isLogin, authentication.isStoreOrUser], notificationController.update);

/**
 * @swagger
 * /notification/mark-all-as-read:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully.
 */
router.put("/mark-all-as-read", [passportJWT.isLogin, authentication.isStoreOrUser], notificationController.markAllAsRead);

module.exports = router;
