// create router for store
const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

// Create a new store
router.post("/",[passportJWT.isLogin,authentication.isUser], storeController.create);

// Retrieve all stores
router.get("/", storeController.findAll);

// Retrieve a single store with id
router.get("/:id",[passportJWT.isLogin,authentication.isStoreOrUser], storeController.findOne);

// Retrieve all stores by user_id
router.get("/user/:id",[passportJWT.isLogin,authentication.isUser], storeController.findAllByUserId);

// Update a store with id
router.put("/:id",[passportJWT.isLogin,authentication.isUser], storeController.update);

// Delete a store with id
router.delete("/:id",[passportJWT.isLogin,authentication.isUser], storeController.delete);

// Delete all stores
router.delete("/",[passportJWT.isLogin,authentication.isUser], storeController.deleteAll);

module.exports = router;