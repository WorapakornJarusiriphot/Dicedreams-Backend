// create router for participate

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
 *                 example: "2024-06-07T12:34:56Z"
 *               participant_status:
 *                 type: string
 *                 example: "pending"
 *               user_id:
 *                 type: string
 *                 example: "a4fa154b-a15a-45fe-b04f-2f9c61a8f2fa"
 *               post_games_id:
 *                 type: string
 *                 example: "d4fa154b-b15a-45fe-b04f-2f9c61a8f2fa"
 *     responses:
 *       201:
 *         description: The participation was successfully created
 *       400:
 *         description: Invalid input
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
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The participate ID
 *         example: "d4fa154b-b15a-45fe-b04f-2f9c61a8f2fa"
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
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post_games ID
 *         example: "d4fa154b-b15a-45fe-b04f-2f9c61a8f2fa"
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
 */
router.get("/post/:id", [passportJWT.isLogin, authentication.isUser], participateController.findAllByPostGamesId);

/**
 * @swagger
 * /participate/{id}:
 *   put:
 *     summary: Update a participate with id
 *     tags: [Participates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The participate ID
 *         example: "d4fa154b-b15a-45fe-b04f-2f9c61a8f2fa"
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
 *                 example: "2024-06-07T12:34:56Z"
 *               participant_status:
 *                 type: string
 *                 example: "approved"
 *               user_id:
 *                 type: string
 *                 example: "a4fa154b-a15a-45fe-b04f-2f9c61a8f2fa"
 *               post_games_id:
 *                 type: string
 *                 example: "d4fa154b-b15a-45fe-b04f-2f9c61a8f2fa"
 *     responses:
 *       200:
 *         description: Participate was updated successfully.
 *       404:
 *         description: Participate not found
 *       400:
 *         description: Invalid input
 */
router.put("/:id", [passportJWT.isLogin, authentication.isUser], participateController.update);

/**
 * @swagger
 * /participate/{id}:
 *   delete:
 *     summary: Delete a participate with id
 *     tags: [Participates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The participate ID
 *         example: "d4fa154b-b15a-45fe-b04f-2f9c61a8f2fa"
 *     responses:
 *       200:
 *         description: Participate was deleted successfully.
 *       404:
 *         description: Participate not found
 */
router.delete("/:id", [passportJWT.isLogin, authentication.isUser], participateController.delete);

/**
 * @swagger
 * /participate:
 *   delete:
 *     summary: Delete all participates
 *     tags: [Participates]
 *     responses:
 *       200:
 *         description: All participates were deleted successfully.
 */
router.delete("/", [passportJWT.isLogin, authentication.isUser], participateController.deleteAll);

module.exports = router;
