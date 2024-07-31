const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passportJWT = require('../middleware/passportJWT');
const authentication = require("../middleware/authentication");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "Worapakorn6"
 *               last_name:
 *                 type: string
 *                 example: "Jarusiriphot6"
 *               username:
 *                 type: string
 *                 example: "WOJA6"
 *               password:
 *                 type: string
 *                 example: "111111"
 *               email:
 *                 type: string
 *                 example: "Worapakorn6@gmail.com"
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: "03/17/2003"
 *               phone_number:
 *                 type: string
 *                 example: "0623844415"
 *               gender:
 *                 type: string
 *                 example: "ชาย"
 *               user_image:
 *                 type: string
 *                 example: "a84f9cd9-3c1d-4cb2-ba88-a188c298d119.jpeg"
 *     responses:
 *       201:
 *         description: The user was successfully created
 *       400:
 *         description: Invalid input || Username or email already exists
 *       500:
 *         description: Some error occurred while creating the User.
 */
router.post('/', userController.create);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   users_id:
 *                     type: string
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   birthday:
 *                     type: string
 *                     format: date
 *                   phone_number:
 *                     type: string
 *                   gender:
 *                     type: string
 *                   user_image:
 *                     type: string
 *                   bio:
 *                     type: string
 */
router.get('/', userController.findAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *         example: "39fb4df4-05c4-4be4-8777-351a9bce42e5"
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users_id:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 birthday:
 *                   type: string
 *                   format: date
 *                 phone_number:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 user_image:
 *                   type: string
 *                 bio:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/:id', [passportJWT.isLogin], userController.findOne);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user with id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *         example: "39fb4df4-05c4-4be4-8777-351a9bce42e5"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "Worapakorn1000"
 *               last_name:
 *                 type: string
 *                 example: "Jarusiriphot1000"
 *               username:
 *                 type: string
 *                 example: "WOJA1000"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               email:
 *                 type: string
 *                 example: "Worapakorn1000@gmail.com"
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: "04/13/2006"
 *               phone_number:
 *                 type: string
 *                 example: "0818144499"
 *               gender:
 *                 type: string
 *                 example: "หญิง"
 *               role:
 *                 type: string
 *                 enum: [user, admin, store]
 *                 example: "store"
 *               user_image:
 *                 type: string
 *                 example: "b3afd629-c2cb-4dfe-8657-157f9a567fb8.jpeg"
 *               bio:
 *                 type: string
 *                 example: "รักการเล่นบอร์ดเกมและชอบพบปะผู้คนใหม่ๆ มาร่วมสนุกกันนะ! ,มาเล่นบอร์ดเกมกับเรา ทุกคนจะได้พบเพื่อนใหม่และสนุกไปด้วยกัน! ,ความสนุกของบอร์ดเกมคือการสร้างความสัมพันธ์ที่ดี มาร่วมเป็นส่วนหนึ่งของเรา! ,เป็นนักสะสมบอร์ดเกมที่หลงใหลในทุกประเภท พร้อมแบ่งปันความสนุกกับทุกคน! ,การเล่นบอร์ดเกมคือวิธีที่ดีที่สุดในการผ่อนคลายและเชื่อมโยงกับผู้คน มาเล่นกันเถอะ! ,ชอบการวางกลยุทธ์และความท้าทายของบอร์ดเกม มาร่วมแข่งขันและสนุกไปด้วยกัน! ,ร่วมสนุกกับการเล่นบอร์ดเกมในบรรยากาศที่เป็นกันเองและเต็มไปด้วยเสียงหัวเราะ! ,ไม่ว่าคุณจะเป็นมือใหม่หรือมือโปร ก็สามารถมาร่วมเล่นบอร์ดเกมกับเราได้ทุกครั้ง! ,ชื่นชอบการสร้างความทรงจำที่ดีผ่านการเล่นบอร์ดเกม มาเป็นส่วนหนึ่งของประสบการณ์นี้กัน! ,บอร์ดเกมทำให้เราทุกคนใกล้ชิดกันมากขึ้น มาเล่นและสนุกไปพร้อมๆ กัน!"
 *     responses:
 *       200:
 *         description: User was updated successfully.
 *       400:
 *         description: Invalid input || Username or email already exists
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Some error occurred while creating the User.
 */
router.put('/:id', [passportJWT.isLogin, authentication.isAdminOrUser], userController.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user with id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *         example: "39fb4df4-05c4-4be4-8777-351a9bce42e5"
 *     responses:
 *       200:
 *         description: User was deleted successfully.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/:id', [passportJWT.isLogin, authentication.isAdmin], userController.delete);

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users were deleted successfully.
 *       401:
 *         description: Unauthorized
 */
router.delete('/', [passportJWT.isLogin, authentication.isAdmin], userController.deleteAll);

module.exports = router;
