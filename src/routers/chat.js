const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat management
 */

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Create a new chat
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "ผมไม่มีภาคเสริมผมไปเล่นด้วยได้หรือป่าว"
 *               datetime_chat:
 *                 type: string
 *                 format: date-time
 *                 example: "07/13/2024 02:50:00"
 *               user_id:
 *                 type: string
 *                 example: "3cb8cba9-874c-482e-bb5e-c5d523d77b7a"
 *               post_games_id:
 *                 type: string
 *                 example: "e2743413-ac96-4884-b645-9ee77b43d571"
 *     responses:
 *       201:
 *         description: The chat was successfully created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", [passportJWT.isLogin, authentication.isUser], chatController.create);

/**
 * @swagger
 * /chat:
 *   get:
 *     summary: Retrieve all chats
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of chats
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
 *                   datetime_chat:
 *                     type: string
 *                     format: date-time
 *                   user_id:
 *                     type: string
 *                   post_games_id:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/", [passportJWT.isLogin, authentication.isUser], chatController.findAll);

/**
 * @swagger
 * /chat/{id}:
 *   get:
 *     summary: Retrieve a single chat by ID
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The chat ID
 *     responses:
 *       200:
 *         description: A chat object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 message:
 *                   type: string
 *                 datetime_chat:
 *                   type: string
 *                   format: date-time
 *                 user_id:
 *                   type: string
 *                 post_games_id:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Chat not found
 */
router.get("/:id", [passportJWT.isLogin, authentication.isUser], chatController.findOne);

/**
 * @swagger
 * /chat/{id}:
 *   put:
 *     summary: Update a chat with id
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The chat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "อัปเดตข้อความแชทแล้วผมไม่มีภาคเสริมผมไปเล่นด้วยได้หรือป่าว"
 *               datetime_chat:
 *                 type: string
 *                 format: date-time
 *                 example: "07/14/2567 02:50:00"
 *     responses:
 *       200:
 *         description: Chat was updated successfully.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Chat not found
 */
router.put("/:id", [passportJWT.isLogin, authentication.isUser], chatController.update);

/**
 * @swagger
 * /chat/{id}:
 *   delete:
 *     summary: Delete a chat with id
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The chat ID
 *     responses:
 *       200:
 *         description: Chat was deleted successfully.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Chat not found
 */
router.delete("/:id", [passportJWT.isLogin, authentication.isAdminOrUser], chatController.delete);

/**
 * @swagger
 * /chat:
 *   delete:
 *     summary: Delete all chats
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All chats were deleted successfully.
 *       401:
 *         description: Unauthorized
 */
router.delete("/", [passportJWT.isLogin, authentication.isAdminOrUser], chatController.deleteAll);

/**
 * @swagger
 * /chat/post/{id}:
 *   get:
 *     summary: Retrieve all chats by post_games_id
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post_games ID
 *     responses:
 *       200:
 *         description: A list of chats by post_games_id
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
 *                   datetime_chat:
 *                     type: string
 *                     format: date-time
 *                   user_id:
 *                     type: string
 *                   post_games_id:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/post/:id", [passportJWT.isLogin, authentication.isUser], chatController.findAllByPostGamesId);

/**
 * @swagger
 * /chat/user/{user_id}:
 *   get:
 *     summary: Retrieve all chats by user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of chats by user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "217affca-a63a-429d-abed-c3c34498a1a8"
 *                   message:
 *                     type: string
 *                   datetime_chat:
 *                     type: string
 *                     format: date-time
 *                   user_id:
 *                     type: string
 *                   post_games_id:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/user/:user_id", [passportJWT.isLogin, authentication.isUser], chatController.findAllByUser);

module.exports = router;
