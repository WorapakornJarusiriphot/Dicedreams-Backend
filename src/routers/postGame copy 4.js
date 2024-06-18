// create a new file named postGame.js in the routers folder and add the following code:

const express = require("express");
const router = express.Router();
const postGameController = require("../controllers/postGameController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

/**
 * @swagger
 * tags:
 *   name: PostGames
 *   description: Game post management
 */

/**
 * @swagger
 * /postGame:
 *   post:
 *     summary: Create a new game
 *     tags: [PostGames]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_games:
 *                 type: string
 *               detail_post:
 *                 type: string
 *               num_people:
 *                 type: integer
 *               date_meet:
 *                 type: string
 *               time_meet:
 *                 type: string
 *               games_image:
 *                 type: string
 *               status_post:
 *                 type: string
 *               creation_date:
 *                 type: string
 *               users_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: The game was successfully created
 *       400:
 *         description: Invalid input
 */
router.post("/", [passportJWT.isLogin, authentication.isUser], postGameController.create);

/**
 * @swagger
 * /postGame:
 *   get:
 *     summary: Retrieve all games
 *     tags: [PostGames]
 *     responses:
 *       200:
 *         description: A list of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", postGameController.findAll);

/**
 * @swagger
 * /postGame/user/{userId}:
 *   get:
 *     summary: Retrieve all games by a specific user
 *     tags: [PostGames]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/user/:userId", [passportJWT.isLogin, authentication.isStoreOrUser], postGameController.findAllUserPosts);

/**
 * @swagger
 * /postGame/{id}:
 *   get:
 *     summary: Retrieve a single game by ID
 *     tags: [PostGames]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The game ID
 *     responses:
 *       200:
 *         description: A game object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Game not found
 */
router.get("/:id", [passportJWT.isLogin, authentication.isStoreOrUser], postGameController.findOne);

/**
 * @swagger
 * /postGame/{id}:
 *   put:
 *     summary: Update a game with id
 *     tags: [PostGames]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The game ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_games:
 *                 type: string
 *               detail_post:
 *                 type: string
 *               num_people:
 *                 type: integer
 *               date_meet:
 *                 type: string
 *               time_meet:
 *                 type: string
 *               games_image:
 *                 type: string
 *               status_post:
 *                 type: string
 *     responses:
 *       200:
 *         description: Game was updated successfully.
 *       404:
 *         description: Game not found
 *       400:
 *         description: Invalid input
 */
router.put("/:id", [passportJWT.isLogin, authentication.isUser], postGameController.update);

/**
 * @swagger
 * /postGame/{id}:
 *   delete:
 *     summary: Delete a game with id
 *     tags: [PostGames]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The game ID
 *     responses:
 *       200:
 *         description: Game was deleted successfully.
 *       404:
 *         description: Game not found
 */
router.delete("/:id", [passportJWT.isLogin, authentication.isUser], postGameController.delete);

/**
 * @swagger
 * /postGame:
 *   delete:
 *     summary: Delete all games
 *     tags: [PostGames]
 *     responses:
 *       200:
 *         description: All games were deleted successfully.
 */
router.delete("/", [passportJWT.isLogin, authentication.isUser], postGameController.deleteAll);

module.exports = router;
