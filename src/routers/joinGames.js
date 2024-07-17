// create a new file named postGame.js in the routers folder and add the following code:

const express = require("express");
const router = express.Router();
const joinGameController = require("../controllers/joinGameController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

// Create a new game
router.post("/",[passportJWT.isLogin,authentication.isUser], joinGameController.create);

// Retrieve all games
router.get("/", joinGameController.findAll);

// Retrieve a single game with id
router.get("/:id",[passportJWT.isLogin,authentication.isUser], joinGameController.findOne);

// Update a game with id
router.put("/:id",[passportJWT.isLogin,authentication.isUser], joinGameController.update);

// Delete a game with id
router.delete("/:id",[passportJWT.isLogin,authentication.isUser], joinGameController.delete);

// Delete all games
router.delete("/",[passportJWT.isLogin,authentication.isUser], joinGameController.deleteAll);


module.exports = router;
