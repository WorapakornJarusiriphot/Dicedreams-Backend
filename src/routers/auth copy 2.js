const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");
const db = require("../models");
const User = db.user;
const Store = db.store; // ต้องมีการอ้างอิงไปยัง model Store

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
 *               password:
 *                 type: string
 *                 description: The password of the user
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
 *                 expires_in:
 *                   type: integer
 *                 token_type:
 *                   type: string
 *       400:
 *         description: User Not Exist or Incorrect Password
 *       500:
 *         description: Server Error
 */
// login route
router.post("/", async (req, res) => {
  const { identifier, password } = req.body; // เปลี่ยน `username` เป็น `identifier`

  try {
    // ค้นหาผู้ใช้ด้วยอีเมลหรือชื่อผู้ใช้
    const user = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { username: identifier }, // ค้นหาโดย `username`
          { email: identifier }, // ค้นหาโดย `email`
        ],
      },
      include: [
        {
          model: Store,
          as: "store", // อ้างอิงตามชื่อ alias ที่คุณใช้ในการผูกกับ User model
        },
      ],
    });

    if (!user) {
      return res.status(400).json({ message: "User Not Exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password !" });
    }

    // สมมติว่าคุณมีการเข้าถึง store_id จากผู้ใช้ที่ login
    // เพิ่ม store_id ลงใน payload ของ JWT ถ้ามี
    const token = jwt.sign(
      {
        users_id: user.users_id,
        store_id: user.store?.store_id, // ต้องตรวจสอบว่า store object มีอยู่จริงหรือไม่
      },
      config.secret,
      { expiresIn: 86400 }
    );

    console.log("JWT Payload:", {
      users_id: user.users_id,
      store_id: user.store_id,
    });
    console.log("JWT Token:", token);

    const expires_in = jwt.decode(token);

    return res.status(200).json({
      access_token: token,
      expires_in: expires_in.exp,
      token_type: "Bearer",
    });
  } catch (e) {
    console.error("Error during login:", e);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
