const { DataTypes } = require("sequelize");
const { generateRandomId } = require("../utils/generateRandomId"); // เรียกใช้ function generateRandomId จากไฟล์ generateRandomId.js

module.exports = (sequelize, Sequelize) => {

const Chat = sequelize.define('chat', {
  // ระบุ attribute ของตาราง
  chat_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    defaultValue: generateRandomId // ใช้ function generateRandomId เพื่อสร้างค่าเริ่มต้น
  },
  message: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  datetime_chat: {
    type: DataTypes.STRING(20), // อาจจะเป็น DataTypes.DATE ถ้าคุณต้องการเก็บวันที่จริง
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'users_id',
    },
    allowNull: false
  },
  post_games_id: {
    type: DataTypes.UUID,
    references: {
      model: 'post_games',
      key: 'post_games_id',
    },
    allowNull: false
  }
}, {
  // ตัวเลือกเพิ่มเติม
  freezeTableName: true, // ป้องกัน Sequelize จากการเปลี่ยนชื่อตารางให้เป็นพหูพจน์
  timestamps: true // เพิ่ม `createdAt` และ `updatedAt` โดยอัตโนมัติ
});

// สร้างตารางตามโมเดลหากยังไม่มี
sequelize.sync()
  .then(() => console.log('Table `chat` has been created successfully.'))
  .catch(error => console.error('This error occurred', error));


return Chat;

};

