const config = require("../configs/db.config")
import mysql2 from 'mysql2'; // นำเข้า mysql2

// ตรวจสอบว่าค่า config.pool ถูกกำหนดหรือไม่ หากไม่ใช่ให้ตั้งค่าเป็นค่าว่าง
config.pool = config.pool || {};

// กำหนดค่าเริ่มต้นสำหรับคุณสมบัติ pool ที่ไม่มี
const defaultPoolConfig = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
};

config.pool.max = config.pool.max || defaultPoolConfig.max;
config.pool.min = config.pool.min || defaultPoolConfig.min;
config.pool.acquire = config.pool.acquire || defaultPoolConfig.acquire;
config.pool.idle = config.pool.idle || defaultPoolConfig.idle;

// กำหนดค่าเริ่มต้นสำหรับ dialect
const defaultDialect = "mysql"; // ปรับเปลี่ยนตามความเหมาะสม
config.dialect = config.dialect || defaultDialect;

const {Sequelize} = require('sequelize');
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host:config.HOST,
    dialect: 'mysql',
    // dialectOptions:{
    //     ssl:{
    //         required:false,
    //         rejectUnauthorized:false
    //     }
    // },
    pool:{
        max:config.pool.max,
        min:config.pool.min,
        acquire:config.pool.acquire,
        idle:config.pool.idle
    }
});


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user")(sequelize, Sequelize);
db.post_activity = require("./post_activity")(sequelize, Sequelize);
db.post_games = require("./post_games")(sequelize, Sequelize);
db.chat = require("./chat")(sequelize, Sequelize);
db.participate = require("./participate")(sequelize, Sequelize);
db.store = require("./store")(sequelize, Sequelize);
db.notification = require("./notification")(sequelize, Sequelize);




module.exports = db;