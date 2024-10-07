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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 */
router.get("/", [passportJWT.isLogin, authentication.isStoreOrUser], notificationController.findAll);

/**
 * @swagger
 * /notification/user:
 *   get:
 *     summary: Retrieve notifications for a specific user with pagination
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of notifications per page
 *     responses:
 *       200:
 *         description: A list of notifications with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       notification_id:
 *                         type: string
 *                       type:
 *                         type: string
 *                       data:
 *                         type: object
 *                       read:
 *                         type: boolean
 *                       time:
 *                         type: string
 *                         format: date-time
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 total:
 *                   type: integer
 *                   description: Total number of notifications on this page
 *       401:
 *         description: Unauthorized
 */
router.get("/user", [passportJWT.isLogin, authentication.isStoreOrUser], notificationController.findUserNotifications);

/**
 * @swagger
 * /notification:
 *   put:
 *     summary: Update a notification with id
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
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
 *                 example: ["c99f7bba-8e5f-4481-aaad-ace179f27ab2"]
 *     responses:
 *       200:
 *         description: Notification was updated successfully.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully.
 *       401:
 *         description: Unauthorized
 */
router.put("/mark-all-as-read", [passportJWT.isLogin, authentication.isStoreOrUser], notificationController.markAllAsRead);

module.exports = router;
