//ไฟล์นี้เป็นไฟล์ config สำหรับการจัดการการ authentication ซึ่งกำหนดค่าเกี่ยวกับการเข้ารหัสและการหมดอายุของ JSON Web Token (JWT) โดยใช้ค่า environment variables
require('dotenv').config(); //เพื่อโหลดค่าจากไฟล์ .env เข้ามาใน environment variables ของ Node.js

module.exports = { //โค้ดนี้ใช้ module.exports เพื่อส่งออกค่า config ไปใช้ในส่วนอื่นของโปรเจค
    secret : process.env.JWT_SECRET, //มีการกำหนดค่าคีย์ secret สำหรับใช้ในการเข้ารหัสและถอดรหัส JWT โดยใช้ค่า process.env.JWT_SECRET ที่มาจากไฟล์ .env
    jwtExpiration: parseInt(process.env.JWT_EXPIRATION), 
    jwtRefreshExpiration: parseInt(process.env.JWT_REFRESH_EXPIRATION)
    // การกำหนดค่า jwtExpiration และ jwtRefreshExpiration จะถูกอ่านจาก environment variables process.env.JWT_EXPIRATION และ 
    // process.env.JWT_REFRESH_EXPIRATION ตามลำดับ และใช้ฟังก์ชัน parseInt เพื่อแปลงค่าจาก string เป็น integer
}

//สรุปแล้วไฟล์ auth.config.js นี้เป็นการกำหนดค่าเกี่ยวกับการจัดการ JWT โดยใช้ environment variables 
//เพื่อความยืดหยุ่นและความปลอดภัยในการจัดการค่าคอนฟิก และสามารถใช้ในส่วนอื่นของโปรเจคได้อย่างมีประสิทธิภาพ