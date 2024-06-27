//ไฟล์นี้เป็นไฟล์ config สำหรับการเชื่อมต่อกับฐานข้อมูล MySQL โดยใช้ค่า environment variables เพื่อให้สามารถปรับเปลี่ยนค่าได้ง่ายและยืดหยุ่น
require("dotenv").config(); //เพื่อโหลดค่าจากไฟล์ .env เข้ามาใน environment variables ของ Node.js
const mysql2 = require("mysql2"); //เพื่อใช้ไลบรารี mysql2 สำหรับการเชื่อมต่อกับฐานข้อมูล MySQL

module.exports = { //เพื่อส่งออกค่า config ไปใช้ในส่วนอื่นของโปรเจค
  HOST: process.env.DB_HOST, //รับค่า host จาก environment variables
  USER: process.env.DB_USER, //รับค่า username จาก environment variables
  PASSWORD: process.env.DB_PASSWORD, //รับค่า password จาก environment variables
  DB: process.env.DB_NAME, //รับค่าชื่อฐานข้อมูล จาก environment variables
  dialect: process.env.DB_DIALECT, //รับค่าชนิดของฐานข้อมูล จาก environment variables
  dialectModule: mysql2, //ระบุ module ที่ใช้สำหรับการเชื่อมต่อกับฐานข้อมูล
  pool: { //กำหนดค่า pool สำหรับการจัดการ connection กับฐานข้อมูล //ค่าเหล่านี้จะถูกอ่านจาก environment variables และใช้ฟังก์ชัน parseInt เพื่อแปลงค่าจาก string เป็น integer
    max: parseInt(process.env.POOL_MAX, 10), //รับค่าจำนวน connection สูงสุด จาก environment variables // แปลงค่าเป็น integer โดยใช้ฐานสิบ
    min: parseInt(process.env.POOL_MIN, 10), //รับค่าจำนวน connection ต่ำสุด จาก environment variables // แปลง "123" จากฐานสิบเป็นฐานสิบ ได้ผลลัพธ์เป็น 123
    acquire: parseInt(process.env.POOL_ACQUIRE, 10), //รับค่าเวลาที่จะรอให้ connection ว่าง จาก environment variables
    idle: parseInt(process.env.POOL_IDLE, 10), //รับค่าเวลาที่ connection จะถูกปล่อย จาก environment variables
  },
};

//pool หมายถึงการจัดการกลุ่มการเชื่อมต่อ (connection pool) ซึ่งเป็นเทคนิคที่ใช้ในการเพิ่มประสิทธิภาพและประสิทธิผลของการเชื่อมต่อกับฐานข้อมูล 
//โดยการรักษาชุดของการเชื่อมต่อฐานข้อมูลที่สามารถนำกลับมาใช้ซ้ำได้เมื่อมีการร้องขอใหม่ แทนที่จะสร้างการเชื่อมต่อใหม่ทุกครั้งที่มีการร้องขอ