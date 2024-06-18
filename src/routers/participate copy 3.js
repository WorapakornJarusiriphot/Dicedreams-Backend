// create router for participate

const express = require("express");
const router = express.Router();
const participateController = require("../controllers/participateController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

// Create a new participate
router.post("/",[passportJWT.isLogin,authentication.isUser], participateController.create);

// Retrieve all participates
router.get("/", participateController.findAll);

// Retrieve a single participate with id
router.get("/:id",[passportJWT.isLogin,authentication.isUser], participateController.findOne);

// Retrieve all participates by post_games_id
router.get("/post/:id",[passportJWT.isLogin,authentication.isStoreOrUser], participateController.findAllByPostGamesId);

// In router file, add this route
router.get("/user/:userId", [passportJWT.isLogin, authentication.isStoreOrUser], participateController.findAllByUserId);

// Update a participate with id
router.put("/:id",[passportJWT.isLogin,authentication.isUser], participateController.update);

// Delete a participate with id
router.delete("/:id",[passportJWT.isLogin,authentication.isUser], participateController.delete);

// Delete all participates
router.delete("/",[passportJWT.isLogin,authentication.isUser], participateController.deleteAll);

module.exports = router;