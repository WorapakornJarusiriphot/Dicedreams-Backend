//ไฟล์นี้เป็นการกำหนดโมเดล User สำหรับใช้กับ Sequelize ORM ซึ่งเป็นเครื่องมือในการเชื่อมต่อและจัดการฐานข้อมูลในแอปพลิเคชัน Node.js 
//โมเดล User ถูกกำหนดให้สอดคล้องกับตาราง users ในฐานข้อมูล
const { DataTypes } = require("sequelize"); //เรียกใช้งาน DataTypes จาก sequelize เพื่อใช้ในการกำหนดชนิดของข้อมูลในฐานข้อมูล 
const db = require("./index"); //เรียกใช้งานไฟล์ index.js ในโฟลเดอร์ models เพื่อเชื่อมต่อฐานข้อมูล 

module.exports = (sequelize, Sequelize) => { //สร้างโมเดล User โดยรับ sequelize และ Sequelize เข้ามาเพื่อใช้ในการกำหนดโมเดล 
  const User = sequelize.define( //กำหนดโมเดล User โดยใช้ sequelize.define ซึ่งรับพารามิเตอร์สองตัว คือชื่อของโมเดลและโครงสร้างของโมเดล 
    "users", //ชื่อของโมเดล ซึ่งในที่นี้คือ users ซึ่งเป็นชื่อของตารางในฐานข้อมูล 
    {
      users_id: { //กำหนดโครงสร้างของโมเดล โดยกำหนดชื่อและชนิดของข้อมูลในฐานข้อมูล 
        type: DataTypes.UUID, //กำหนดชนิดของข้อมูลเป็น UUID ซึ่งเป็นชนิดข้อมูลที่เหมาะสำหรับการเก็บค่าของ ID ในฐานข้อมูล 
        defaultValue: Sequelize.UUIDV4, //กำหนดค่าเริ่มต้นของ UUID ให้เป็น UUIDV4 ซึ่งเป็นการสร้างค่า UUID แบบสุ่ม 
        primaryKey: true, //กำหนดให้เป็น Primary Key ของตาราง 
      },
      role: { //กำหนดชื่อและชนิดของข้อมูลในฐานข้อมูล 
        type: DataTypes.ENUM("user", "admin", "store"), //กำหนดชนิดของข้อมูลเป็น ENUM ซึ่งเป็นชนิดข้อมูลที่เก็บค่าจากกลุ่มที่กำหนดไว้เท่านั้น 
        allowNull: false, //กำหนดให้ไม่สามารถเป็นค่าว่างได้ 
        defaultValue: "user", //กำหนดค่าเริ่มต้นของ ENUM ให้เป็น user 
      },
      first_name: { //กำหนดชื่อและชนิดของข้อมูลในฐานข้อมูล 
        type: DataTypes.STRING(50), //กำหนดชนิดของข้อมูลเป็น STRING ซึ่งเป็นชนิดข้อมูลที่เก็บข้อความ 
        allowNull: false, //กำหนดให้ไม่สามารถเป็นค่าว่างได้ 
      },
      last_name: { //กำหนดชื่อและชนิดของข้อมูลในฐานข้อมูล 
        type: DataTypes.STRING(50), //กำหนดชนิดของข้อมูลเป็น STRING ซึ่งเป็นชนิดข้อมูลที่เก็บข้อความ
        allowNull: false, //กำหนดให้ไม่สามารถเป็นค่าว่างได้ 
      },
      birthday: { //กำหนดชื่อและชนิดของข้อมูลในฐานข้อมูล 
        type: DataTypes.DATEONLY, //กำหนดชนิดของข้อมูลเป็น DATEONLY ซึ่งเป็นชนิดข้อมูลที่เก็บวันที่โดยไม่รวมเวลา 
        allowNull: true, //กำหนดให้สามารถเป็นค่าว่างได้ 
      },
      username: { //กำหนดชื่อและชนิดของข้อมูลในฐานข้อมูล 
        type: DataTypes.STRING(50), //กำหนดชนิดของข้อมูลเป็น STRING ซึ่งเป็นชนิดข้อมูลที่เก็บข้อความ 
        allowNull: false, //กำหนดให้ไม่สามารถเป็นค่าว่างได้ 
        unique: true, //กำหนดให้เป็นค่าที่ไม่ซ้ำกัน 
      },
      password: { //กำหนดชื่อและชนิดของข้อมูลในฐานข้อมูล 
        type: DataTypes.STRING(255), //กำหนดชนิดของข้อมูลเป็น STRING ซึ่งเป็นชนิดข้อมูลที่เก็บข้อความ 
        allowNull: false, //กำหนดให้ไม่สามารถเป็นค่าว่างได้ 
      },
      email: { //กำหนดชื่อและชนิดของข้อมูลในฐานข้อมูล 
        type: DataTypes.STRING(255), //กำหนดชนิดของข้อมูลเป็น STRING ซึ่งเป็นชนิดข้อมูลที่เก็บข้อความ 
        allowNull: false, //กำหนดให้ไม่สามารถเป็นค่าว่างได้ 
        unique: true, //กำหนดให้เป็นค่าที่ไม่ซ้ำกัน 
      },

      phone_number: { //กำหนดชื่อและชนิดของข้อมูลในฐานข้อมูล 
        type: DataTypes.STRING(20), //กำหนดชนิดของข้อมูลเป็น STRING ซึ่งเป็นชนิดข้อมูลที่เก็บข้อความ
        allowNull: true, //กำหนดให้สามารถเป็นค่าว่างได้ 
      },
      gender: { //กำหนดชื่อและชนิดของข้อมูลในฐานข้อมูล 
        type: DataTypes.STRING(10), //กำหนดชนิดของข้อมูลเป็น STRING ซึ่งเป็นชนิดข้อมูลที่เก็บข้อความ 
        allowNull: true, //กำหนดให้สามารถเป็นค่าว่างได้ 
      },
      user_image: { //กำหนดชื่อและชนิดของข้อมูลในฐานข้อมูล 
        type: DataTypes.STRING(255), //กำหนดชนิดของข้อมูลเป็น STRING ซึ่งเป็นชนิดข้อมูลที่เก็บข้อความ 
        allowNull: true, //กำหนดให้สามารถเป็นค่าว่างได้ 
      },
    },
    {
      freezeTableName: true, //กำหนดให้ชื่อของตารางในฐานข้อมูลเป็น users ตามที่กำหนดไว้ 
      timestamps: true, //กำหนดให้มีฟิลด์ createdAt และ updatedAt ในการบันทึกเวลาที่สร้างและแก้ไขข้อมูล 
    }
  );

  sequelize //สร้างตาราง users ในฐานข้อมูล 
    .sync() //ใช้เมธอด sync() เพื่อสร้างตารางในฐานข้อมูล 
    .then(() => console.log("Table `users` has been created successfully.")) //แสดงข้อความเมื่อสร้างตารางสำเร็จ 
    .catch((error) => console.error("or table already exist users")); //แสดงข้อความเมื่อเกิดข้อผิดพลาดในการสร้างตาราง

  return User; //ส่งค่ากลับเพื่อให้สามารถนำไปใช้งานได้ 
};
