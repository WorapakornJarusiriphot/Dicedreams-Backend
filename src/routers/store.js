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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_store:
 *                 type: string
 *                 example: "Outcast Gaming"
 *               phone_number:
 *                 type: string
 *                 example: "0623844415"
 *               house_number:
 *                 type: string
 *                 example: "43/5"
 *               province:
 *                 type: string
 *                 example: "นครปฐม"
 *               district:
 *                 type: string
 *                 example: "เทศบาลนคร"
 *               sub_district:
 *                 type: string
 *                 example: "ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง"
 *               road:
 *                 type: string
 *                 example: "ถนนราชดำเนิน (ถนนต้นสน)"
 *               alley:
 *                 type: string
 *                 example: "เทศบาล"
 *               store_image:
 *                 type: string
 *                 example: "b3afd629-c2cb-4dfe-8657-157f9a567fb8.jpeg"
 *               users_id:
 *                 type: string
 *                 example: "39fb4df4-05c4-4be4-8777-351a9bce42e5"
 *     responses:
 *       201:
 *         description: The store was successfully created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
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
 *                 properties:
 *                   store_id:
 *                     type: string
 *                   name_store:
 *                     type: string
 *                   phone_number:
 *                     type: string
 *                   house_number:
 *                     type: string
 *                   province:
 *                     type: string
 *                   district:
 *                     type: string
 *                   sub_district:
 *                     type: string
 *                   road:
 *                     type: string
 *                   alley:
 *                     type: string
 *                   store_image:
 *                     type: string
 *                   users_id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 */
router.get("/", storeController.findAll);

/**
 * @swagger
 * /store/{id}:
 *   get:
 *     summary: Retrieve a single store by ID
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The store ID
 *         example: "3594f82f-e3bf-11ee-9efc-30d0422f59c9"
 *     responses:
 *       200:
 *         description: A store object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 store_id:
 *                   type: string
 *                 name_store:
 *                   type: string
 *                 phone_number:
 *                   type: string
 *                 house_number:
 *                   type: string
 *                 province:
 *                   type: string
 *                 district:
 *                   type: string
 *                 sub_district:
 *                   type: string
 *                 road:
 *                   type: string
 *                 alley:
 *                   type: string
 *                 store_image:
 *                   type: string
 *                 users_id:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       401:
 *         description: Unauthorized
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *         example: "3594f82f-e3bf-11ee-9efc-30d0422f59c9"
 *     responses:
 *       200:
 *         description: A list of stores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   store_id:
 *                     type: string
 *                   name_store:
 *                     type: string
 *                   phone_number:
 *                     type: string
 *                   house_number:
 *                     type: string
 *                   province:
 *                     type: string
 *                   district:
 *                     type: string
 *                   sub_district:
 *                     type: string
 *                   road:
 *                     type: string
 *                   alley:
 *                     type: string
 *                   store_image:
 *                     type: string
 *                   users_id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/user/:id", [passportJWT.isLogin, authentication.isStoreOrUser], storeController.findAllByUserId);

/**
 * @swagger
 * /store/{id}:
 *   put:
 *     summary: Update a store with id
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The store ID
 *         example: "3594f82f-e3bf-11ee-9efc-30d0422f59c9"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_store:
 *                 type: string
 *                 example: "WOJA Gaming"
 *               phone_number:
 *                 type: string
 *                 example: "0818144499"
 *               house_number:
 *                 type: string
 *                 example: "43/5"
 *               province:
 *                 type: string
 *                 example: "นครปฐม"
 *               district:
 *                 type: string
 *                 example: "เทศบาลนคร"
 *               sub_district:
 *                 type: string
 *                 example: "ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง"
 *               road:
 *                 type: string
 *                 example: "ถนนราชดำเนิน (ถนนต้นสน)"
 *               alley:
 *                 type: string
 *                 example: "เทศบาล"
 *               store_image:
 *                 type: string
 *                 example: "b3afd629-c2cb-4dfe-8657-157f9a567fb8.jpeg"
 *     responses:
 *       200:
 *         description: Store was updated successfully.
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Store not found
 *       500:
 *         description: |
 *           Please enter users_id correctly. || 
 *           Cannot add or update a child row: a foreign key constraint fails (`dicedreams`.`store`, CONSTRAINT `store_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`users_id`)).
 */
router.put("/:id", [passportJWT.isLogin, authentication.isStore], storeController.update);

/**
 * @swagger
 * /store/{id}:
 *   delete:
 *     summary: Delete a store with id
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The store ID
 *         example: "3594f82f-e3bf-11ee-9efc-30d0422f59c9"
 *     responses:
 *       200:
 *         description: Store was deleted successfully.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Store not found
 */
router.delete("/:id", [passportJWT.isLogin, authentication.isAdminOrStore], storeController.delete);

/**
 * @swagger
 * /store:
 *   delete:
 *     summary: Delete all stores
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All stores were deleted successfully.
 *       401:
 *         description: Unauthorized
 */
router.delete("/", [passportJWT.isLogin, authentication.isAdminOrStore], storeController.deleteAll);

module.exports = router;
