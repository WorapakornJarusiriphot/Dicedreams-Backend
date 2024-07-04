//ไฟล์นี้เป็นการกำหนดโมเดล PostGames สำหรับใช้กับ Sequelize ORM ซึ่งเป็นเครื่องมือในการเชื่อมต่อและจัดการฐานข้อมูลในแอปพลิเคชัน Node.js 
//โมเดล PostGames ถูกกำหนดให้สอดคล้องกับตาราง post_games ในฐานข้อมูล
const { DataTypes } = require("sequelize"); // import DataTypes มาจาก sequelize เพื่อใช้ในการกำหนดชนิดของฟิลด์ในตาราง post_games ในฐานข้อมูล 

module.exports = (sequelize, Sequelize) => { // สร้างโมเดล PostGames โดยรับพารามิเตอร์ sequelize และ Sequelize มาจากไฟล์ index.js ในโฟลเดอร์ models 
  const PostGames = sequelize.define( // กำหนดโมเดล PostGames โดยใช้ method define ของ sequelize โดยระบุชื่อของโมเดลว่า PostGames และกำหนดฟิลด์ต่างๆ ของโมเดล 
    "post_games", // ชื่อของโมเดล ซึ่งตรงกับชื่อของตารางในฐานข้อมูล 
    { // กำหนดฟิลด์ของโมเดล PostGames
      post_games_id: { // กำหนดฟิลด์ post_games_id ซึ่งเป็น Primary Key ของตาราง post_games 
        //และมีชนิดข้อมูลเป็น UUID ที่ถูกสร้างโดย Sequelize.UUIDV4 และไม่สามารถเป็นค่าว่างได้
        type: DataTypes.UUID, //ชนิดของฟิลด์เป็น UUID 
        defaultValue: Sequelize.UUIDV4, //กำหนดค่าเริ่มต้นของฟิลด์เป็น UUID ที่สร้างจาก method UUIDV4 ของ Sequelize
        primaryKey: true, //กำหนดให้เป็น primary key ของตาราง 
      },
      name_games: { // กำหนดฟิลด์ name_games ซึ่งเป็นชื่อเกมส์ที่จะเล่นในกิจกรรม 
        type: DataTypes.STRING(50), //ชนิดของฟิลด์เป็น STRING ความยาว 50 ตัวอักษร
        allowNull: false, //ไม่สามารถเป็นค่าว่างได้
      },
      detail_post: { // กำหนดฟิลด์ detail_post ซึ่งเป็นรายละเอียดของกิจกรรม 
        type: DataTypes.STRING(255), //ชนิดของฟิลด์เป็น STRING ความยาว 255 ตัวอักษร 
        allowNull: false, //ไม่สามารถเป็นค่าว่างได้ 
      },
      num_people: { // กำหนดฟิลด์ num_people ซึ่งเป็นจำนวนคนที่ต้องการให้เข้าร่วมกิจกรรม 
        type: DataTypes.INTEGER, //ชนิดของฟิลด์เป็น INTEGER 
        allowNull: false, //ไม่สามารถเป็นค่าว่างได้ 
      },
      date_meet: { // กำหนดฟิลด์ date_meet ซึ่งเป็นวันที่ที่กิจกรรมจะเกิดขึ้น 
        type: DataTypes.DATEONLY, //ชนิดของฟิลด์เป็น DATEONLY ซึ่งเก็บวันที่โดยไม่รวมเวลา 
        allowNull: false, //ไม่สามารถเป็นค่าว่างได้ 
      },
      time_meet: { // กำหนดฟิลด์ time_meet ซึ่งเป็นเวลาที่กิจกรรมจะเกิดขึ้น 
        type: DataTypes.TIME, //ชนิดของฟิลด์เป็น TIME ซึ่งเก็บเวลา 
        allowNull: false, //ไม่สามารถเป็นค่าว่างได้ 
      },
      games_image: { // กำหนดฟิลด์ games_image ซึ่งเป็น URL ของรูปภาพที่แสดงเกมส์ที่จะเล่นในกิจกรรม 
        type: DataTypes.STRING(255), //ชนิดของฟิลด์เป็น STRING ความยาว 255 ตัวอักษร 
        allowNull: true, //สามารถเป็นค่าว่างได้ 
      },
      creation_date: { // กำหนดฟิลด์ creation_date ซึ่งเป็นวันที่และเวลาที่เพิ่มข้อมูลลงในตาราง post_games 
        type: DataTypes.DATE, //ชนิดของฟิลด์เป็น DATE ซึ่งเก็บวันที่และเวลา 
        defaultValue: Sequelize.NOW, //กำหนดค่าเริ่มต้นของฟิลด์เป็นวันที่และเวลาปัจจุบัน 
        allowNull: false, //ไม่สามารถเป็นค่าว่างได้ 
      },
      status_post: { // กำหนดฟิลด์ status_post ซึ่งเป็นสถานะของกิจกรรม ซึ่งมีค่าเป็น 'open' หรือ 'close' 
        type: DataTypes.STRING(20), //ชนิดของฟิลด์เป็น STRING ความยาว 20 ตัวอักษร 
        allowNull: false, //ไม่สามารถเป็นค่าว่างได้ 
      },
      users_id: { // กำหนดฟิลด์ users_id ซึ่งเป็น foreign key ที่เชื่อมโยงกับฟิลด์ users_id ในตาราง users 
        type: DataTypes.UUID, //ชนิดของฟิลด์เป็น UUID 
        references: { // กำหนดให้ฟิลด์ users_id อ้างอิงถึงฟิลด์ users_id ในตาราง users 
          model: "users", // ชื่อของตารางที่ต้องการให้ฟิลด์ users_id อ้างอิงถึง 
          key: "users_id", // ชื่อของฟิลด์ที่ต้องการให้ฟิลด์ users_id อ้างอิงถึง 
        }, 
        allowNull: false, //ไม่สามารถเป็นค่าว่างได้ 
      },
    },
    {
      freezeTableName: true, // กำหนดให้ชื่อของตารางในฐานข้อมูลเป็น post_games ตามที่กำหนด 
      timestamps: false, // ไม่มีฟิลด์ createdAt และ updatedAt ในตาราง post_games
    }
  );

  sequelize // ทำการ sync โมเดล PostGames กับฐานข้อมูล โดยใช้ method sync ของ sequelize 
    .sync() // โดยไม่ระบุพารามิเตอร์ใดๆ 
    .then(() => // หาก sync สำเร็จ ให้แสดงข้อความว่า "Table `post_games` has been created successfully." 
      console.log("Table `post_games` has been created successfully.") // แสดงข้อความว่า "Table `post_games` has been created successfully." 
    )
    .catch((error) => console.error("This error occurred", error)); // หากเกิดข้อผิดพลาดในการ sync ให้แสดงข้อความว่า "This error occurred" พร้อมกับแสดง error ที่เกิดขึ้น

  return PostGames; // ส่งค่ากลับเป็น PostGames 
};
