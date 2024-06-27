//ไฟล์นี้เป็นไฟล์ config สำหรับการกำหนดค่าโดเมน (DOMAIN) ของโปรเจค โดยใช้ค่า environment variables เพื่อให้สามารถปรับเปลี่ยนค่าได้ง่ายและยืดหยุ่น
require('dotenv').config(); //เพื่อโหลดค่าจากไฟล์ .env เข้ามาใน environment variables ของ Node.js

module.exports = { //โค้ดนี้ใช้ module.exports เพื่อส่งออกค่า config ไปใช้ในส่วนอื่นของโปรเจค
    DOMAIN: process.env.DOMAIN, //มีการกำหนดค่า DOMAIN โดยใช้ค่า process.env.DOMAIN ที่มาจากไฟล์ .env
}
