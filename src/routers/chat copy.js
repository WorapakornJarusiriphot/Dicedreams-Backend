// create router for comment

const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

// Create a new comment
router.post("/",[passportJWT.isLogin,authentication.isUser], chatController.create);

// Retrieve all comments
router.get("/",[passportJWT.isLogin,authentication.isUser], chatController.findAll);

// Retrieve a single comment with id
router.get("/:id",[passportJWT.isLogin,authentication.isUser], chatController.findOne);

// Update a comment with id
router.put("/:id",[passportJWT.isLogin,authentication.isUser], chatController.update);

// Delete a comment with id
router.delete("/:id",[passportJWT.isLogin,authentication.isUser], chatController.delete);

// Delete all comments
router.delete("/",[passportJWT.isLogin,authentication.isUser], chatController.deleteAll);

// Retrieve all comments by post_games_id
router.get("/post/:id",[passportJWT.isLogin,authentication.isUser], chatController.findAllByPostGamesId);

module.exports = router;