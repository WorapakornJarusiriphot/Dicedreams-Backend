const express = require("express");
// ไลบรารี express เป็นเฟรมเวิร์กที่นิยมใช้ในการสร้างเซิร์ฟเวอร์ HTTP ด้วย Node.js มีเครื่องมือและมิดเดิลแวร์ที่หลากหลายสำหรับการจัดการคำขอและการตอบกลับ
const router = express.Router();
const participateController = require("../controllers/participateController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');
// ไลบรารี passport และ passport-jwt ใช้ในการจัดการการตรวจสอบผู้ใช้ (authentication) โดย passport 
// เป็น middleware ที่นิยมใช้ในการตรวจสอบผู้ใช้ในแอปพลิเคชัน Node.js และ passport-jwt เป็น strategy หนึ่งที่ใช้ในการตรวจสอบ JWT

/**
 * @swagger
 * tags:
 *   name: Participates
 *   description: Participation management
 */

/**
 * @swagger
 * /participate:
 *   post:
 *     summary: Create a new participate
 *     tags: [Participates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participant_apply_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-06-07T12:34:56Z"
 *               participant_status:
 *                 type: string
 *                 example: "pending"
 *               user_id:
 *                 type: string
 *                 example: "217affca-a63a-429d-abed-c3c34498a1a8"
 *               post_games_id:
 *                 type: string
 *                 example: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
 *     responses:
 *       201:
 *         description: The participation was successfully created
 *       400:
 *         description: Invalid input
 */
router.post("/", [passportJWT.isLogin, authentication.isUser], participateController.create); // สร้างการเข้าร่วม (participate) ใหม่ โดยต้อง login และเป็น user เท่านั้น ถ้าเป็น store หรือ admin จะไม่สามารถสร้าง participate ได้ 

/**
 * @swagger
 * /participate:
 *   get:
 *     summary: Retrieve all participates
 *     tags: [Participates]
 *     responses:
 *       200:
 *         description: A list of participates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", participateController.findAll); // ดึงข้อมูล participate ทั้งหมด ไม่ต้อง login ก็สามารถดึงข้อมูลได้ 

/**
 * @swagger
 * /participate/{id}:
 *   get:
 *     summary: Retrieve a single participate by ID
 *     tags: [Participates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The participate ID
 *         example: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
 *     responses:
 *       200:
 *         description: A participate object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 participant_id:
 *                   type: string
 *                 participant_apply_datetime:
 *                   type: string
 *                   format: date-time
 *                 participant_status:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 post_games_id:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Participate not found
 */
router.get("/:id", [passportJWT.isLogin, authentication.isUser], participateController.findOne); // ดึงข้อมูล participate ตาม id โดยต้อง login และเป็น user เท่านั้น ถ้าเป็น store หรือ admin จะไม่สามารถดึงข้อมูล participate ได้ 

/**
 * @swagger
 * /participate/post/{id}:
 *   get:
 *     summary: Retrieve all participates by post_games_id
 *     tags: [Participates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post_games ID
 *         example: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
 *     responses:
 *       200:
 *         description: A list of participates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   participant_id:
 *                     type: string
 *                   participant_apply_datetime:
 *                     type: string
 *                     format: date-time
 *                   participant_status:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   post_games_id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/post/:id", [passportJWT.isLogin, authentication.isUser], participateController.findAllByPostGamesId); // ดึงข้อมูล participate ตาม post_games_id โดยต้อง login และเป็น user เท่านั้น ถ้าเป็น store หรือ admin จะไม่สามารถดึงข้อมูล participate ได้ 

/**
 * @swagger
 * /participate/{id}:
 *   put:
 *     summary: Update a participate with id
 *     tags: [Participates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The participate ID
 *         example: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participant_apply_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-06-07T12:34:56Z"
 *               participant_status:
 *                 type: string
 *                 example: "approved"
 *               user_id:
 *                 type: string
 *                 example: "217affca-a63a-429d-abed-c3c34498a1a8"
 *               post_games_id:
 *                 type: string
 *                 example: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
 *     responses:
 *       200:
 *         description: Participate was updated successfully.
 *       404:
 *         description: Participate not found
 *       400:
 *         description: Invalid input
 */
router.put("/:id", [passportJWT.isLogin, authentication.isUser], participateController.update); // แก้ไขข้อมูล participate ตาม id โดยต้อง login และเป็น user เท่านั้น ถ้าเป็น store หรือ admin จะไม่สามารถแก้ไขข้อมูล participate ได้ 

/**
 * @swagger
 * /participate/{id}:
 *   delete:
 *     summary: Delete a participate with id
 *     tags: [Participates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The participate ID
 *         example: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
 *     responses:
 *       200:
 *         description: Participate was deleted successfully.
 *       404:
 *         description: Participate not found
 */
router.delete("/:id", [passportJWT.isLogin, authentication.isAdminOrUser], participateController.delete); // ลบข้อมูล participate ตาม id โดยต้อง login และเป็น user เท่านั้น ถ้าเป็น store หรือ admin จะไม่สามารถลบข้อมูล participate ได้

/**
 * @swagger
 * /participate:
 *   delete:
 *     summary: Delete all participates
 *     tags: [Participates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All participates were deleted successfully.
 */
router.delete("/", [passportJWT.isLogin, authentication.isAdminOrUser], participateController.deleteAll); // ลบข้อมูล participate ทั้งหมด โดยต้อง login และเป็น user เท่านั้น ถ้าเป็น store หรือ admin จะไม่สามารถลบข้อมูล participate ได้

module.exports = router; // export router ออกไปใช้งานที่ไฟล์อื่น ๆ ได้ โดยที่ไฟล์อื่น ๆ สามารถเรียกใช้ router นี้ได้ และใช้งานได้ทุก method ที่อยู่ใน router นี้ 
