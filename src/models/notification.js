const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
const Notification = sequelize.define('notification', {
  // ระบุ attribute ของตาราง
  notification_id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // สร้าง UUID แบบสุ่มเป็นค่าเริ่มต้น
    primaryKey: true // กำหนดเป็น Primary Key
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false // อนุญาตให้เป็น null ได้หากเบอร์โทรศัพท์ไม่จำเป็น
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users', // ชื่อตารางของ users
      key: 'users_id', // คีย์ที่ถูกอ้างอิง
    },
    allowNull: false
  },
  entity_id: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  // ตัวเลือกเพิ่มเติม
  freezeTableName: true, // ป้องกัน Sequelize จากการเปลี่ยนชื่อตารางให้เป็นพหูพจน์
  timestamps: true // หากคุณต้องการใช้ `createdAt` และ `updatedAt`
});

// สร้างตารางตามโมเดลหากยังไม่มี
sequelize.sync()
  .then(() => console.log('Table `Notification` has been created successfully.'))
  .catch(error => console.error('This error occurred', error));

  return Notification;
};