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
 *     security:
 *       - bearerAuth: []
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
 *                 example: "07/13/2024 02:50:00"
 *               detail_post:
 *                 type: string
 *                 example: "มาร่วมสนุกกับเกมกระดานยามค่ำคืนกับเรา"
 *               date_activity:
 *                 type: string
 *                 format: date
 *                 example: "07/13/2024"
 *               time_activity:
 *                 type: string
 *                 format: time
 *                 example: "18:00:00"
 *               post_activity_image:
 *                 type: string
 *                 example: "1cd2498d-07fa-4ea5-83ef-c71781bc8cdf.jpeg"
 *               store_id:
 *                 type: string
 *                 example: "3594f82f-e3bf-11ee-9efc-30d0422f59c9"
 *     responses:
 *       201:
 *         description: The activity post was successfully created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", [passportJWT.isLogin, authentication.isStore], postActivityController.create);

/**
 * @swagger
 * /postActivity:
 *   get:
 *     summary: Retrieve all activity posts
 *     tags: [PostActivities]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering activity posts by name or detail
 *         example: "Magic The Gathering&search=Board Game Night&search=Another Activity"
 *       - in: query
 *         name: search_date_activity
 *         schema:
 *           type: string
 *           format: date
 *         description: Search term for filtering activity posts by date activity
 *         example: "07/28/2024"
 *       - in: query
 *         name: search_time_activity
 *         schema:
 *           type: string
 *           format: time
 *         description: Search term for filtering activity posts by time activity
 *         example: "17:00"
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
 * /postActivity/search:
 *   get:
 *     summary: Search for active activity posts with filtering options
 *     tags: [PostActivities]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering activities by name or detail
 *       - in: query
 *         name: search_date_activity
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter activities by activity date
 *       - in: query
 *         name: search_time_activity
 *         schema:
 *           type: string
 *           format: time
 *         description: Filter activities by activity time
 *     responses:
 *       200:
 *         description: A list of filtered activity posts
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
 *                   status_post:
 *                     type: string
 *                   creation_date:
 *                     type: string
 *                     format: date-time
 *                   store_id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/search", postActivityController.searchActiveActivities);

/**
 * @swagger
 * /postActivity/{id}:
 *   get:
 *     summary: Retrieve a single activity post by ID
 *     tags: [PostActivities]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
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
 *     security:
 *       - bearerAuth: []
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
 *                 example: "unActive"
 *               creation_date:
 *                 type: string
 *                 format: date-time
 *                 example: "07/13/2024 02:50:00"
 *               detail_post:
 *                 type: string
 *                 example: "เข้าร่วมกับเราเพื่อพบกับค่ำคืนแห่งความสนุกของเกมกระดาน"
 *               date_activity:
 *                 type: string
 *                 format: date
 *                 example: "07/15/2024"
 *               time_activity:
 *                 type: string
 *                 format: time
 *                 example: "17:00:00"
 *               post_activity_image:
 *                 type: string
 *                 example: "1cd2498d-07fa-4ea5-83ef-c71781bc8cdf.jpeg"
 *     responses:
 *       200:
 *         description: Activity post was updated successfully.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Activity post not found
 */
router.put("/:id", [passportJWT.isLogin, authentication.isStore], postActivityController.update);

/**
 * @swagger
 * /postActivity/{id}:
 *   delete:
 *     summary: Delete an activity post with id
 *     tags: [PostActivities]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Activity post not found
 */
router.delete("/:id", [passportJWT.isLogin, authentication.isAdminOrStore], postActivityController.delete);

/**
 * @swagger
 * /postActivity:
 *   delete:
 *     summary: Delete all activity posts
 *     tags: [PostActivities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All activity posts were deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All PostActivities were deleted successfully."
 *       401:
 *         description: Unauthorized
 */
router.delete("/", [passportJWT.isLogin, authentication.isAdmin], postActivityController.deleteAll);

/**
 * @swagger
 * /postActivity/store/{storeId}:
 *   get:
 *     summary: Retrieve all activity posts by store ID
 *     tags: [PostActivities]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 */
router.get("/store/:storeId", [passportJWT.isLogin, authentication.isStoreOrUser], postActivityController.findAllStorePosts);

module.exports = router;
