// create a new file named postGame.js in the routers folder and add the following code:

const express = require("express");
const router = express.Router();
const postGameController = require("../controllers/postGameController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

// Create a new game
router.post("/",[passportJWT.isLogin,authentication.isUser], postGameController.create);

// Retrieve all games
router.get("/", postGameController.findAll);

// Retrieve all games by a specific user
router.get("/user/:userId",[passportJWT.isLogin, authentication.isStoreOrUser], postGameController.findAllUserPosts);

// Retrieve a single game with id
router.get("/:id",[passportJWT.isLogin,authentication.isStoreOrUser], postGameController.findOne);

// Update a game with id
router.put("/:id",[passportJWT.isLogin,authentication.isUser], postGameController.update);

// Delete a game with id
router.delete("/:id",[passportJWT.isLogin,authentication.isUser], postGameController.delete);

// Delete all games
router.delete("/",[passportJWT.isLogin,authentication.isUser], postGameController.deleteAll);


module.exports = router;
