require("dotenv").config();
const mysql2 = require('mysql2'); // นำเข้า mysql2

module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: null,
  DB: "dicedreams",
  // dialect: "mysql",
  dialect: "mysql",
  // dialectModule: require('mysql2'),
  dialectModule: mysql2, // ใช้ตัวแปร mysql2 ที่ import มา
  pool: {
    max: 5, // จำนวนสูงสุดของ connection ใน pool
    min: 0, // จำนวนต่ำสุดของ connection ใน pool
    acquire: 30000, // ระยะเวลาสูงสุดในการพยายามเชื่อมต่อก่อนจะขึ้นข้อผิดพลาด
    idle: 10000 // ระยะเวลาสูงสุดที่ connection สามารถว่างได้ก่อนจะถูกปิด
  },
};

// console.log('Using mysql2 version:', require('mysql2').version);