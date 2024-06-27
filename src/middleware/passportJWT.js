// ไฟล์นี้เป็นมิดเดิลแวร์สำหรับการตรวจสอบการเข้าสู่ระบบ (authentication) โดยใช้ JWT (JSON Web Token) และไลบรารี passport ซึ่งช่วยในการจัดการการตรวจสอบผู้ใช้ในแอปพลิเคชัน Express.js
const db = require("../models/index");
const passport = require('passport');
const config = require('../configs/auth.config'); 

const JwtStrategy = require('passport-jwt').Strategy,   //เรียกใช้งาน Strategy ของ passport-jwt จากไลบรารี passport-jwt
    ExtractJwt = require('passport-jwt').ExtractJwt; //เรียกใช้งาน ExtractJwt ของ passport-jwt จากไลบรารี passport-jwt
const opts = {} //สร้างตัวแปร opts เพื่อใช้ในการกำหนดค่าต่างๆ ของการตรวจสอบ JWT
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //jwtFromRequest: ระบุวิธีการดึง JWT จากคำขอ HTTP ในกรณีนี้คือการดึงจากหัวข้อของการยืนยันตัวตนในรูปแบบ Bearer token
opts.secretOrKey = config.secret; //secretOrKey: กำหนดความลับที่ใช้ในการตรวจสอบความถูกต้องของ JWT ซึ่งนำเข้าจากไฟล์ auth.config

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => { //สร้าง Strategy ใหม่โดยใช้ opts ที่กำหนดไว้ข้างต้น และรับข้อมูลของ payload และ callback function ที่รับพารามิเตอร์ jwt_payload และ done
    try { //ใช้ try-catch เพื่อจัดการข้อผิดพลาดที่อาจเกิดขึ้น
        console.log(jwt_payload); //แสดงข้อมูลของ payload ใน console
        const user = await db.user.findOne({ //ค้นหาข้อมูลผู้ใช้จากฐานข้อมูล
            where: { //กำหนดเงื่อนไขในการค้นหา
            users_id: jwt_payload.users_id, //ค้นหาโดยใช้ users_id จาก payload ที่ส่งมา 
            },
        });

       if (!user) { //ถ้าไม่พบผู้ใช้ในระบบ
           return done(new Error('ไม่พบผู้ใช้ในระบบ'), null); //ส่งข้อความแจ้งเตือนผู้ใช้ว่าไม่พบผู้ใช้ในระบบ และส่งค่า null กลับไป 
       }

       return done(null, user); //ส่งค่า null และข้อมูลของผู้ใช้กลับไป 

    } catch (error) {   //ถ้าเกิดข้อผิดพลาด
        done(error); //ส่งข้อผิดพลาดกลับไป 
    }
}));

module.exports.isLogin = passport.authenticate('jwt', { session: false }); 
//สร้าง middleware ใหม่ที่ใช้ในการตรวจสอบการเข้าสู่ระบบ โดยใช้การตรวจสอบ JWT และใช้ Strategy ที่ชื่อว่า jwt ที่สร้างขึ้นในบรรทัดที่ 15 และกำหนด session เป็น false