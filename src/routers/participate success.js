const express = require("express");
const router = express.Router();
const participateController = require("../controllers/participateController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

/**
 * @swagger
 * tags:
 *   name: Participates
 *   description: Participation management
 */

/**
 * @swagger
 * /participate:
 *   post:
 *     summary: Create a new participate
 *     tags: [Participates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participant_apply_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "07/13/2024 02:50:00"
 *               participant_status:
 *                 type: string
 *                 example: "pending"
 *               user_id:
 *                 type: string
 *                 example: "217affca-a63a-429d-abed-c3c34498a1a8"
 *               post_games_id:
 *                 type: string
 *                 example: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
 *     responses:
 *       201:
 *         description: The participation was successfully created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", [passportJWT.isLogin, authentication.isUser], participateController.create);

/**
 * @swagger
 * /participate:
 *   get:
 *     summary: Retrieve all participates
 *     tags: [Participates]
 *     responses:
 *       200:
 *         description: A list of participates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", participateController.findAll);

/**
 * @swagger
 * /participate/{id}:
 *   get:
 *     summary: Retrieve a single participate by ID
 *     tags: [Participates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The participate ID
 *         example: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
 *     responses:
 *       200:
 *         description: A participate object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 participant_id:
 *                   type: string
 *                 participant_apply_datetime:
 *                   type: string
 *                   format: date-time
 *                 participant_status:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 post_games_id:
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
 *         description: Participate not found
 */
router.get("/:id", [passportJWT.isLogin, authentication.isUser], participateController.findOne);

/**
 * @swagger
 * /participate/post/{id}:
 *   get:
 *     summary: Retrieve all participates by post_games_id
 *     tags: [Participates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post_games ID
 *         example: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
 *     responses:
 *       200:
 *         description: A list of participates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   participant_id:
 *                     type: string
 *                   participant_apply_datetime:
 *                     type: string
 *                     format: date-time
 *                   participant_status:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   post_games_id:
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
router.get("/post/:id", [passportJWT.isLogin, authentication.isUser], participateController.findAllByPostGamesId);

/**
 * @swagger
 * /participate/user/{userId}:
 *   get:
 *     summary: Retrieve all participates by user_id
 *     tags: [Participates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *         example: "217affca-a63a-429d-abed-c3c34498a1a8"
 *     responses:
 *       200:
 *         description: A list of participates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   participant_id:
 *                     type: string
 *                   participant_apply_datetime:
 *                     type: string
 *                     format: date-time
 *                   participant_status:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   post_games_id:
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
router.get("/user/:userId", [passportJWT.isLogin, authentication.isUser], participateController.findAllByUserId);

/**
 * @swagger
 * /participate/{id}:
 *   put:
 *     summary: Update a participate with id
 *     tags: [Participates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The participate ID
 *         example: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participant_apply_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "07/13/2024 02:50:00"
 *               participant_status:
 *                 type: string
 *                 example: "approved"
 *               user_id:
 *                 type: string
 *                 example: "217affca-a63a-429d-abed-c3c34498a1a8"
 *               post_games_id:
 *                 type: string
 *                 example: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
 *     responses:
 *       200:
 *         description: Participate was updated successfully.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Participate not found
 */
router.put("/:id", [passportJWT.isLogin, authentication.isUser], participateController.update);

/**
 * @swagger
 * /participate/{id}:
 *   delete:
 *     summary: Delete a participate with id
 *     tags: [Participates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The participate ID
 *         example: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
 *     responses:
 *       200:
 *         description: Participate was deleted successfully.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Participate not found
 */
router.delete("/:id", [passportJWT.isLogin, authentication.isAdminOrUser], participateController.delete);

/**
 * @swagger
 * /participate:
 *   delete:
 *     summary: Delete all participates
 *     tags: [Participates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All participates were deleted successfully.
 *       401:
 *         description: Unauthorized
 */
router.delete("/", [passportJWT.isLogin, authentication.isAdminOrUser], participateController.deleteAll);

module.exports = router;
