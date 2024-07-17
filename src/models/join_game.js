const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Comments = sequelize.define(
    "join_game",
    {
      // ระบุ attribute ของตาราง
      join_game_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4, // สร้าง UUID แบบสุ่มเป็นค่าเริ่มต้น
        primaryKey: true, // กำหนดเป็น Primary Key
      },
      status: {
        type: DataTypes.STRING, // ใช้ DATE สำหรับวันที่และเวลา
        defaultValue: 'ยังไม่อนุมัติ', // กำหนดค่าเริ่มต้นเป็นเวลาปัจจุบัน
        allowNull: true,
      },
      post_games_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      users_id: {
        type: DataTypes.UUID,
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
      console.log("Table `comments` has been created successfully.")
    )
    .catch((error) => console.error("This error occurred", error));

  return Comments;
};
