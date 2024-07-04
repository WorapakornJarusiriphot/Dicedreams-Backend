//ไฟล์นี้เป็นการกำหนดโมเดล Notification สำหรับใช้กับ Sequelize ORM ซึ่งเป็นเครื่องมือในการเชื่อมต่อและจัดการฐานข้อมูลในแอปพลิเคชัน Node.js 
//โมเดล Notification ถูกกำหนดให้สอดคล้องกับตาราง notification ในฐานข้อมูล
const { DataTypes } = require("sequelize"); //เรียกใช้งาน DataTypes จาก sequelize เพื่อใช้ในการกำหนดชนิดของข้อมูลในโมเดล Notification ได้ 

module.exports = (sequelize, Sequelize) => { //สร้างโมเดล Notification โดยรับ sequelize และ Sequelize เข้ามาเพื่อใช้ในการกำหนดโมเดล Notification ได้ 
  const Notification = sequelize.define( //กำหนดโมเดล Notification โดยใช้ sequelize.define ซึ่งรับสองพารามิเตอร์ คือชื่อของโมเดลและโครงสร้างของโมเดล 
    "notification", //ชื่อของโมเดล ซึ่งในที่นี้คือ notification 
    {
      notification_id: { //กำหนดโครงสร้างของโมเดล Notification โดยมีโครงสร้างดังนี้ 
        type: DataTypes.UUID, //กำหนดชนิดของข้อมูลในฟิลด์ notification_id เป็น UUID 
        defaultValue: Sequelize.UUIDV4, //กำหนดค่าเริ่มต้นให้กับฟิลด์ notification_id โดยใช้ Sequelize.UUIDV4 เพื่อสร้างค่า UUID ใหม่ให้กับฟิลด์นี้ 
        primaryKey: true, //กำหนดให้ฟิลด์ notification_id เป็น primary key ของโมเดล Notification 
      }, //สิ้นสุดโครงสร้างของฟิลด์ notification_id 
      type: { //กำหนดฟิลด์ type ในโมเดล Notification โดยมีโครงสร้างดังนี้ 
        type: DataTypes.STRING(50), //กำหนดชนิดของข้อมูลในฟิลด์ type เป็น STRING โดยมีความยาวสูงสุด 50 ตัวอักษร 
        allowNull: false, //กำหนดให้ฟิลด์ type ไม่สามารถเป็นค่าว่างได้ 
      }, //สิ้นสุดโครงสร้างของฟิลด์ type 
      read: { //กำหนดฟิลด์ read ในโมเดล Notification โดยมีโครงสร้างดังนี้ 
        type: DataTypes.BOOLEAN, //กำหนดชนิดของข้อมูลในฟิลด์ read เป็น BOOLEAN 
        allowNull: false, //กำหนดให้ฟิลด์ read ไม่สามารถเป็นค่าว่างได้ 
      },
      time: { //กำหนดฟิลด์ time ในโมเดล Notification โดยมีโครงสร้างดังนี้ 
        type: DataTypes.DATE, //กำหนดชนิดของข้อมูลในฟิลด์ time เป็น DATE 
        allowNull: false, //กำหนดให้ฟิลด์ time ไม่สามารถเป็นค่าว่างได้ 
      },
      user_id: { //กำหนดฟิลด์ user_id ในโมเดล Notification โดยมีโครงสร้างดังนี้ 
        type: DataTypes.UUID, //กำหนดชนิดของข้อมูลในฟิลด์ user_id เป็น UUID 
        references: { //กำหนดให้ฟิลด์ user_id เชื่อมโยงกับฟิลด์ users_id ในตาราง users ในฐานข้อมูล 
          model: "users", //กำหนดให้ฟิลด์ user_id เชื่อมโยงกับตาราง users 
          key: "users_id", //กำหนดให้ฟิลด์ user_id เชื่อมโยงกับฟิลด์ users_id ในตาราง users 
        },
        allowNull: false, //กำหนดให้ฟิลด์ user_id ไม่สามารถเป็นค่าว่างได้ 
      },
      entity_id: { //กำหนดฟิลด์ entity_id ในโมเดล Notification โดยมีโครงสร้างดังนี้ 
        type: DataTypes.UUID, //กำหนดชนิดของข้อมูลในฟิลด์ entity_id เป็น UUID 
        allowNull: false, //กำหนดให้ฟิลด์ entity_id ไม่สามารถเป็นค่าว่างได้ 
      },
    },
    {
      freezeTableName: true, //กำหนดให้ชื่อของตารางในฐานข้อมูลเป็น notification ตามที่กำหนดไว้ 
      timestamps: true, //กำหนดให้มีฟิลด์ createdAt และ updatedAt ในการบันทึกเวลาที่เพิ่มและแก้ไขข้อมูล 
    }
  );

  sequelize //สร้างตาราง notification ในฐานข้อมูลจริงโดยใช้ sequelize.sync()
    .sync() //สร้างตารางในฐานข้อมูลจริง 
    .then(() => //หลังจากสร้างตารางเสร็จแล้วให้แสดงข้อความว่า "Table `Notification` has been created successfully." ออกทาง console 
      console.log("Table `Notification` has been created successfully.")
    )
    .catch((error) => console.error("This error occurred", error)); //ถ้าเกิดข้อผิดพลาดในการสร้างตารางให้แสดงข้อความว่า "This error occurred" 
    //พร้อมกับแสดง error ออกทาง console 

  return Notification; //ส่งค่ากลับจากฟังก์ชันโดยคืนค่าของ Notification ออกไป 
};
