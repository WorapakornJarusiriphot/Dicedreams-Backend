// create config file for auth
//ไฟล์นี้เป็นไฟล์ config สำหรับการจัดการการ authentication ซึ่งกำหนดค่าเกี่ยวกับการเข้ารหัสและการหมดอายุของ JSON Web Token (JWT) ที่ใช้ในการยืนยันตัวตนของผู้ใช้
module.exports = { //โค้ดนี้ใช้ module.exports เพื่อส่งออกค่า config ไปใช้ในส่วนอื่นของโปรเจค
    secret : "worapakorn-secret-key", //มีการกำหนดคีย์ secret สำหรับใช้ในการเข้ารหัสและถอดรหัส JWT โดยใช้ค่า "worapakorn-secret-key
    
    // โค้ดนี้กำหนดค่าการหมดอายุของ JWT สองแบบคือ jwtExpiration และ jwtRefreshExpiration
    // jwtExpiration:3600, // 1 hour //มีการคอมเมนต์ค่า jwtExpiration:3600 ที่หมายถึง JWT จะหมดอายุในเวลา 1 ชั่วโมง
    // jwtRefreshExpiration:86400, //24 hours //jwtRefreshExpiration:86400 ที่หมายถึง JWT จะหมดอายุในเวลา 24 ชั่วโมง
    
    /* For test*/
    jwtExpiration:60, // 1 minute //ในส่วนการทดสอบ มีการกำหนดค่า jwtExpiration เป็น 60 วินาที หรือ 1 นาที 
    jwtRefreshExpiration:120, //2 minute //และ jwtRefreshExpiration เป็น 120 วินาที หรือ 2 นาที เพื่อให้สามารถทดสอบได้ง่ายขึ้นโดยไม่ต้องรอนาน
   
}

// สรุปแล้วไฟล์ auth.config.js นี้เป็นการกำหนดค่าเกี่ยวกับการจัดการ JWT ทั้งในส่วนของการเข้ารหัสและการกำหนดเวลาในการหมดอายุของ token 
// เพื่อให้สามารถใช้ในส่วนอื่นของโปรเจคได้อย่างง่ายดายและมีประสิทธิภาพ