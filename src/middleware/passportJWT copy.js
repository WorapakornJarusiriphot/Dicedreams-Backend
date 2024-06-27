const db = require("../models/index"); // นำเข้าโมเดลฐานข้อมูล (ORM) ซึ่งใช้ในการสอบถามข้อมูลผู้ใช้จากฐานข้อมูล
const passport = require('passport'); // นำเข้า Passport.js, middleware สำหรับการรับรองความถูกต้องใน Express.js
const config = require('../configs/auth.config'); // นำเข้าไฟล์การตั้งค่าเกี่ยวกับระบบการรับรองความถูกต้อง, เช่น คีย์สำหรับการเซ็น JWT

const JwtStrategy = require('passport-jwt').Strategy, // นำเข้า Strategy สำหรับการใช้งาน JWT
    ExtractJwt = require('passport-jwt').ExtractJwt; // นำเข้าฟังก์ชันสำหรับการแยก JWT ออกจากข้อความร้องขอ
const opts = {} //สร้าง object สำหรับการตั้งค่า option ของ JwtStrategy
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // ตั้งค่าให้ Passport แยก JWT ออกจาก Authorization header ในรูปแบบ Bearer Token
opts.secretOrKey = config.secret; //ซึ่งควรเป็นค่าที่รักษาความปลอดภัยและไม่ควรเปิดเผย
//opts.issuer = 'accounts.examplesoft.com'; //10-12. บรรทัดเหล่านี้เป็นตัวอย่างที่ถูกคอมเมนต์ไว้ ซึ่งแสดงวิธีการตั้งค่า issuer และ audience สำหรับ JWT แต่ไม่ได้ถูกใช้งานในโค้ดนี้
//opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => { //13-24. ใช้ JwtStrategy กับ Passport โดยมี function ที่รับ jwt_payload (ข้อมูลที่เก็บอยู่ใน JWT) และ done (callback function) เพื่อการตรวจสอบและยืนยันผู้ใช้
    try {
        console.log(jwt_payload);
        const user = await db.user.findOne({ //ใช้ db.user.findOne สำหรับค้นหาผู้ใช้ในฐานข้อมูลที่มี id ตรงกับ jwt_payload.users_id
            where: {
            users_id: jwt_payload.users_id,
            },
        });

       if (!user) { //หากไม่พบผู้ใช้ (if (!user)), จะเรียก done พร้อมกับ error และ null (ไม่มีข้อมูลผู้ใช้)
           return done(new Error('ไม่พบผู้ใช้ในระบบ'), null);
       }

       return done(null, user); //หากพบผู้ใช้, เรียก done พร้อม null (ไม่มี error) และข้อมูลผู้ใช้ (user)

    } catch (error) {
        done(error);
    }
}));

module.exports.isLogin = passport.authenticate('jwt', { session: false }); //ส่งออก middleware ที่ใช้ Passport ในการรับรองความถูกต้องด้วย JWT โดยไม่ใช้ session (stateless)