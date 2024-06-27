require("dotenv").config();
const mysql2 = require("mysql2"); // นำเข้า mysql2

module.exports = {
  HOST: process.env.DB_HOST, // ใช้ค่า HOST จาก environment variable
  USER: process.env.DB_USER, // ใช้ค่า USER จาก environment variable
  PASSWORD: process.env.DB_PASSWORD, // ใช้ค่า PASSWORD จาก environment variable
  DB: process.env.DB_NAME, // ใช้ค่า DB จาก environment variable
  dialect: process.env.DB_DIALECT,
  dialectModule: mysql2, // ใช้ตัวแปร mysql2 ที่ import มา
  pool: {
    max: parseInt(process.env.POOL_MAX, 10),
    min: parseInt(process.env.POOL_MIN, 10),
    acquire: parseInt(process.env.POOL_ACQUIRE, 10),
    idle: parseInt(process.env.POOL_IDLE, 10),
  },
};

// console.log('Using mysql2 version:', require('mysql2').version);