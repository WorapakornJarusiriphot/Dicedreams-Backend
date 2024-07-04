//ไฟล์นี้เป็นการกำหนดโมเดล Chat สำหรับใช้กับ Sequelize ORM ซึ่งเป็นเครื่องมือในการเชื่อมต่อและจัดการฐานข้อมูลในแอปพลิเคชัน Node.js 
// โมเดล Chat ถูกกำหนดให้สอดคล้องกับตาราง chat ในฐานข้อมูล
const { DataTypes } = require("sequelize"); //เรียกใช้งาน DataTypes จาก sequelize เพื่อใช้ในการกำหนดชนิดของฟิลด์ในตาราง chat ในฐานข้อมูล 
const { generateRandomId } = require("../utils/generateRandomId"); //เรียกใช้งานฟังก์ชัน generateRandomId จากไฟล์ generateRandomId.js 
// ในโฟลเดอร์ utils เพื่อใช้ในการสร้างค่า chat_id สำหรับแต่ละแถวในตาราง chat ในฐานข้อมูล 

module.exports = (sequelize, Sequelize) => { //สร้างโมเดล Chat โดยรับพารามิเตอร์ sequelize และ Sequelize มาจากไฟล์ index.js ในโฟลเดอร์ models 
  // ซึ่งเป็นการเชื่อมต่อกับฐานข้อมูล และใช้ Sequelize ORM ในการจัดการฐานข้อมูล 
  const Chat = sequelize.define(  //กำหนดโมเดล Chat โดยใช้เมธอด define ของ Sequelize โดยระบุชื่อของโมเดล Chat และชื่อตารางในฐานข้อมูลว่า chat 
    "chat", //ชื่อตารางในฐานข้อมูล 
    { //กำหนดฟิลด์ในตาราง chat ในฐานข้อมูล 
      chat_id: { //กำหนดฟิลด์ chat_id ในตาราง chat ในฐานข้อมูล 
        type: DataTypes.BIGINT, //กำหนดชนิดของฟิลด์เป็น BIGINT 
        primaryKey: true, //กำหนดให้เป็น primary key ของตาราง 
        defaultValue: generateRandomId, //กำหนดค่าเริ่มต้นให้เป็นค่าที่สร้างจากฟังก์ชัน generateRandomId 
      }, //สร้างค่า chat_id สำหรับแต่ละแถวในตาราง chat ในฐานข้อมูล 
      message: { //กำหนดฟิลด์ message ในตาราง chat ในฐานข้อมูล 
        type: DataTypes.STRING(255), //กำหนดชนิดของฟิลด์เป็น STRING ความยาว 255 ตัวอักษร 
        allowNull: false, //กำหนดให้ฟิลด์ message ไม่สามารถเป็นค่าว่างได้ 
      }, //ซึ่งเป็นข้อความที่ส่งในแชท 
      datetime_chat: { //กำหนดฟิลด์ datetime_chat ในตาราง chat ในฐานข้อมูล 
        type: DataTypes.STRING(20), //กำหนดชนิดของฟิลด์เป็น STRING ความยาว 20 ตัวอักษร 
        allowNull: false, //กำหนดให้ฟิลด์ datetime_chat ไม่สามารถเป็นค่าว่างได้ 
      }, //ซึ่งเป็นวันที่และเวลาที่ส่งข้อความในแชท 
      user_id: { //กำหนดฟิลด์ user_id ในตาราง chat ในฐานข้อมูล 
        type: DataTypes.UUID, //กำหนดชนิดของฟิลด์เป็น UUID 
        references: { //กำหนดให้เป็น foreign key ที่อ้างอิงไปยังฟิลด์ users_id ในตาราง users ในฐานข้อมูล 
          model: "users", //กำหนดให้เป็น foreign key ที่อ้างอิงไปยังฟิลด์ users_id ในตาราง users 
          key: "users_id", //กำหนดให้เป็น foreign key ที่อ้างอิงไปยังฟิลด์ users_id ในตาราง users 
        }, //ซึ่งเป็นรหัสผู้ใช้ที่ส่งข้อความในแชท 
        allowNull: false, //กำหนดให้ฟิลด์ user_id ไม่สามารถเป็นค่าว่างได้ 
      }, 
      post_games_id: { //กำหนดฟิลด์ post_games_id ในตาราง chat ในฐานข้อมูล 
        type: DataTypes.UUID, //กำหนดชนิดของฟิลด์เป็น UUID 
        references: { //กำหนดให้เป็น foreign key ที่อ้างอิงไปยังฟิลด์ post_games_id ในตาราง post_games ในฐานข้อมูล 
          model: "post_games", //กำหนดให้เป็น foreign key ที่อ้างอิงไปยังฟิลด์ post_games_id ในตาราง post_games 
          key: "post_games_id", //กำหนดให้เป็น foreign key ที่อ้างอิงไปยังฟิลด์ post_games_id ในตาราง post_games 
        }, //ซึ่งเป็นรหัสเกมที่สร้างข้อความในแชท 
        allowNull: false, //กำหนดให้ฟิลด์ post_games_id ไม่สามารถเป็นค่าว่างได้ 
      }, 
    },
    {
      freezeTableName: true, //กำหนดให้ชื่อตารางในฐานข้อมูลเป็น chat ตามที่กำหนดไว้ 
      timestamps: true, //กำหนดให้มีฟิลด์ createdAt และ updatedAt ในตาราง chat ในฐานข้อมูล 
    }
  );

  sequelize //สร้างตาราง chat ในฐานข้อมูล 
    .sync() //ใช้เมธอด sync() เพื่อสร้างตารางในฐานข้อมูล 
    .then(() => console.log("Table `chat` has been created successfully.")) //แสดงข้อความ Table chat has been created successfully. เมื่อสร้างตารางสำเร็จ 
    .catch((error) => console.error("This error occurred", error)); //แสดงข้อความ This error occurred เมื่อเกิดข้อผิดพลาดในการสร้างตาราง 

  return Chat; //ส่งค่ากลับเพื่อให้สามารถเรียกใช้งานได้ 
};
