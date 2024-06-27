//ไฟล์นี้เป็นคอนโทรลเลอร์สำหรับจัดการการแจ้งเตือน (notifications) ในแอปพลิเคชัน โดยใช้ไลบรารี Sequelize เพื่อจัดการกับฐานข้อมูลและการสร้างความสัมพันธ์ระหว่างโมเดลต่างๆ
const db = require("../models"); //เรียกใช้ db จากโฟลเดอร์ models ที่เก็บไฟล์โมเดล (models)
const Notification = db.notification; //เรียกใช้โมเดล Notification จาก db ที่ได้รับมา 
const Participate = db.participate; //เรียกใช้โมเดล Participate จาก db ที่ได้รับมา
const User = db.user; //เรียกใช้โมเดล User จาก db ที่ได้รับมา
const Chat = db.chat; //เรียกใช้โมเดล Chat จาก db ที่ได้รับมา
const PostGame = db.post_games; //เรียกใช้โมเดล PostGame จาก db ที่ได้รับมา

// Define the relationships
Participate.belongsTo(User, { foreignKey: "user_id" }); //เชื่อมโมเดล Participate กับ User ด้วย foreignKey เป็น user_id
Participate.belongsTo(PostGame, { foreignKey: "post_games_id" }); //เชื่อมโมเดล Participate กับ PostGame ด้วย foreignKey เป็น post_games_id
PostGame.belongsTo(User, { foreignKey: "users_id" }); //เชื่อมโมเดล PostGame กับ User ด้วย foreignKey เป็น users_id

// get all notifications
exports.findAll = async (req, res, next) => { //สร้างฟังก์ชัน findAll สำหรับดึงข้อมูลการแจ้งเตือนทั้งหมด โดยรับ req, res, next เป็นพารามิเตอร์ 
  try { //ใช้ try catch เพื่อจัดการข้อผิดพลาด 
    const messages = []; //สร้างตัวแปร messages เป็น array เพื่อเก็บข้อมูลการแจ้งเตือนทั้งหมด 
    const notifications = await Notification.findAll({ //ดึงข้อมูลการแจ้งเตือนทั้งหมดจากฐานข้อมูล 
      where: { user_id: req.user.users_id }, //เลือกข้อมูลที่มี user_id เท่ากับ req.user.users_id 
    });

    for (let i = 0; i < notifications.length; i++) { //วนลูปเพื่อดึงข้อมูลการแจ้งเตือนแต่ละรายการ 
      if (notifications[i].type === "participate") { //ถ้า type เป็น participate 
        const participate = await Participate.findByPk( //ค้นหาข้อมูลการเข้าร่วมจากฐานข้อมูล 
          notifications[i].entity_id, //โดยเลือกข้อมูลที่มี entity_id เท่ากับ notifications[i].entity_id 
          { //ค้นหาข้อมูลการเข้าร่วมจากฐานข้อมูล
            include: [ //รวมข้อมูลจากโมเดลอื่นๆ ด้วย 
              { //โมเดล User
                model: User, //โมเดล User 
                attributes: ["first_name", "last_name", "user_image"], //เลือกแค่ attributes ที่ต้องการ 
              }, //โมเดล User
              { //โมเดล PostGame
                model: PostGame, //โมเดล PostGame
                include: [ //รวมข้อมูลจากโมเดลอื่นๆ ด้วย
                  {
                    model: User, //โมเดล User
                    attributes: ["first_name", "last_name", "user_image"], //เลือกแค่ attributes ที่ต้องการ 
                  }, //โมเดล User
                ], //โมเดล PostGame
              },  //โมเดล PostGame
            ],  //รวมข้อมูลจากโมเดลอื่นๆ ด้วย
          } //ค้นหาข้อมูลการเข้าร่วมจากฐานข้อมูล
        );  //ค้นหาข้อมูลการเข้าร่วมจากฐานข้อมูล

        if (participate && participate.user && participate.post_game) { //ถ้ามีข้อมูลการเข้าร่วม และมีข้อมูล user และ post_game
          const postParticipants = await Participate.count({ //นับจำนวนผู้เข้าร่วมโพสต์เกม
            where: { //โดยเลือกข้อมูลที่มี post_games_id เท่ากับ participate.post_games_id
              post_games_id: participate.post_games_id, //โดยเลือกข้อมูลที่มี post_games_id เท่ากับ participate.post_games_id
              participant_status: "active", //โดยเลือกข้อมูลที่มี participant_status เท่ากับ active
            }, //โดยเลือกข้อมูลที่มี post_games_id เท่ากับ participate.post_games_id
          }); //นับจำนวนผู้เข้าร่วมโพสต์เกม

          messages.push({ //เพิ่มข้อมูลการแจ้งเตือนลงใน messages 
            type: "participate", //ประเภทการแจ้งเตือน 
            data: { //ข้อมูลการแจ้งเตือน
              ...participate.toJSON(), //เอาข้อมูลจาก participate มาใส่ใน data 
              first_name: participate.user.first_name, //ชื่อจริงของผู้เข้าร่วม 
              last_name: participate.user.last_name, //นามสกุลของผู้เข้าร่วม 
              user_image: participate.user.user_image, //รูปภาพของผู้เข้าร่วม 
              name_games: participate.post_game.name_games, //ชื่อเกม
              detail_post: participate.post_game.detail_post, //รายละเอียดโพสต์
              participants: postParticipants + 1, //จำนวนผู้เข้าร่วมโพสต์เกม
              num_people: participate.post_game.num_people, //จำนวนคนที่ต้องการ
              date_meet: participate.post_game.date_meet, //วันที่เล่น
              time_meet: participate.post_game.time_meet, //เวลาที่เล่น
              game_user_first_name: participate.post_game.user.first_name, //ชื่อจริงของผู้โพสต์เกม
              game_user_last_name: participate.post_game.user.last_name, //นามสกุลของผู้โพสต์เกม
              game_user_image: participate.post_game.user.user_image, //รูปภาพของผู้โพสต์เกม
            },
            notification_id: notifications[i].notification_id, //id ของการแจ้งเตือน
            entity_id: notifications[i].entity_id, //id ของ entity
            read: notifications[i].read, //สถานะการอ่าน
            time: notifications[i].time, //เวลาที่สร้าง
          }); //เพิ่มข้อมูลการแจ้งเตือนลงใน messages
        } //ถ้ามีข้อมูลการเข้าร่วม และมีข้อมูล user และ post_game
      } //ถ้า type เป็น participate
    } //วนลูปเพื่อดึงข้อมูลการแจ้งเตือนแต่ละรายการ

    res.status(200).json({ messages: messages }); //ส่งข้อมูลการแจ้งเตือนทั้งหมดกลับไปที่ client ในรูปแบบ JSON 
  } catch (error) { //จัดการข้อผิดพลาด 
    console.error("Error in findAll:", error); //แสดงข้อผิดพลาดใน console 
    next(error); //ส่งข้อผิดพลาดไปที่ error handler 
  } //จัดการข้อผิดพลาด
}; //สร้างฟังก์ชัน findAll สำหรับดึงข้อมูลการแจ้งเตือนทั้งหมด โดยรับ req, res, next เป็นพารามิเตอร์

// update read notification
exports.update = async (req, res, next) => { //สร้างฟังก์ชัน update สำหรับอัพเดทข้อมูลการแจ้งเตือน โดยรับ req, res, next เป็นพารามิเตอร์
  try { //ใช้ try catch เพื่อจัดการข้อผิดพลาด
    const id = req.params.id; //รับค่า id จาก params

    for (let i = 0; i < req.body.notification_id.length; i++) { //วนลูปเพื่ออัพเดทข้อมูลการแจ้งเตือนแต่ละรายการ
      const updated = await Notification.update( //อัพเดทข้อมูลการแจ้งเตือน
        { read: true }, //เปลี่ยนสถานะการอ่านเป็น true
        {
          where: { notification_id: req.body.notification_id[i] }, //เลือกข้อมูลที่มี notification_id เท่ากับ req.body.notification_id[i]
        }
      );
    }

    req.app.get("socketio").emit("notifications_" + req.user.users_id, []); //ส่งข้อมูลการแจ้งเตือนทั้งหมดไปที่ client ในรูปแบบ JSON

    res.status(200).json({ message: "Notification was updated successfully." }); //ส่งข้อความกลับไปที่ client ในรูปแบบ JSON 
  } catch (error) { //จัดการข้อผิดพลาด 
    next(error); //ส่งข้อผิดพลาดไปที่ error handler
  }
};

// New endpoint to mark all notifications as read
exports.markAllAsRead = async (req, res, next) => { //สร้างฟังก์ชัน markAllAsRead สำหรับอัพเดทข้อมูลการแจ้งเตือนทั้งหมดว่าอ่านแล้ว โดยรับ req, res, next เป็นพารามิเตอร์
  try { //ใช้ try catch เพื่อจัดการข้อผิดพลาด
    await Notification.update( //อัพเดทข้อมูลการแจ้งเตือน
      { read: true }, //เปลี่ยนสถานะการอ่านเป็น true
      {
        where: { user_id: req.user.users_id }, //เลือกข้อมูลที่มี user_id เท่ากับ req.user.users_id
      }
    );

    req.app.get("socketio").emit("notifications_" + req.user.users_id, []); //ส่งข้อมูลการแจ้งเตือนทั้งหมดไปที่ client ในรูปแบบ JSON 

    res.status(200).json({ message: "All notifications marked as read." }); //ส่งข้อความกลับไปที่ client ในรูปแบบ JSON
  } catch (error) { //จัดการข้อผิดพลาด
    next(error); //ส่งข้อผิดพลาดไปที่ error handler 
  }
};
