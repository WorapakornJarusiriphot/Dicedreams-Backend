// create config file for auth
require('dotenv').config(); // โหลดค่าจากไฟล์ .env

module.exports = {
    secret : process.env.JWT_SECRET, // ใช้ค่า secret จาก environment variable

    /* For test*/
    jwtExpiration: parseInt(process.env.JWT_EXPIRATION), // ใช้ค่า jwtExpiration จาก environment variable
    jwtRefreshExpiration: parseInt(process.env.JWT_REFRESH_EXPIRATION) // ใช้ค่า jwtRefreshExpiration จาก environment variable
}

