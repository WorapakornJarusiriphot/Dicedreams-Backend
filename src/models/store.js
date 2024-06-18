const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
const Store = sequelize.define('store', {
  // ระบุ attribute ของตาราง
  store_id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // สร้าง UUID แบบสุ่มเป็นค่าเริ่มต้น
    primaryKey: true // กำหนดเป็น Primary Key
  },
  name_store: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: true // อนุญาตให้เป็น null ได้หากเบอร์โทรศัพท์ไม่จำเป็น
  },
  house_number: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  alley: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  road: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  district: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  sub_district: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  province: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  store_image: {
    type: DataTypes.STRING(255), // ใช้สำหรับเก็บ URL หรือเส้นทางของรูปภาพ
    allowNull: true // อนุญาตให้เป็น null ได้หากรูปร้านค้าไม่จำเป็น
  },
  users_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users', // ชื่อตารางของ users
      key: 'users_id', // คีย์ที่ถูกอ้างอิง
    },
    allowNull: false
  }
}, {
  // ตัวเลือกเพิ่มเติม
  freezeTableName: true, // ป้องกัน Sequelize จากการเปลี่ยนชื่อตารางให้เป็นพหูพจน์
  timestamps: true // หากคุณต้องการใช้ `createdAt` และ `updatedAt`
});

// สร้างตารางตามโมเดลหากยังไม่มี
sequelize.sync()
  .then(() => console.log('Table `store` has been created successfully.'))
  .catch(error => console.error('This error occurred', error));

  return Store;
};