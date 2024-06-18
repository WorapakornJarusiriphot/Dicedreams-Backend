// create router for postActivity
const express = require("express");
const router = express.Router();
const postActivityController = require("../controllers/postActivityController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

/**
 * @swagger
 * tags:
 *   name: PostActivities
 *   description: Activity post management
 */

/**
 * @swagger
 * /postActivity:
 *   post:
 *     summary: Create a new activity post
 *     tags: [PostActivities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_activity:
 *                 type: string
 *               status_post:
 *                 type: string
 *               creation_date:
 *                 type: string
 *               detail_post:
 *                 type: string
 *               date_activity:
 *                 type: string
 *               time_activity:
 *                 type: string
 *               post_activity_image:
 *                 type: string
 *               store_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: The activity post was successfully created
 *       400:
 *         description: Invalid input
 */
router.post("/", [passportJWT.isLogin, authentication.isStore], postActivityController.create);

/**
 * @swagger
 * /postActivity:
 *   get:
 *     summary: Retrieve all activity posts
 *     tags: [PostActivities]
 *     responses:
 *       200:
 *         description: A list of activity posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", postActivityController.findAll);

/**
 * @swagger
 * /postActivity/{id}:
 *   get:
 *     summary: Retrieve a single activity post by ID
 *     tags: [PostActivities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The activity post ID
 *     responses:
 *       200:
 *         description: An activity post object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Activity post not found
 */
router.get("/:id", [passportJWT.isLogin, authentication.isStoreOrUser], postActivityController.findOne);

/**
 * @swagger
 * /postActivity/{id}:
 *   put:
 *     summary: Update an activity post with id
 *     tags: [PostActivities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The activity post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_activity:
 *                 type: string
 *               status_post:
 *                 type: string
 *               creation_date:
 *                 type: string
 *               detail_post:
 *                 type: string
 *               date_activity:
 *                 type: string
 *               time_activity:
 *                 type: string
 *               post_activity_image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Activity post was updated successfully.
 *       404:
 *         description: Activity post not found
 *       400:
 *         description: Invalid input
 */
router.put("/:id", [passportJWT.isLogin, authentication.isStore], postActivityController.update);

/**
 * @swagger
 * /postActivity/{id}:
 *   delete:
 *     summary: Delete an activity post with id
 *     tags: [PostActivities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The activity post ID
 *     responses:
 *       200:
 *         description: Activity post was deleted successfully.
 *       404:
 *         description: Activity post not found
 */
router.delete("/:id", [passportJWT.isLogin, authentication.isStore], postActivityController.delete);

/**
 * @swagger
 * /postActivity/store/{storeId}:
 *   get:
 *     summary: Retrieve all activity posts by store ID
 *     tags: [PostActivities]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         schema:
 *           type: string
 *         required: true
 *         description: The store ID
 *     responses:
 *       200:
 *         description: A list of activity posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/store/:storeId", [passportJWT.isLogin, authentication.isStoreOrUser], postActivityController.findAllStorePosts);

module.exports = router;
