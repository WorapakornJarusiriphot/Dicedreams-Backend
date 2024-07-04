const express = require("express");
// ไลบรารี express เป็นเฟรมเวิร์กที่นิยมใช้ในการสร้างเซิร์ฟเวอร์ HTTP ด้วย Node.js มีเครื่องมือและมิดเดิลแวร์ที่หลากหลายสำหรับการจัดการคำขอและการตอบกลับ
const router = express.Router();
const bcrypt = require("bcryptjs");
//ไลบรารี bcryptjs ใช้สำหรับการแฮช (hash) และการตรวจสอบรหัสผ่าน (password verification) 
//ซึ่งช่วยเพิ่มความปลอดภัยในการจัดเก็บรหัสผ่านในฐานข้อมูลโดยการแฮชรหัสผ่านก่อนที่จะเก็บ
const jwt = require("jsonwebtoken");
// ไลบรารี jsonwebtoken ใช้ในการสร้างและตรวจสอบ JSON Web Tokens (JWT) 
// ซึ่งเป็นวิธีที่นิยมในการจัดการการยืนยันตัวตนและการอนุญาต (authentication and authorization)
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
router.post("/", async (req, res) => {  // สร้างเส้นทางสำหรับการเข้าสู่ระบบ โดยใช้เมธอด POST และเส้นทาง /auth โดยใช้ async function ในการจัดการข้อมูล 
  const { identifier, password } = req.body;  // รับค่า identifier และ password จาก req.body ที่ส่งมา 

  try { // ใช้ try-catch ในการจัดการข้อผิดพลาด
    const user = await User.findOne({ // ค้นหาผู้ใช้จากฐานข้อมูล โดยใช้ findOne ซึ่งจะค้นหาและคืนค่าผู้ใช้คนแรกที่พบ 
      where: {  // กำหนดเงื่อนไขในการค้นหา ในที่นี้คือ username หรือ email ต้องเท่ากับ identifier
        [db.Sequelize.Op.or]: [{ username: identifier }, { email: identifier }], // ใช้ Op.or ในการกำหนดเงื่อนไข OR ในการค้นหา username หรือ email ที่เท่ากับ identifier ที่รับมา 
      }, // สิ้นสุดเงื่อนไขการค้นหา
      include: [ // ใช้ include ในการรวมข้อมูลจากตารางอื่น ในที่นี้คือ รวมข้อมูลจากตาราง Store โดยใช้ as เป็น store 
        { 
          model: Store, // ระบุตารางที่ต้องการรวมข้อมูล ในที่นี้คือ Store 
          as: "store", // ระบุชื่อตารางที่ต้องการรวมข้อมูล ในที่นี้คือ store 
        }, // สิ้นสุดการรวมข้อมูลจากตาราง Store 
      ], // สิ้นสุดการรวมข้อมูล
    }); // สิ้นสุดการค้นหาผู้ใช้จากฐานข้อมูล

    if (!user) { // ถ้าไม่พบผู้ใช้ จะส่งข้อความว่า User Not Exist กลับไป 
      return res.status(400).json({ message: "User Not Exist" }); // ส่งข้อความว่า User Not Exist กลับไป 
    } // สิ้นสุดการตรวจสอบว่ามีผู้ใช้หรือไม่

    const isMatch = await bcrypt.compare(password, user.password); // ใช้ bcrypt.compare เพื่อเปรียบเทียบรหัสผ่านที่รับมากับรหัสผ่านที่เก็บในฐานข้อมูล 
    if (!isMatch) { // ถ้ารหัสผ่านไม่ตรงกัน จะส่งข้อความว่า Incorrect Password กลับไป 
      return res.status(400).json({ message: "Incorrect Password !" }); // ส่งข้อความว่า Incorrect Password กลับไป 
    } // สิ้นสุดการตรวจสอบรหัสผ่าน

    const token = jwt.sign( // ใช้ jwt.sign ในการสร้าง token โดยรับข้อมูลเป็น payload และ secret key และ expiresIn 
      { // ข้อมูลที่จะเข้ารหัสเป็น token 
        users_id: user.users_id, // รหัสผู้ใช้ 
        store_id: user.store?.store_id, // รหัสร้านค้า
      }, // สิ้นสุดข้อมูลที่จะเข้ารหัสเป็น token 
      config.secret, // กำหนด secret key ในการสร้าง token 
      { expiresIn: 86400 } // กำหนดเวลาในการใช้งาน token ในหนึ่งวัน หรือ 86400 วินาที 
    ); // สิ้นสุดการสร้าง token 

    console.log("JWT Payload:", { // แสดงข้อมูล payload ที่ใช้สร้าง token 
      users_id: user.users_id, // รหัสผู้ใช้
      store_id: user.store_id, // รหัสร้านค้า
    }); // สิ้นสุดการแสดงข้อมูล payload ที่ใช้สร้าง token
    console.log("JWT Token:", token); // แสดง token ที่สร้างขึ้น 

    const expires_in = jwt.decode(token); // ใช้ jwt.decode ในการถอดรหัส token เพื่อดูข้อมูลใน token 

    return res.status(200).json({ // ส่งข้อมูลกลับไปในรูปแบบ JSON โดยมีข้อมูลดังนี้ 
      access_token: token, // ส่ง token กลับไป 
      expires_in: expires_in.exp, // ส่งเวลาในการใช้งาน token กลับไป 
      token_type: "Bearer", // ส่งประเภทของ token กลับไป 
    }); // สิ้นสุดการส่งข้อมูลกลับไปในรูปแบบ JSON 
  } catch (e) { // ส่วนของการจัดการข้อผิดพลาด 
    console.error("Error during login:", e); // แสดงข้อผิดพลาดที่เกิดขึ้น 
    res.status(500).json({ message: "Server Error" }); // ส่งข้อความว่า Server Error กลับไป 
  } // สิ้นสุดการจัดการข้อผิดพลาด
}); // สิ้นสุดการสร้างเส้นทางสำหรับการเข้าสู่ระบบ

module.exports = router; // สิ้นสุดการส่งออกเส้นทางการเข้าสู่ระบบ 
