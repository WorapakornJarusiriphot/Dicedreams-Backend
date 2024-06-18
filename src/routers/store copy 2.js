// create router for store
const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

/**
 * @swagger
 * tags:
 *   name: Store
 *   description: Store management
 */

/**
 * @swagger
 * /store:
 *   post:
 *     summary: Create a new store
 *     tags: [Store]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_store:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               house_number:
 *                 type: string
 *               province:
 *                 type: string
 *               district:
 *                 type: string
 *               sub_district:
 *                 type: string
 *               road:
 *                 type: string
 *               alley:
 *                 type: string
 *               store_image:
 *                 type: string
 *               users_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: The store was successfully created
 *       400:
 *         description: Invalid input
 */
router.post("/", [passportJWT.isLogin, authentication.isUser], storeController.create);

/**
 * @swagger
 * /store:
 *   get:
 *     summary: Retrieve all stores
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: A list of stores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", storeController.findAll);

/**
 * @swagger
 * /store/{id}:
 *   get:
 *     summary: Retrieve a single store by ID
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The store ID
 *     responses:
 *       200:
 *         description: A store object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Store not found
 */
router.get("/:id", [passportJWT.isLogin, authentication.isStoreOrUser], storeController.findOne);

/**
 * @swagger
 * /store/user/{id}:
 *   get:
 *     summary: Retrieve all stores by user_id
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of stores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/user/:id", [passportJWT.isLogin, authentication.isUser], storeController.findAllByUserId);

/**
 * @swagger
 * /store/{id}:
 *   put:
 *     summary: Update a store with id
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The store ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_store:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               house_number:
 *                 type: string
 *               province:
 *                 type: string
 *               district:
 *                 type: string
 *               sub_district:
 *                 type: string
 *               road:
 *                 type: string
 *               alley:
 *                 type: string
 *               store_image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Store was updated successfully.
 *       404:
 *         description: Store not found
 *       400:
 *         description: Invalid input
 */
router.put("/:id", [passportJWT.isLogin, authentication.isUser], storeController.update);

/**
 * @swagger
 * /store/{id}:
 *   delete:
 *     summary: Delete a store with id
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The store ID
 *     responses:
 *       200:
 *         description: Store was deleted successfully.
 *       404:
 *         description: Store not found
 */
router.delete("/:id", [passportJWT.isLogin, authentication.isUser], storeController.delete);

/**
 * @swagger
 * /store:
 *   delete:
 *     summary: Delete all stores
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: All stores were deleted successfully.
 */
router.delete("/", [passportJWT.isLogin, authentication.isUser], storeController.deleteAll);

module.exports = router;
