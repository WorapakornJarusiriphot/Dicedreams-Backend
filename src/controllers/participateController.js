//ไฟล์นี้เป็นคอนโทรลเลอร์สำหรับจัดการการเข้าร่วมกิจกรรม (participate) ในแอปพลิเคชัน โดยใช้ไลบรารี Sequelize เพื่อจัดการกับฐานข้อมูลและการทำงานต่างๆ ที่เกี่ยวข้องกับการเข้าร่วมกิจกรรม
const db = require("../models"); //เรียกใช้งาน db ที่เป็นโมดูลของ Sequelize
const Participate = db.participate;  //เรียกใช้งาน participate จาก db

// Create and Save a new Participate
//ฟังก์ชันนี้ใช้สำหรับสร้างการเข้าร่วมกิจกรรมใหม่ โดยมีการตรวจสอบว่า user_id ไม่เป็นค่าว่างและผู้ใช้ไม่ได้เข้าร่วมกิจกรรมเดียวกันซ้ำ 
// เมื่อผ่านการตรวจสอบแล้วจะบันทึกข้อมูลลงฐานข้อมูลและสร้างการแจ้งเตือนใหม่
exports.create = async (req, res, next) => { //สร้างและบันทึกข้อมูลการเข้าร่วมกิจกรรมใหม่ 
  try { 
    // Validate request
    if (!req.body.user_id) { //ตรวจสอบว่ามีข้อมูล user_id หรือไม่
      res.status(400).send({ //ถ้าไม่มีให้แสดงข้อความว่า Content can not be empty!
        message: "Content can not be empty!", 
      }); 
      return; 
    }

    // check if the user already participate
    const user_id = req.body.user_id; 
    const post_games_id = req.body.post_games_id; 
    const check = await Participate.findOne({ //ตรวจสอบว่า user ได้เข้าร่วมกิจกรรมนี้แล้วหรือยัง
      where: { user_id: user_id, post_games_id: post_games_id },  //เงื่อนไขในการค้นหาว่ามี user_id และ post_games_id ตรงกันหรือไม่
    }); 
    if (check) {  //ถ้ามีแล้วให้แสดงข้อความว่า You already participate this game!
      res.status(400).send({  //และส่งค่า status 400 กลับไป
        message: "You already participate this game!",  //แสดงข้อความว่า You already participate this game!
      });
      return; 
    }

    // Create a Participate
    const participate = { //กำหนดค่าให้กับตัวแปร participate โดยมี key และ value ดังนี้ 
      participant_apply_datetime: req.body.participant_apply_datetime,  //วันที่สมัครเข้าร่วมกิจกรรม
      participant_status: req.body.participant_status,  //สถานะการเข้าร่วมกิจกรรม
      user_id: req.body.user_id,  //user_id ที่เข้าร่วมกิจกรรม
      post_games_id: req.body.post_games_id,  //post_games_id ที่เข้าร่วมกิจกรรม
    };

    // Save Participate in the database async
    const data = await Participate.create(participate); //บันทึกข้อมูลการเข้าร่วมกิจกรรมลงในฐานข้อมูล และเก็บข้อมูลที่บันทึกไว้ในตัวแปร data 

    //select postgame by post_game_id
    const postGame = await db.post_games.findByPk(post_games_id); //ค้นหาข้อมูล post_games โดยใช้ post_games_id ที่ได้จากการสร้างข้อมูลการเข้าร่วมกิจกรรม 

     // insert table notification
     const notification = { //กำหนดค่าให้กับตัวแปร notification โดยมี key และ value ดังนี้
      type: "participate", //ประเภทการแจ้งเตือน คือ participate
      read: false, //สถานะการอ่าน คือ false
      time: new Date(), //เวลาที่แจ้งเตือน คือ ปัจจุบัน
      user_id: postGame.dataValues.users_id, //user_id ของ post_game ที่เข้าร่วมกิจกรรม 
      entity_id: data.dataValues.part_Id, //entity_id ของข้อมูลการเข้าร่วมกิจกรรม 
    }; 
    await db.notification.create(notification); //บันทึกข้อมูลการแจ้งเตือนลงในฐานข้อมูล

    const messages = []; //สร้างตัวแปร messages เป็น array เพื่อเก็บข้อมูลการแจ้งเตือน 

    // get table notification by user_id where read = false
    const notifications = await db.notification.findAll({ //ค้นหาข้อมูลการแจ้งเตือนโดยใช้ user_id และสถานะการอ่านเป็น false
      where: { user_id: postGame.dataValues.users_id, read: false }, //เงื่อนไขในการค้นหาข้อมูล
    }); 
    for (let i = 0; i < notifications.length; i++) { //วนลูปเพื่อดึงข้อมูลการแจ้งเตือนที่ตรงเงื่อนไข
      if (notifications[i].type === "participate") { //ถ้าประเภทการแจ้งเตือนเป็น participate
        const participate = await Participate.findByPk( //ค้นหาข้อมูลการเข้าร่วมกิจกรรมโดยใช้ id ของการแจ้งเตือน 
          notifications[i].entity_id  //entity_id ของข้อมูลการแจ้งเตือน 
        );
        messages.push({ //เพิ่มข้อมูลการแจ้งเตือนลงใน messages 
          type: "participate", //ประเภทการแจ้งเตือน คือ participate
          data: participate, //ข้อมูลการเข้าร่วมกิจกรรม 
          notification_id: notifications[i].notification_id, //id ของการแจ้งเตือน 
          entity_id: notifications[i].entity_id, //id ของข้อมูลการแจ้งเตือน 
          read: notifications[i].read, //สถานะการอ่านของการแจ้งเตือน 
          time: notifications[i].time, //เวลาที่แจ้งเตือน 
        });
      } else if (notifications[i].type === "chat") { //ถ้าประเภทการแจ้งเตือนเป็น chat
        const chat = await db.chat.findByPk(notifications[i].entity_id); //ค้นหาข้อมูลการแชทโดยใช้ id ของการแจ้งเตือน
        messages.push({ //เพิ่มข้อมูลการแจ้งเตือนลงใน messages
          type: "chat", //ประเภทการแจ้งเตือน คือ chat
          data: chat,
          notification_id: notifications[i].notification_id,
          entity_id: notifications[i].entity_id,
          read: notifications[i].read,
          time: notifications[i].time,
        });
      }
    }

    req.app //ส่งข้อมูลการแจ้งเตือนไปยัง client โดยใช้ socketio 
      .get("socketio") //เรียกใช้งาน socketio จาก app.js 
      .emit("notifications_" + postGame.dataValues.users_id, messages); //ส่งข้อมูลการแจ้งเตือนไปยัง client โดยใช้ socketio 

    res //ส่งข้อมูลการแจ้งเตือนไปยัง client โดยใช้ socketio 
      .status(201) //ส่ง status 201 กลับไป 
      .json({ message: "Participate was created successfully.", data: data }); //แสดงข้อความว่า Participate was created successfully. และส่งข้อมูลที่บันทึกไว้ในตัวแปร data กลับไป
  } catch (error) { //ถ้าเกิดข้อผิดพลาด 
    next(error); //ส่งข้อผิดพลาดไปยัง middleware ถัดไป
  }
};

// Retrieve all Participates from the database.
// ฟังก์ชันนี้ดึงข้อมูลการเข้าร่วมทั้งหมดจากฐานข้อมูลและส่งกลับในรูปแบบ JSON
exports.findAll = (req, res) => { //ดึงข้อมูลการเข้าร่วมกิจกรรมทั้งหมด 
  Participate.findAll() //ค้นหาข้อมูลการเข้าร่วมกิจกรรมทั้งหมด 
    .then((data) => { //เมื่อค้นหาข้อมูลเสร็จแล้ว 
      res.status(200).json(data); //ส่งข้อมูลที่ค้นหาได้กลับไป 
    })
    .catch((error) => { //ถ้าเกิดข้อผิดพลาด
      res.status(500).json({ //ส่ง status 500 กลับไป 
        message: //แสดงข้อความว่า Some error occurred while retrieving Participates.
          error.message || "Some error occurred while retrieving Participates.", //แสดงข้อความว่า Some error occurred while retrieving Participates.
      });
    });
};

// Find a single Participate with an id
// ฟังก์ชันนี้ดึงข้อมูลการเข้าร่วมที่มี ID ตรงกับที่ระบุใน req.params.id และส่งกลับในรูปแบบ JSON
exports.findOne = (req, res) => { //ค้นหาข้อมูลการเข้าร่วมกิจกรรมด้วย id 
  const id = req.params.id; //รับค่า id จาก params 

  Participate.findByPk(id) //ค้นหาข้อมูลการเข้าร่วมกิจกรรมโดยใช้ id 
    .then((data) => { //เมื่อค้นหาข้อมูลเสร็จแล้ว
      res.status(200).json(data); //ส่งข้อมูลที่ค้นหาได้กลับไป 
    })
    .catch((error) => { //ถ้าเกิดข้อผิดพลาด
      res.status(500).json({ //ส่ง status 500 กลับไป
        message: "Error retrieving Participate with id=" + id, //แสดงข้อความว่า Error retrieving Participate with id= และตามด้วย id ที่ค้นหา
      });
    });
};

// Update a Participate by the id in the request
// ฟังก์ชันนี้อัปเดตข้อมูลการเข้าร่วมที่มี ID ตรงกับที่ระบุใน req.params.id และสร้างการแจ้งเตือนใหม่เมื่ออัปเดตสำเร็จ
exports.update = async (req, res, next) => { //อัพเดทข้อมูลการเข้าร่วมกิจกรรมโดยใช้ id ใน request 
  const id = req.params.id;

  try {

    const updated = await Participate.update(req.body, { //อัพเดทข้อมูลการเข้าร่วมกิจกรรมโดยใช้ id และข้อมูลใหม่ที่จะอัพเดท 
      where: { part_Id: id }, //เงื่อนไขในการค้นหาข้อมูลที่จะอัพเดท 
    });

    if (updated) { //ถ้าอัพเดทสำเร็จ
      // get in table participate by id
      const parti = await Participate.findByPk(id); //ค้นหาข้อมูลการเข้าร่วมกิจกรรมโดยใช้ id ที่อัพเดท 

      // insert table notification
      const notification = { //กำหนดค่าให้กับตัวแปร notification โดยมี key และ value ดังนี้
        type: "participate", //ประเภทการแจ้งเตือน คือ participate
        read: false, //สถานะการอ่าน คือ false
        time: new Date(), //เวลาที่แจ้งเตือน คือ ปัจจุบัน
        user_id: parti.dataValues.user_id, //user_id ของ user ที่เข้าร่วมกิจกรรม
        entity_id: id, //entity_id ของข้อมูลการเข้าร่วมกิจกรรม
      };
      await db.notification.create(notification); //บันทึกข้อมูลการแจ้งเตือนลงในฐานข้อมูล

      const messages = []; //สร้างตัวแปร messages เป็น array เพื่อเก็บข้อมูลการแจ้งเตือน

      // get table notification by user_id where read = false
      const notifications = await db.notification.findAll({ //ค้นหาข้อมูลการแจ้งเตือนโดยใช้ user_id และสถานะการอ่านเป็น false
        where: { user_id: parti.dataValues.user_id, read: false }, //เงื่อนไขในการค้นหาข้อมูล  
      }); 
      for (let i = 0; i < notifications.length; i++) { //วนลูปเพื่อดึงข้อมูลการแจ้งเตือนที่ตรงเงื่อนไข
        if (notifications[i].type === "participate") { //ถ้าประเภทการแจ้งเตือนเป็น participate
          const participate = await Participate.findByPk( //ค้นหาข้อมูลการเข้าร่วมกิจกรรมโดยใช้ id ของการแจ้งเตือน
            notifications[i].entity_id
          );
          messages.push({
            type: "participate",
            data: participate,
            notification_id: notifications[i].notification_id,
            entity_id: notifications[i].entity_id,
            read: notifications[i].read,
            time: notifications[i].time,
          });
        } else if (notifications[i].type === "chat") {
          const chat = await db.chat.findByPk(notifications[i].entity_id);
          messages.push({
            type: "chat",
            data: chat,
            notification_id: notifications[i].notification_id,
            entity_id: notifications[i].entity_id,
            read: notifications[i].read,
            time: notifications[i].time,
          });
        }
      }

      // get socketio from app.js and emit to client

      req.app
        .get("socketio")
        .emit("notifications_" + parti.dataValues.user_id, messages);
      res
        .status(200)
        .json({ message: "Participate was updated successfully." });
    } else {
      res.status(404).json({
        message: `Cannot update Participate with id=${id}. Maybe Participate was not found or req.body is empty!`,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Delete a Participate with the specified id in the request
// ฟังก์ชันนี้ลบข้อมูลการเข้าร่วมที่มี ID ตรงกับที่ระบุใน req.params.id และส่งข้อความยืนยันเมื่อการลบสำเร็จ
exports.delete = async (req, res, next) => {
  const id = req.params.id;

  try {
    const deleted = await Participate.destroy({
      where: { part_Id: id },
    });
    if (deleted) {
      res
        .status(200)
        .json({ message: "Participate was deleted successfully." });
    } else {
      res.status(404).json({
        message: `Cannot delete Participate with id=${id}. Maybe Participate was not found!`,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Delete all Participates from the database.
// ฟังก์ชันนี้ลบข้อมูลการเข้าร่วมทั้งหมดจากฐานข้อมูลและส่งข้อความยืนยันเมื่อการลบสำเร็จ
exports.deleteAll = async (req, res, next) => {
  try {
    const deleted = await Participate.destroy({
      where: {},
      truncate: false,
    });
    res
      .status(200)
      .json({ message: `${deleted} Participates were deleted successfully.` });
  } catch (error) {
    next(error);
  }
};

// Retrieve all Participates by post_games_id
// ฟังก์ชันนี้ดึงข้อมูลการเข้าร่วมทั้งหมดที่มี post_games_id ตรงกับที่ระบุใน req.params.id และส่งกลับในรูปแบบ JSON
exports.findAllByPostGamesId = async (req, res, next) => {
  const post_games_id = req.params.id;
  try {
    const data = await Participate.findAll({
      where: { post_games_id: post_games_id },
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Retrieve all Participates by user_id
// ฟังก์ชันนี้ดึงข้อมูลการเข้าร่วมทั้งหมดที่มี user_id ตรงกับที่ระบุใน req.params.userId และส่งกลับในรูปแบบ JSON
exports.findAllByUserId = async (req, res, next) => {
  const user_id = req.params.userId; 
  try {
    const data = await Participate.findAll({
      where: { user_id: user_id },
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// ในไฟล์นี้มีการจัดการกับการเข้าร่วมกิจกรรม (participate) รวมถึงการสร้าง อัปเดต ลบ และดึงข้อมูลการเข้าร่วม โดยใช้ไลบรารี Sequelize และมีการจัดการการแจ้งเตือนผ่าน socketio