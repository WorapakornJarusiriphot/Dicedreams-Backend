//ไฟล์ index.js นี้ใช้สำหรับตั้งค่าและเชื่อมต่อกับฐานข้อมูลโดยใช้ Sequelize ORM โดยทำการกำหนดค่าการเชื่อมต่อฐานข้อมูล การสร้างอินสแตนซ์ของ Sequelize 
//และการกำหนดความสัมพันธ์ระหว่างโมเดลต่างๆ นอกจากนี้ยังมีการส่งออกออบเจ็กต์ db เพื่อใช้ในส่วนอื่นของแอปพลิเคชัน
const config = require("../configs/db.config"); //เรียกใช้ไฟล์ config ที่เราสร้างไว้เพื่อใช้ในการกำหนดค่าการเชื่อมต่อฐานข้อมูล 
//โดยไฟล์นี้จะมีค่าต่างๆที่เกี่ยวข้องกับการเชื่อมต่อฐานข้อมูล เช่น ชื่อฐานข้อมูล ชื่อผู้ใช้ รหัสผ่าน โฮสต์ และอื่นๆ 

const { Sequelize } = require("sequelize"); //เรียกใช้ Sequelize จากไลบรารี sequelize เพื่อใช้ในการสร้างอินสแตนซ์ของ Sequelize 
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, { //สร้างอินสแตนซ์ของ Sequelize โดยกำหนดค่าการเชื่อมต่อฐานข้อมูล โดยใช้ค่าที่เรากำหนดไว้ในไฟล์ config 
  host: config.HOST, //โฮสต์ คือ 
  dialect: config.dialect, //เลือกใช้ฐานข้อมูลชนิดใด เช่น mysql, postgres, sqlite, mssql 
  pool: { //กำหนดค่า pool ในการเชื่อมต่อฐานข้อมูล 
    max: config.pool.max, //จำนวนการเชื่อมต่อสูงสุด 
    min: config.pool.min, //จำนวนการเชื่อมต่อต่ำสุด 
    acquire: config.pool.acquire, //เวลาที่ใช้ในการเชื่อมต่อฐานข้อมูล 
    idle: config.pool.idle, //เวลาที่เชื่อมต่อฐานข้อมูลไม่ได้ใช้งาน 
  },
});

const db = {}; //สร้างออบเจกต์ db เพื่อใช้ในการเก็บโมเดลต่างๆที่เราสร้างขึ้น 
db.Sequelize = Sequelize; //เก็บค่า Sequelize ในออบเจกต์ db เพื่อใช้ในส่วนอื่นของแอปพลิเคชัน 
db.sequelize = sequelize; //เก็บค่า sequelize ในออบเจกต์ db เพื่อใช้ในส่วนอื่นของแอปพลิเคชัน 

db.user = require("./user")(sequelize, Sequelize); //เรียกใช้โมเดล user ที่เราสร้างขึ้น โดยส่งอินสแตนซ์ของ Sequelize และ Sequelize ไปเพื่อใช้ในการสร้างโมเดล 
db.post_activity = require("./post_activity")(sequelize, Sequelize); //เรียกใช้โมเดล post_activity ที่เราสร้างขึ้น โดยส่งอินสแตนซ์ของ Sequelize และ Sequelize ไปเพื่อใช้ในการสร้างโมเดล 
db.post_games = require("./post_games")(sequelize, Sequelize); //เรียกใช้โมเดล post_games ที่เราสร้างขึ้น โดยส่งอินสแตนซ์ของ Sequelize และ Sequelize ไปเพื่อใช้ในการสร้างโมเดล
db.chat = require("./chat")(sequelize, Sequelize); //เรียกใช้โมเดล chat ที่เราสร้างขึ้น โดยส่งอินสแตนซ์ของ Sequelize และ Sequelize ไปเพื่อใช้ในการสร้างโมเดล 
db.participate = require("./participate")(sequelize, Sequelize); //เรียกใช้โมเดล participate ที่เราสร้างขึ้น โดยส่งอินสแตนซ์ของ Sequelize และ Sequelize ไปเพื่อใช้ในการสร้างโมเดล
db.store = require("./store")(sequelize, Sequelize); //เรียกใช้โมเดล store ที่เราสร้างขึ้น โดยส่งอินสแตนซ์ของ Sequelize และ Sequelize ไปเพื่อใช้ในการสร้างโมเดล 
db.notification = require("./notification")(sequelize, Sequelize); //เรียกใช้โมเดล notification ที่เราสร้างขึ้น โดยส่งอินสแตนซ์ของ Sequelize และ Sequelize ไปเพื่อใช้ในการสร้างโมเดล

db.user.hasOne(db.store, { foreignKey: "users_id", as: "store" }); //ความสัมพันธ์ของโมเดล user กับ store คือ 1 ถึง 1 โดยใช้คีย์ต่างๆที่เรากำหนดไว้ 
db.store.belongsTo(db.user, { foreignKey: "users_id" }); //ความสัมพันธ์ของโมเดล store กับ user คือ 1 ถึง 1 โดยใช้คีย์ต่างๆที่เรากำหนดไว้ 

module.exports = db; //ส่งออบเจกต์ db ออกไปให้ส่วนอื่นของแอปพลิเคชันใช้งาน 
