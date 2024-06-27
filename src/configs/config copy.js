require('dotenv').config(); // โหลดค่าจากไฟล์ .env

module.exports = {
    DOMAIN: process.env.DOMAIN, // ใช้ค่า DOMAIN จาก environment variable
}
