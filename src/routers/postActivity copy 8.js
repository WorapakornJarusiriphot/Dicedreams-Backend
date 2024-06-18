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
 *                 example: "Board Game Night"
 *               status_post:
 *                 type: string
 *                 example: "active"
 *               creation_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-06-07T12:34:56Z"
 *               detail_post:
 *                 type: string
 *                 example: "มาร่วมสนุกกับเกมกระดานยามค่ำคืนกับเรา"
 *               date_activity:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *               time_activity:
 *                 type: string
 *                 format: time
 *                 example: "18:00:00"
 *               post_activity_image:
 *                 type: string

 *               store_id:
 *                 type: string
 *                 example: "3594f82f-e3bf-11ee-9efc-30d0422f59c9"
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
 *                 properties:
 *                   post_activity_id:
 *                     type: string
 *                   name_activity:
 *                     type: string
 *                   status_post:
 *                     type: string
 *                   creation_date:
 *                     type: string
 *                     format: date-time
 *                   detail_post:
 *                     type: string
 *                   date_activity:
 *                     type: string
 *                     format: date
 *                   time_activity:
 *                     type: string
 *                     format: time
 *                   post_activity_image:
 *                     type: string
 *                   store_id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
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
 *         example: "85c117f0-c001-4544-93e9-aec94c22b484"
 *     responses:
 *       200:
 *         description: An activity post object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post_activity_id:
 *                   type: string
 *                 name_activity:
 *                   type: string
 *                 status_post:
 *                   type: string
 *                 creation_date:
 *                   type: string
 *                   format: date-time
 *                 detail_post:
 *                   type: string
 *                 date_activity:
 *                   type: string
 *                   format: date
 *                 time_activity:
 *                   type: string
 *                   format: time
 *                 post_activity_image:
 *                   type: string
 *                 store_id:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
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
 *         example: "85c117f0-c001-4544-93e9-aec94c22b484"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_activity:
 *                 type: string
 *                 example: "Updated Board Game Night"
 *               status_post:
 *                 type: string
 *                 example: "inactive"
 *               creation_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-06-07T12:34:56Z"
 *               detail_post:
 *                 type: string
 *                 example: "Join us for an updated fun night of board games."
 *               date_activity:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-25"
 *               time_activity:
 *                 type: string
 *                 format: time
 *                 example: "17:00:00"
 *               post_activity_image:
 *                 type: string
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
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
 *         example: "85c117f0-c001-4544-93e9-aec94c22b484"
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
 *         example: "3594f82f-e3bf-11ee-9efc-30d0422f59c9"
 *     responses:
 *       200:
 *         description: A list of activity posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   post_activity_id:
 *                     type: string
 *                   name_activity:
 *                     type: string
 *                   status_post:
 *                     type: string
 *                   creation_date:
 *                     type: string
 *                     format: date-time
 *                   detail_post:
 *                     type: string
 *                   date_activity:
 *                     type: string
 *                     format: date
 *                   time_activity:
 *                     type: string
 *                     format: time
 *                   post_activity_image:
 *                     type: string
 *                   store_id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/store/:storeId", [passportJWT.isLogin, authentication.isStoreOrUser], postActivityController.findAllStorePosts);

module.exports = router;
