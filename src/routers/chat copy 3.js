// create router for comment

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               datetime_chat:
 *                 type: string
 *               user_id:
 *                 type: string
 *               post_games_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: The chat was successfully created
 *       400:
 *         description: Invalid input
 */
router.post("/", [passportJWT.isLogin, authentication.isUser], chatController.create);

/**
 * @swagger
 * /chat:
 *   get:
 *     summary: Retrieve all chats
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: A list of chats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", [passportJWT.isLogin, authentication.isUser], chatController.findAll);

/**
 * @swagger
 * /chat/{id}:
 *   get:
 *     summary: Retrieve a single chat by ID
 *     tags: [Chat]
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
 *               datetime_chat:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chat was updated successfully.
 *       404:
 *         description: Chat not found
 *       400:
 *         description: Invalid input
 */
router.put("/:id", [passportJWT.isLogin, authentication.isUser], chatController.update);

/**
 * @swagger
 * /chat/{id}:
 *   delete:
 *     summary: Delete a chat with id
 *     tags: [Chat]
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
 *       404:
 *         description: Chat not found
 */
router.delete("/:id", [passportJWT.isLogin, authentication.isUser], chatController.delete);

/**
 * @swagger
 * /chat:
 *   delete:
 *     summary: Delete all chats
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: All chats were deleted successfully.
 */
router.delete("/", [passportJWT.isLogin, authentication.isUser], chatController.deleteAll);

/**
 * @swagger
 * /chat/post/{id}:
 *   get:
 *     summary: Retrieve all chats by post_games_id
 *     tags: [Chat]
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
 */
router.get("/post/:id", [passportJWT.isLogin, authentication.isUser], chatController.findAllByPostGamesId);

module.exports = router;
