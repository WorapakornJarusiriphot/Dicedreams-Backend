//ไฟล์นี้เป็นการกำหนดโมเดล PostActivity สำหรับใช้กับ Sequelize ORM ซึ่งเป็นเครื่องมือในการเชื่อมต่อและจัดการฐานข้อมูลในแอปพลิเคชัน Node.js 
//โมเดล PostActivity ถูกกำหนดให้สอดคล้องกับตาราง post_activity ในฐานข้อมูล
const { DataTypes } = require("sequelize"); // import DataTypes จาก sequelize เพื่อใช้ในการกำหนดชนิดของฟิลด์ในตาราง post_activity ในฐานข้อมูล 

module.exports = (sequelize, Sequelize) => { //สร้างโมเดล PostActivity โดยรับพารามิเตอร์สองตัว คือ sequelize และ Sequelize 
  const PostActivity = sequelize.define( //กำหนดโมเดล PostActivity โดยใช้ method define ของ sequelize 
    "post_activity", //ชื่อของตารางในฐานข้อมูล 
    {
      post_activity_id: { //กำหนดฟิลด์ post_activity_id ในตาราง post_activity โดยมีลักษณะดังนี้ 
        type: DataTypes.UUID, //ชนิดของฟิลด์เป็น UUID 
        defaultValue: Sequelize.UUIDV4, //กำหนดค่าเริ่มต้นของฟิลด์เป็น UUID ที่สร้างจาก method UUIDV4 ของ Sequelize
        primaryKey: true, //กำหนดให้เป็น primary key ของตาราง 
      },
      name_activity: {  //กำหนดฟิลด์ name_activity ในตาราง post_activity โดยมีลักษณะดังนี้ 
        type: DataTypes.STRING(50), //ชนิดของฟิลด์เป็น STRING ความยาว 50 ตัวอักษร
        allowNull: false, //กำหนดให้ฟิลด์นี้ไม่สามารถเป็นค่าว่างได้
      },
      status_post: { //กำหนดฟิลด์ status_post ในตาราง post_activity โดยมีลักษณะดังนี้ 
        type: DataTypes.STRING(20), //ชนิดของฟิลด์เป็น STRING ความยาว 20 ตัวอักษร
        allowNull: false, //กำหนดให้ฟิลด์นี้ไม่สามารถเป็นค่าว่างได้
      },
      creation_date: { //กำหนดฟิลด์ creation_date ในตาราง post_activity โดยมีลักษณะดังนี้ 
        type: DataTypes.DATE, //ชนิดของฟิลด์เป็น DATE 
        allowNull: false, //กำหนดให้ฟิลด์นี้ไม่สามารถเป็นค่าว่างได้ 
      },
      detail_post: { //กำหนดฟิลด์ detail_post ในตาราง post_activity โดยมีลักษณะดังนี้ 
        type: DataTypes.STRING(255), //ชนิดของฟิลด์เป็น STRING ความยาว 255 ตัวอักษร 
        allowNull: false, //กำหนดให้ฟิลด์นี้ไม่สามารถเป็นค่าว่างได้ 
      },
      date_activity: { //กำหนดฟิลด์ date_activity ในตาราง post_activity โดยมีลักษณะดังนี้
        type: DataTypes.DATEONLY, //ชนิดของฟิลด์เป็น DATEONLY 
        allowNull: false, //กำหนดให้ฟิลด์นี้ไม่สามารถเป็นค่าว่างได้ 
      },
      time_activity: { //กำหนดฟิลด์ time_activity ในตาราง post_activity โดยมีลักษณะดังนี้ 
        type: DataTypes.TIME, //ชนิดของฟิลด์เป็น TIME 
        allowNull: false, //กำหนดให้ฟิลด์นี้ไม่สามารถเป็นค่าว่างได้ 
      },
      post_activity_image: { //กำหนดฟิลด์ post_activity_image ในตาราง post_activity โดยมีลักษณะดังนี้ 
        type: DataTypes.STRING(255), //ชนิดของฟิลด์เป็น STRING ความยาว 255 ตัวอักษร 
        allowNull: true, //กำหนดให้ฟิลด์นี้สามารถเป็นค่าว่างได้ 
      },
      store_id: { //กำหนดฟิลด์ store_id ในตาราง post_activity โดยมีลักษณะดังนี้
        type: DataTypes.UUID, //ชนิดของฟิลด์เป็น UUID 
        references: { //กำหนดให้ฟิลด์นี้เป็น foreign key ที่อ้างอิงไปที่ฟิลด์ store_id ในตาราง store
          model: "store", //ชื่อของตารางที่เป็น foreign key 
          key: "store_id", //ชื่อของฟิลด์ที่เป็น foreign key 
        },
        allowNull: false, //กำหนดให้ฟิลด์นี้ไม่สามารถเป็นค่าว่างได้ 
      },
    },
    {
      freezeTableName: true, //กำหนดให้ใช้ชื่อของตารางในฐานข้อมูลตามที่กำหนด
      timestamps: false, //ไม่เพิ่มฟิลด์ createdAt และ updatedAt ในตารางในฐานข้อมูล 
    }
  );

  sequelize //ทำการสร้างตาราง post_activity ในฐานข้อมูล โดยใช้ method sync 
    .sync()  //สร้างตารางในฐานข้อมูล 
    .then(() =>  //เมื่อสร้างตารางเสร็จแล้วให้แสดงข้อความดังกล่าวบน console 
      console.log("Table `post_activity` has been created successfully.") //แสดงข้อความ Table post_activity has been created successfully. บน console
    )
    .catch((error) => console.error("This error occurred", error)); //แสดงข้อความ This error occurred พร้อมกับข้อความผิดพลาดที่เกิดขึ้นบน console

  return PostActivity; //ส่งค่ากลับสู่ส่วนที่เรียกใช้งาน (module) 
};
