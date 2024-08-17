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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_games:
 *                 type: string
 *                 example: "Werewolf"
 *               detail_post:
 *                 type: string
 *                 example: "เอา Werewolf ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก"
 *               num_people:
 *                 type: integer
 *                 example: 10
 *               date_meet:
 *                 type: string
 *                 format: date
 *                 example: "07/13/2024"
 *               time_meet:
 *                 type: string
 *                 format: time
 *                 example: "18:00:00"
 *               games_image:
 *                 type: string
 *                 example: "2e0c0d0a-b71c-486b-a57f-7d85b6f7d558.jpeg"
 *               status_post:
 *                 type: string
 *                 example: "active"
 *               creation_date:
 *                 type: string
 *                 format: date-time
 *                 example: "07/13/2024 02:50:00"
 *               users_id:
 *                 type: string
 *                 example: "48b0a732-b292-4cf8-bdd2-52156f177587"
 *     responses:
 *       201:
 *         description: The game was successfully created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", [passportJWT.isLogin, authentication.isUser], postGameController.create);

/**
 * @swagger
 * /postGame:
 *   get:
 *     summary: Retrieve all games
 *     tags: [PostGames]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering games by name or detail
 *         example: "Werewolf&search=Coup&search=Uno&search=Magic the gethering&search=เกมเศรษฐี&search=Warhummer 40k&search=Splendor&search=Kill Team"
 *       - in: query
 *         name: search_date_meet
 *         schema:
 *           type: string
 *           format: date
 *         description: Search term for filtering games by date meet
 *         example: "07/28/2024"
 *       - in: query
 *         name: search_time_meet
 *         schema:
 *           type: string
 *           format: time
 *         description: Search term for filtering games by time meet
 *         example: "17:00"
 *       - in: query
 *         name: search_num_people
 *         schema:
 *           type: integer
 *         description: Search term for filtering games by number of people
 *         example: 75
 *     responses:
 *       200:
 *         description: A list of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   game_id:
 *                     type: string
 *                   name_games:
 *                     type: string
 *                   detail_post:
 *                     type: string
 *                   num_people:
 *                     type: integer
 *                   date_meet:
 *                     type: string
 *                     format: date
 *                   time_meet:
 *                     type: string
 *                     format: time
 *                   games_image:
 *                     type: string
 *                   status_post:
 *                     type: string
 *                   creation_date:
 *                     type: string
 *                     format: date-time
 *                   users_id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/", postGameController.findAll);

/**
 * @swagger
 * /postGame/search:
 *   get:
 *     summary: Search for active game posts with filtering options
 *     tags: [PostGames]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering games by name or detail
 *       - in: query
 *         name: search_date_meet
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter games by meeting date
 *       - in: query
 *         name: search_time_meet
 *         schema:
 *           type: string
 *           format: time
 *         description: Filter games by meeting time
 *       - in: query
 *         name: search_num_people
 *         schema:
 *           type: integer
 *         description: Filter games by the number of participants
 *     responses:
 *       200:
 *         description: A list of filtered game posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   post_games_id:
 *                     type: string
 *                   name_games:
 *                     type: string
 *                   detail_post:
 *                     type: string
 *                   num_people:
 *                     type: integer
 *                   date_meet:
 *                     type: string
 *                     format: date
 *                   time_meet:
 *                     type: string
 *                     format: time
 *                   games_image:
 *                     type: string
 *                   status_post:
 *                     type: string
 *                   creation_date:
 *                     type: string
 *                     format: date-time
 *                   users_id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/search", postGameController.searchActiveGames);

/**
 * @swagger
 * /postGame/user/{userId}:
 *   get:
 *     summary: Retrieve all games by a specific user
 *     tags: [PostGames]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *         example: "48b0a732-b292-4cf8-bdd2-52156f177587"
 *     responses:
 *       200:
 *         description: A list of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   game_id:
 *                     type: string
 *                   name_games:
 *                     type: string
 *                   detail_post:
 *                     type: string
 *                   num_people:
 *                     type: integer
 *                   date_meet:
 *                     type: string
 *                     format: date
 *                   time_meet:
 *                     type: string
 *                     format: time
 *                   games_image:
 *                     type: string
 *                   status_post:
 *                     type: string
 *                   creation_date:
 *                     type: string
 *                     format: date-time
 *                   users_id:
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
router.get("/user/:userId", [passportJWT.isLogin, authentication.isStoreOrUser], postGameController.findAllUserPosts);

/**
 * @swagger
 * /postGame/{id}:
 *   get:
 *     summary: Retrieve a single game by ID
 *     tags: [PostGames]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The game ID
 *         example: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
 *     responses:
 *       200:
 *         description: A game object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 game_id:
 *                   type: string
 *                 name_games:
 *                   type: string
 *                 detail_post:
 *                   type: string
 *                 num_people:
 *                   type: integer
 *                 date_meet:
 *                   type: string
 *                   format: date
 *                 time_meet:
 *                   type: string
 *                   format: time
 *                 games_image:
 *                   type: string
 *                 status_post:
 *                   type: string
 *                 creation_date:
 *                   type: string
 *                   format: date-time
 *                 users_id:
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
 *         description: Game not found
 */
router.get("/:id", [passportJWT.isLogin, authentication.isStoreOrUser], postGameController.findOne);

/**
 * @swagger
 * /postGame/{id}:
 *   put:
 *     summary: Update a game with id
 *     tags: [PostGames]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The game ID
 *         example: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_games:
 *                 type: string
 *                 example: "Updated Werewolf"
 *               detail_post:
 *                 type: string
 *                 example: "Updated เอา Werewolf ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก"
 *               num_people:
 *                 type: integer
 *                 example: 25
 *               date_meet:
 *                 type: string
 *                 format: date
 *                 example: "07/15/2024"
 *               time_meet:
 *                 type: string
 *                 format: time
 *                 example: "17:00:00"
 *               games_image:
 *                 type: string
 *                 example: "0b2794e6-bdcb-419c-b8fc-52d35a88b958.jpeg"
 *               status_post:
 *                 type: string
 *                 example: "unActive"
 *     responses:
 *       200:
 *         description: Game was updated successfully.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Game not found
 */
router.put("/:id", [passportJWT.isLogin, authentication.isUser], postGameController.update);

/**
 * @swagger
 * /postGame/{id}:
 *   delete:
 *     summary: Delete a game with id
 *     tags: [PostGames]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The game ID
 *         example: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
 *     responses:
 *       200:
 *         description: Game was deleted successfully.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Game not found
 */
router.delete("/:id", [passportJWT.isLogin, authentication.isAdminOrUser], postGameController.delete);

/**
 * @swagger
 * /postGame:
 *   delete:
 *     summary: Delete all games
 *     tags: [PostGames]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All games were deleted successfully.
 *       401:
 *         description: Unauthorized
 */
router.delete("/", [passportJWT.isLogin, authentication.isAdminOrUser], postGameController.deleteAll);

module.exports = router;
