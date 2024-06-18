const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const PostGames = sequelize.define(
    "post_games",
    {
      // ระบุ attribute ของตาราง
      post_games_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4, // สร้าง UUID แบบสุ่มเป็นค่าเริ่มต้น
        primaryKey: true, // กำหนดเป็น Primary Key
      },
      name_games: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      detail_post: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      num_people: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date_meet: {
        type: DataTypes.DATEONLY, // ใช้ DATEONLY สำหรับวันที่โดยไม่มีเวลา
        allowNull: false,
      },
      time_meet: {
        type: DataTypes.TIME, // ใช้ TIME สำหรับเวลา
        allowNull: false,
      },
      games_image: {
        type: DataTypes.STRING(255), // ใช้สำหรับเก็บ URL หรือเส้นทางของรูปเกม
        allowNull: true, // อนุญาตให้เป็น null ได้หากรูปเกมไม่จำเป็น
      },
      creation_date: {
        type: DataTypes.DATE, // ใช้ DATE สำหรับวันที่และเวลา
        defaultValue: Sequelize.NOW, // กำหนดค่าเริ่มต้นเป็นเวลาปัจจุบัน
        allowNull: false,
      },
      status_post: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      users_id: {
        type: DataTypes.UUID,
        references: {
          model: "users", // ชื่อตารางของ user
          key: "users_id", // คีย์ที่ถูกอ้างอิง
        },
        allowNull: false,
      },
    },
    {
      // ตัวเลือกเพิ่มเติม
      freezeTableName: true, // ป้องกัน Sequelize จากการเปลี่ยนชื่อตารางให้เป็นพหูพจน์
      timestamps: false, // ปิดการใช้งาน timestamps หากคุณไม่ต้องการ `createdAt` และ `updatedAt`
    }
  );

  // สร้างตารางตามโมเดลหากยังไม่มี
  sequelize
    .sync()
    .then(() =>
      console.log("Table `post_games` has been created successfully.")
    )
    .catch((error) => console.error("This error occurred", error));

  return PostGames;
};
