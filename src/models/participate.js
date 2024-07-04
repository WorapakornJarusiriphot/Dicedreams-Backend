//ไฟล์นี้เป็นการกำหนดโมเดล Participate สำหรับใช้กับ Sequelize ORM ซึ่งเป็นเครื่องมือในการเชื่อมต่อและจัดการฐานข้อมูลในแอปพลิเคชัน Node.js 
//โมเดล Participate ถูกกำหนดให้สอดคล้องกับตาราง participate ในฐานข้อมูล
const { DataTypes } = require("sequelize"); // import DataTypes มาจาก sequelize เพื่อใช้ในการกำหนด data type ให้กับฟิลด์ในตาราง Participate ในฐานข้อมูล 

module.exports = (sequelize, Sequelize) => { // สร้างฟังก์ชันที่มี parameter สองตัว โดยที่ตัวแรกคือ sequelize ที่เป็น instance 
  //ที่เชื่อมต่อกับฐานข้อมูล และตัวที่สองคือ Sequelize ที่เป็น module ที่ import เข้ามา 
  const Participate = sequelize.define( // กำหนดค่าให้กับตัวแปร Participate โดยที่ให้ sequelize.define ซึ่งเป็น method ที่ใช้สำหรับกำหนดโมเดล 
    "participate", // กำหนดชื่อของตารางในฐานข้อมูล 
    { // กำหนดฟิลด์ในตาราง participate พร้อมกับ data type ของฟิลด์แต่ละฟิลด์ 
      part_Id: { // กำหนดฟิลด์ชื่อ part_Id ซึ่งเป็น primary key ของตาราง 
        type: DataTypes.UUID, // กำหนด data type ของฟิลด์เป็น UUID 
        defaultValue: Sequelize.UUIDV4, // กำหนดค่าเริ่มต้นให้กับฟิลด์เป็น UUIDV4 
        primaryKey: true, // กำหนดให้ฟิลด์เป็น primary key 
      },
      participant_apply_datetime: { // กำหนดฟิลด์ชื่อ participant_apply_datetime ซึ่งเป็นวันที่และเวลาที่ผู้เข้าร่วมสมัครเข้าร่วมกิจกรรม 
        type: DataTypes.DATE, // กำหนด data type ของฟิลด์เป็น DATE 
        allowNull: false, // กำหนดให้ฟิลด์ไม่สามารถเป็นค่าว่างได้ 
      },
      participant_status: { // กำหนดฟิลด์ชื่อ participant_status ซึ่งเป็นสถานะการเข้าร่วมกิจกรรมของผู้เข้าร่วม 
        type: DataTypes.STRING(20), // กำหนด data type ของฟิลด์เป็น STRING โดยมีขนาดสูงสุด 20 ตัวอักษร 
        allowNull: false, // กำหนดให้ฟิลด์ไม่สามารถเป็นค่าว่างได้ 
      },
      user_id: { // กำหนดฟิลด์ชื่อ user_id ซึ่งเป็น foreign key ที่เชื่อมโยงกับฟิลด์ users_id ในตาราง users 
        type: DataTypes.UUID, // กำหนด data type ของฟิลด์เป็น UUID 
        references: { // กำหนดให้ฟิลด์เป็น foreign key ที่เชื่อมโยงกับตาราง users 
          model: "users", // กำหนดชื่อของตารางที่เป็น foreign key ที่เชื่อมโยง 
          key: "users_id", // กำหนดชื่อของฟิลด์ที่เป็น foreign key ที่เชื่อมโยง 
        },
        allowNull: false, // กำหนดให้ฟิลด์ไม่สามารถเป็นค่าว่างได้ 
      },
      post_games_id: { // กำหนดฟิลด์ชื่อ post_games_id ซึ่งเป็น foreign key ที่เชื่อมโยงกับฟิลด์ post_games_id ในตาราง post_games 
        type: DataTypes.UUID, // กำหนด data type ของฟิลด์เป็น UUID 
        references: { // กำหนดให้ฟิลด์เป็น foreign key ที่เชื่อมโยงกับตาราง post_games 
          model: "post_games", // กำหนดชื่อของตารางที่เป็น foreign key ที่เชื่อมโยง 
          key: "post_games_id", // กำหนดชื่อของฟิลด์ที่เป็น foreign key ที่เชื่อมโยง 
        }, 
        allowNull: false, // กำหนดให้ฟิลด์ไม่สามารถเป็นค่าว่างได้ 
      },
    },
    {
      freezeTableName: true, // กำหนดให้ชื่อของตารางในฐานข้อมูลเป็นชื่อเดียวกับที่กำหนด 
      timestamps: true, // กำหนดให้มีฟิลด์ createdAt และ updatedAt ในการบันทึกวันที่และเวลาที่เพิ่มและแก้ไขข้อมูล 
    }
  );

  sequelize // ทำการ sync โมเดล Participate กับฐานข้อมูล 
    .sync()  // โดยที่เรียกใช้ method sync() 
    .then(() =>  // แสดงข้อความเมื่อ sync กับฐานข้อมูลสำเร็จ 
      console.log("Table `Participate` has been created successfully.") // แสดงข้อความเมื่อสร้างตารางสำเร็จ 
    )
    .catch((error) => console.error("This error occurred", error)); // แสดง error เมื่อเกิดข้อผิดพลาดในการสร้างตาราง 

  return Participate;
};
