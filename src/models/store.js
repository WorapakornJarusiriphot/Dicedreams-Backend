//ไฟล์นี้เป็นการกำหนดโมเดล Store สำหรับใช้กับ Sequelize ORM ซึ่งเป็นเครื่องมือในการเชื่อมต่อและจัดการฐานข้อมูลในแอปพลิเคชัน Node.js 
//โมเดล Store ถูกกำหนดให้สอดคล้องกับตาราง store ในฐานข้อมูล
const { DataTypes } = require("sequelize"); // import DataTypes มาจาก sequelize เพื่อใช้ในการกำหนดชนิดของฟิลด์ในตาราง store ในฐานข้อมูล 

module.exports = (sequelize, Sequelize) => { //สร้างโมเดล Store โดยรับ sequelize และ Sequelize เข้ามาเพื่อใช้ในการกำหนดโมเดล Store และสร้างตาราง store ในฐานข้อมูล 
  const Store = sequelize.define( //กำหนดโมเดล Store โดยใช้ method define ของ sequelize โดยระบุชื่อของโมเดล Store และชื่อตาราง store ในฐานข้อมูล 
    "store", //ชื่อของโมเดล Store ที่กำหนดไว้ 
    { //กำหนดฟิลด์ในตาราง store ในฐานข้อมูล 
      store_id: { //กำหนดฟิลด์ store_id ในตาราง store ในฐานข้อมูล 
        type: DataTypes.UUID, //กำหนดชนิดของฟิลด์เป็น UUID 
        defaultValue: Sequelize.UUIDV4, //กำหนดค่าเริ่มต้นของฟิลด์เป็น UUIDV4 
        primaryKey: true, //กำหนดให้เป็น primary key ของตาราง store ในฐานข้อมูล 
      },
      name_store: { //กำหนดฟิลด์ name_store ในตาราง store ในฐานข้อมูล 
        type: DataTypes.STRING(50), //กำหนดชนิดของฟิลด์เป็น STRING และมีขนาดสูงสุด 50 ตัวอักษร 
        allowNull: false, //กำหนดให้ฟิลด์ name_store ไม่สามารถเป็นค่าว่างได้ 
      },
      phone_number: { //กำหนดฟิลด์ phone_number ในตาราง store ในฐานข้อมูล 
        type: DataTypes.STRING(20), //กำหนดชนิดของฟิลด์เป็น STRING และมีขนาดสูงสุด 20 ตัวอักษร
        allowNull: true, //กำหนดให้ฟิลด์ phone_number สามารถเป็นค่าว่างได้
      },
      house_number: { //กำหนดฟิลด์ house_number ในตาราง store ในฐานข้อมูล 
        type: DataTypes.STRING(10), //กำหนดชนิดของฟิลด์เป็น STRING และมีขนาดสูงสุด 10 ตัวอักษร
        allowNull: true, //กำหนดให้ฟิลด์ house_number สามารถเป็นค่าว่างได้
      },
      alley: { //กำหนดฟิลด์ alley ในตาราง store ในฐานข้อมูล 
        type: DataTypes.STRING(10), //กำหนดชนิดของฟิลด์เป็น STRING และมีขนาดสูงสุด 10 ตัวอักษร
        allowNull: true, //กำหนดให้ฟิลด์ alley สามารถเป็นค่าว่างได้
      },
      road: { //กำหนดฟิลด์ road ในตาราง store ในฐานข้อมูล
        type: DataTypes.STRING(100), //กำหนดชนิดของฟิลด์เป็น STRING และมีขนาดสูงสุด 100 ตัวอักษร
        allowNull: true, //กำหนดให้ฟิลด์ road สามารถเป็นค่าว่างได้ 
      },
      district: { //กำหนดฟิลด์ district ในตาราง store ในฐานข้อมูล 
        type: DataTypes.STRING(100), //กำหนดชนิดของฟิลด์เป็น STRING และมีขนาดสูงสุด 100 ตัวอักษร 
        allowNull: true, //กำหนดให้ฟิลด์ district สามารถเป็นค่าว่างได้
      },
      sub_district: { //กำหนดฟิลด์ sub_district ในตาราง store ในฐานข้อมูล 
        type: DataTypes.STRING(100), //กำหนดชนิดของฟิลด์เป็น STRING และมีขนาดสูงสุด 100 ตัวอักษร
        allowNull: true, //กำหนดให้ฟิลด์ sub_district สามารถเป็นค่าว่างได้ 
      },
      province: { //กำหนดฟิลด์ province ในตาราง store ในฐานข้อมูล 
        type: DataTypes.STRING(100), //กำหนดชนิดของฟิลด์เป็น STRING และมีขนาดสูงสุด 100 ตัวอักษร
        allowNull: true, //กำหนดให้ฟิลด์ province สามารถเป็นค่าว่างได้
      },
      store_image: { //กำหนดฟิลด์ store_image ในตาราง store ในฐานข้อมูล 
        type: DataTypes.STRING(255), //กำหนดชนิดของฟิลด์เป็น STRING และมีขนาดสูงสุด 255 ตัวอักษร 
        allowNull: true, //กำหนดให้ฟิลด์ store_image สามารถเป็นค่าว่างได้ 
      },
      users_id: { //กำหนดฟิลด์ users_id ในตาราง store ในฐานข้อมูล 
        type: DataTypes.UUID, //กำหนดชนิดของฟิลด์เป็น UUID 
        references: { //กำหนดให้ฟิลด์ users_id เชื่อมโยงกับฟิลด์ users_id ในตาราง users ในฐานข้อมูล
          model: "users", //กำหนดให้ฟิลด์ users_id เชื่อมโยงกับตาราง users ในฐานข้อมูล
          key: "users_id", //กำหนดให้ฟิลด์ users_id เชื่อมโยงกับฟิลด์ users_id ในตาราง users ในฐานข้อมูล
        },
        allowNull: false, //กำหนดให้ฟิลด์ users_id ไม่สามารถเป็นค่าว่างได้ 
      },
    },
    {
      freezeTableName: true, //กำหนดให้ชื่อตารางในฐานข้อมูลเป็นไปตามที่กำหนด 
      timestamps: true, //กำหนดให้มีฟิลด์ createdAt และ updatedAt ในตาราง store ในฐานข้อมูล
    }
  );

  sequelize //สร้างตาราง store ในฐานข้อมูล 
    .sync() //sync เป็น method ที่ใช้สร้างตารางในฐานข้อมูล 
    .then(() => console.log("Table `store` has been created successfully.")) //แสดงข้อความ Table store has been created successfully. เมื่อสร้างตาราง store สำเร็จ
    .catch((error) => console.error("This error occurred", error)); //แสดงข้อความ This error occurred พร้อมกับข้อความผิดพลาดที่เกิดขึ้น เมื่อเกิดข้อผิดพลาดในการสร้างตาราง store

  return Store; //ส่งค่า Store กลับไปยังส่วนที่เรียกใช้งาน (ในที่นี้คือไฟล์ store.controller.js) 
};
