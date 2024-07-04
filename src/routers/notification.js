const express = require("express");
// ไลบรารี express เป็นเฟรมเวิร์กที่นิยมใช้ในการสร้างเซิร์ฟเวอร์ HTTP ด้วย Node.js มีเครื่องมือและมิดเดิลแวร์ที่หลากหลายสำหรับการจัดการคำขอและการตอบกลับ
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');
// ไลบรารี passport และ passport-jwt ใช้ในการจัดการการตรวจสอบผู้ใช้ (authentication) โดย passport 
// เป็น middleware ที่นิยมใช้ในการตรวจสอบผู้ใช้ในแอปพลิเคชัน Node.js และ passport-jwt เป็น strategy หนึ่งที่ใช้ในการตรวจสอบ JWT

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management
 */

/**
 * @swagger
 * /notification:
 *   get:
 *     summary: Retrieve all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   message:
 *                     type: string
 *                   is_read:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/", [passportJWT.isLogin, authentication.isStoreOrUser], notificationController.findAll); // ใช้ middleware passportJWT.isLogin และ authentication.isStoreOrUser ในการตรวจสอบการเข้าสู่ระบบ และตรวจสอบว่าเป็น store หรือ user เท่านั้น ถ้าเป็น admin จะไม่สามารถดึงข้อมูล notification ได้ 

/**
 * @swagger
 * /notification:
 *   put:
 *     summary: Update a notification with id
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notification_id:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["c99f7bba-8e5f-4481-aaad-ace179f27ab2"]
 *     responses:
 *       200:
 *         description: Notification was updated successfully.
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Notification not found
 */
router.put("/", [passportJWT.isLogin, authentication.isStoreOrUser], notificationController.update); // ใช้ middleware passportJWT.isLogin และ authentication.isStoreOrUser ในการตรวจสอบการเข้าสู่ระบบ และตรวจสอบว่าเป็น store หรือ user เท่านั้น ถ้าเป็น admin จะไม่สามารถดึงข้อมูล notification ได้ 

/**
 * @swagger
 * /notification/mark-all-as-read:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully.
 */
router.put("/mark-all-as-read", [passportJWT.isLogin, authentication.isStoreOrUser], notificationController.markAllAsRead); // ใช้ middleware passportJWT.isLogin และ authentication.isStoreOrUser ในการตรวจสอบการเข้าสู่ระบบ และตรวจสอบว่าเป็น store หรือ user เท่านั้น ถ้าเป็น admin จะไม่สามารถดึงข้อมูล notification ได้

module.exports = router; // ส่งค่า router ออกไปให้ไฟล์อื่นๆ สามารถ import ไฟล์นี้ไปใช้งานได้ โดยใช้คำสั่ง require() หรือ import from ใน JavaScript หรือ TypeScript ตามลำดับ 
