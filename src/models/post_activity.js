const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const PostActivity = sequelize.define(
    "post_activity",
    {
      // ระบุ attribute ของตาราง
      post_activity_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4, // สร้าง UUID แบบสุ่มเป็นค่าเริ่มต้น
        primaryKey: true, // กำหนดเป็น Primary Key
      },
      name_activity: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      status_post: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      creation_date: {
        type: DataTypes.DATE, // ใช้ DATE สำหรับ datetime
        allowNull: false,
      },
      detail_post: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      date_activity: {
        type: DataTypes.DATEONLY, // ใช้ DATEONLY สำหรับ date
        allowNull: false,
      },
      time_activity: {
        type: DataTypes.TIME, // ใช้ TIME สำหรับ time
        allowNull: false,
      },
      post_activity_image: {
        type: DataTypes.STRING(255), // ใช้ STRING สำหรับการเก็บ URL หรือเส้นทางของรูปภาพ
        allowNull: true,
      },
      store_id: {
        type: DataTypes.UUID,
        references: {
          model: 'store', // ชื่อตารางของ store
          key: 'store_id', // คีย์ที่ถูกอ้างอิง
        },
        allowNull: false
      }
    },
    {
      // ตัวเลือกเพิ่มเติม
      freezeTableName: true, // ป้องกัน Sequelize จากการเปลี่ยนชื่อตารางให้เป็นพหูพจน์
      timestamps: false, // หากคุณไม่ต้องการ `createdAt` และ `updatedAt`
    }
  );

  // สร้างตารางตามโมเดลหากยังไม่มี
  sequelize
    .sync()
    .then(() =>
      console.log("Table `post_activity` has been created successfully.")
    )
    .catch((error) => console.error("This error occurred", error));

  return PostActivity;
};
