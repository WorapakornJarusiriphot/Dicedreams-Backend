const { DataTypes } = require('sequelize');
const db = require('./index');


module.exports = (sequelize, Sequelize) =>{
  const User = sequelize.define("users", {
    users_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4, // สร้าง UUID แบบสุ่มเป็นค่าเริ่มต้น
      primaryKey: true // กำหนดเป็น Primary Key
    },
    role: {
      type: DataTypes.ENUM('user', 'admin' , 'store'), // กำหนดให้ role เป็น ENUM ที่มีค่าเป็น 'user' หรือ 'admin' หรือ 'store'
      allowNull: false,
      defaultValue: 'user' // กำหนดค่าเริ่มต้นเป็น 'user'
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    birthday: {
      type: DataTypes.DATEONLY, // ใช้ DATEONLY สำหรับวันที่โดยไม่มีเวลา
      allowNull: true // อนุญาตให้เป็น null ได้หากวันเกิดไม่จำเป็น
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true // กำหนดให้ username เป็น unique
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true // กำหนดให้ email เป็น unique
    },
    
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true // อนุญาตให้เป็น null ได้หากเบอร์โทรศัพท์ไม่จำเป็น
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true // อนุญาตให้เป็น null ได้หากเพศไม่จำเป็น
    },
    user_image: {
      type: DataTypes.STRING(255), // ใช้สำหรับเก็บ URL หรือเส้นทางของรูปภาพ
      allowNull: true // อนุญาตให้เป็น null ได้หากรูปผู้ใช้ไม่จำเป็น
    }
  },
  {
    freezeTableName: true, // ป้องกัน Sequelize จากการเปลี่ยนชื่อตารางให้เป็นพหูพจน์
    timestamps: true // หากต้องการเพิ่ม `createdAt` และ `updatedAt`
  });

  // สร้างตารางตามโมเดลหากยังไม่มี
 sequelize.sync()
.then(() => console.log('Table `users` has been created successfully.'))
.catch(error => console.error('or table already exist users'));


  return User;
};



