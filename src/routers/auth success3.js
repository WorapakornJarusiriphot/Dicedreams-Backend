const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");
const db = require("../models");
const User = db.user;
const Store = db.store;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: The username or email of the user
 *                 example: "WOJA2 or Worapakorn2@gmail.com"
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: "111111"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 expires_in:
 *                   type: integer
 *                   example: 1615464848
 *                 token_type:
 *                   type: string
 *                   example: "Bearer"
 *       400:
 *         description: User Not Exist or Incorrect Password
 *       500:
 *         description: Server Error
 */
// login route
router.post("/", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // ค้นหาผู้ใช้ด้วย username หรือ email
    const user = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ username: identifier }, { email: identifier }],
      },
      include: [
        {
          model: Store,
          as: "store",
        },
      ],
    });

    if (!user) {
      return res.status(400).json({ message: "User Not Exist" });
    }

    // ตรวจสอบความถูกต้องของรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password !" });
    }

    // สร้าง JWT token พร้อมข้อมูล users_id, store_id และ role
    const token = jwt.sign(
      {
        users_id: user.users_id,
        store_id: user.store?.store_id,
        role: user.role, // เพิ่ม role เข้าไปใน token
      },
      config.secret,
      { expiresIn: 86400 } // กำหนดเวลาให้หมดอายุใน 24 ชั่วโมง
    );

    console.log("JWT Payload:", {
      users_id: user.users_id,
      store_id: user.store?.store_id,
      role: user.role, // แสดง role
    });
    console.log("JWT Token:", token);

    const expires_in = jwt.decode(token);

    return res.status(200).json({
      access_token: token,
      expires_in: expires_in.exp, // ใช้เวลาหมดอายุจาก token
      token_type: "Bearer",
    });
  } catch (e) {
    console.error("Error during login:", e);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /auth/social-login:
 *   post:
 *     summary: Social login with Google or Facebook
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: "user@example.com"
 *               first_name:
 *                 type: string
 *                 description: First name from Google/Facebook
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 description: Last name from Google/Facebook
 *                 example: "Doe"
 *               avatar:
 *                 type: string
 *                 description: URL of the profile image from Google/Facebook
 *                 example: "https://example.com/avatar.jpg"
 *               provider:
 *                 type: string
 *                 description: Provider used for social login (Google or Facebook)
 *                 example: "Google"
 *     responses:
 *       200:
 *         description: Social login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 expires_in:
 *                   type: integer
 *                   description: Expiration time in seconds
 *                   example: 3600
 *                 token_type:
 *                   type: string
 *                   example: "Bearer"
 *       400:
 *         description: Bad request (invalid data)
 *       500:
 *         description: Server error
 */
router.post("/social-login", async (req, res) => {
  const { email, first_name, last_name, avatar, provider } = req.body;

  try {
    // ตรวจสอบว่าผู้ใช้นั้นมีในฐานข้อมูลแล้วหรือไม่
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // ถ้าไม่มีในระบบ ทำการสร้างบัญชีใหม่ให้กับผู้ใช้
      user = await User.create({
        first_name,
        last_name,
        email,
        avatar,
        provider, // เก็บข้อมูลว่าผู้ใช้ล็อกอินผ่าน provider ไหน (Google/Facebook)
        role: "user", // กำหนดค่า role เริ่มต้น
      });
    }

    // สร้าง JWT Token
    const token = jwt.sign(
      {
        users_id: user.users_id,
        role: user.role,
      },
      config.secret,
      { expiresIn: config.jwtExpiration } // หมดอายุภายในเวลาที่กำหนด
    );

    // ส่ง JWT Token กลับไป
    return res.status(200).json({
      access_token: token,
      token_type: "Bearer",
      expires_in: config.jwtExpiration,
    });
  } catch (error) {
    console.error("Error during social login:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
