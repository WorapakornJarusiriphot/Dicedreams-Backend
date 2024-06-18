const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {

const Participate = sequelize.define('participate', {
  // ระบุ attribute ของตาราง
  part_Id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // สร้าง UUID แบบสุ่มเป็นค่าเริ่มต้น
    primaryKey: true, // กำหนดเป็น Primary Key
  },
  participant_apply_datetime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  participant_status: {
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
  .then(() => console.log('Table `Participate` has been created successfully.'))
  .catch(error => console.error('This error occurred', error));


return Participate;

};

