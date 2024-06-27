// ไฟล์นี้เป็นคอนโทรลเลอร์สำหรับจัดการการทำงานของ Chat ในแอปพลิเคชัน โดยใช้โมเดล Chat ที่นำเข้าจากไฟล์ ../models
const db = require("../models"); //เรียกใช้งานโมเดลจากไฟล์ ../models
const Chat = db.chat; //เรียกใช้งานโมเดล Chat จาก db

// ฟังก์ชัน create ใช้สำหรับสร้างข้อความแชทใหม่
exports.create = async (req, res, next) => { //สร้างฟังก์ชัน create โดยใช้ async function
  try { //ใช้ try เพื่อจัดการข้อผิดพลาด
    if (!req.body.message) { //ถ้าไม่มีข้อความ
      res.status(400).send({ //ส่งข้อความแจ้งเตือนว่า Content can not be empty!
        message: "Content can not be empty!", //ข้อความแจ้งเตือน
      }); //ส่งข้อความแจ้งเตือน
      return; //สิ้นสุดการทำงาน
    } //สิ้นสุดเงื่อนไข

    const chat = { //สร้างตัวแปร chat เป็น object ที่มี property ดังนี้
      message: req.body.message, //ข้อความ
      datetime_chat: req.body.datetime_chat, //เวลาที่ส่งข้อความ
      user_id: req.body.user_id, //ไอดีของผู้ใช้
      post_games_id: req.body.post_games_id, //ไอดีของเกม
    }; //สิ้นสุดการสร้างตัวแปร chat

    const data = await Chat.create(chat); //สร้างข้อความแชทใหม่

     const postGame = await db.post_games.findByPk(req.body.post_games_id); //ค้นหาเกมที่ต้องการสร้างข้อความแชท
         const notification = { //สร้างตัวแปร notification เป็น object ที่มี property ดังนี้
          type: "chat", //ประเภทของการแจ้งเตือน
          read: false, //อ่านแล้วหรือยัง
          time: new Date(), //เวลาที่สร้างการแจ้งเตือน
          user_id: postGame.dataValues.users_id, //ไอดีของผู้ใช้ //dataValues เป็นคุณสมบัติของอ็อบเจ็กต์ที่ถูกส่งคืนโดย Sequelize เมื่อทำการเรียกใช้เมธอดเช่น findByPk, findOne, หรือการสร้าง/อัปเดตแถวในฐานข้อมูลผ่าน ORM (Object-Relational Mapping) อย่าง Sequelize คุณสมบัตินี้ใช้ในการเข้าถึงค่าของฟิลด์ในแถวฐานข้อมูลที่ตรงกับโมเดลที่กำหนดไว้ใน Sequelize
          entity_id: data.dataValues.chat_id, //ไอดีของข้อความแชท
        };
        await db.notification.create(notification); //สร้างการแจ้งเตือนใหม่
    
        const messages = []; //สร้างตัวแปร messages เป็น array

        const notifications = await db.notification.findAll({ //ค้นหาการแจ้งเตือนทั้งหมด
          where: { user_id: postGame.dataValues.users_id, read: false }, //เงื่อนไขการค้นหา
        }); //ค้นหาการแจ้งเตือนทั้งหมด
        for (let i = 0; i < notifications.length; i++) { //วนลูปเพื่อดึงข้อมูลการแจ้งเตือนทั้งหมด
          if (notifications[i].type === "participate") { //ถ้าประเภทของการแจ้งเตือนเป็นการเข้าร่วม
            const participate = await db.participate.findByPk( //ค้นหาการเข้าร่วม
              notifications[i].entity_id //ไอดีของการเข้าร่วม
            ); //ค้นหาการเข้าร่วม
            messages.push({ //เพิ่มข้อมูลเข้าไปใน messages
              type: "participate", //ประเภทของการเข้าร่วม
              data: participate, //ข้อมูลการเข้าร่วม
              notification_id: notifications[i].notification_id, //ไอดีของการแจ้งเตือน
              entity_id: notifications[i].entity_id, //ไอดีของข้อมูล
              read: notifications[i].read, //อ่านแล้วหรือยัง
              time: notifications[i].time, //เวลาที่สร้างการแจ้งเตือน
            }); //เพิ่มข้อมูลเข้าไปใน messages
          } else if (notifications[i].type === "chat") { //ถ้าประเภทของการแจ้งเตือนเป็นการแชท
            const chat = await db.chat.findByPk(notifications[i].entity_id); //ค้นหาข้อความแชท
            messages.push({ //เพิ่มข้อมูลเข้าไปใน messages
              type: "chat", //ประเภทของการแชท
              data: chat, //ข้อมูลข้อความแชท
              notification_id: notifications[i].notification_id, //ไอดีของการแจ้งเตือน
              entity_id: notifications[i].entity_id, //ไอดีของข้อมูล
              read: notifications[i].read, //อ่านแล้วหรือยัง
              time: notifications[i].time, //เวลาที่สร้างการแจ้งเตือน
            }); //เพิ่มข้อมูลเข้าไปใน messages
          } //สิ้นสุดเงื่อนไข
        } //สิ้นสุดการวนลูป
    
        req.app //ส่งข้อมูลไปยังแอปพลิเคชัน
          .get("socketio") //เรียกใช้งาน socketio
          .emit("notifications_" + postGame.dataValues.users_id, messages); //ส่งข้อมูลไปยังผู้ใช้ที่เกี่ยวข้อง

    res //ส่งข้อมูลไปยังผู้ใช้
      .status(201) //สถานะการทำงาน 201 คือ "Created" ซึ่งหมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์สำเร็จและได้สร้างทรัพยากรใหม่ตามคำขอนั้น
      .json({ message: "Game was created successfully.", data: data }); //ส่งข้อความแจ้งเตือน
  } catch (error) { //จัดการข้อผิดพลาด หากมีข้อผิดพลาด จะทำการทำงานในบล็อค catch แทน 
    next(error); //ส่งข้อผิดพลาดไปยัง middleware ถัดไป
  } //สิ้นสุดการจัดการข้อผิดพลาด
}; //สิ้นสุดฟังก์ชัน create

// Retrieve all games from the database.
// ฟังก์ชัน findAll ใช้สำหรับดึงข้อมูลแชททั้งหมดจากฐานข้อมูล
exports.findAll = (req, res) => { //สร้างฟังก์ชัน findAll โดยใช้ function ที่ไม่มี async function และ await ในการทำงาน 
  Chat.findAll() //ค้นหาข้อมูลทั้งหมด 
    .then((data) => { //เมื่อค้นหาข้อมูลเสร็จแล้ว จะทำการส่งข้อมูลไปยังผู้ใช้ 
      res.status(200).json(data); //ส่งข้อมูลไปยังผู้ใช้ โดยสถานะการทำงาน 200 คือ "OK" ซึ่งหมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์สำเร็จ
    }) //สิ้นสุดการส่งข้อมูลไปยังผู้ใช้
    .catch((error) => { //จัดการข้อผิดพลาด หากมีข้อผิดพลาด จะทำการทำงานในบล็อค catch แทน 
      res.status(500).json({ //ส่งข้อผิดพลาดไปยังผู้ใช้ โดยสถานะการทำงาน 500 คือ "Internal Server Error" ซึ่งหมายความว่ามีข้อผิดพลาดบางอย่างบนเซิร์ฟเวอร์
        message: //ข้อความแจ้งเตือน 
          error.message || "Some error occurred while retrieving games.", //ข้อความแจ้งเตือน หรือ ข้อความแจ้งเตือนเริ่มต้น 
      }); //ส่งข้อผิดพลาดไปยังผู้ใช้ 
    }); //สิ้นสุดการจัดการข้อผิดพลาด
}; //สิ้นสุดฟังก์ชัน findAll 

// Find a single game with an id
// ฟังก์ชัน findOne ใช้สำหรับดึงข้อมูลแชทด้วยไอดี
exports.findOne = (req, res) => { //สร้างฟังก์ชัน findOne โดยใช้ function ที่ไม่มี async function และ await ในการทำงาน 
  const id = req.params.id; //รับไอดีของข้อความแชทจากผู้ใช้ 

  Chat.findByPk(id) //ค้นหาข้อมูลด้วยไอดี 
    .then((data) => { //เมื่อค้นหาข้อมูลเสร็จแล้ว จะทำการส่งข้อมูลไปยังผู้ใช้ 
      res.status(200).json(data); //ส่งข้อมูลไปยังผู้ใช้ โดยสถานะการทำงาน 200 คือ "OK" ซึ่งหมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์สำเร็จ
    }) //สิ้นสุดการส่งข้อมูลไปยังผู้ใช้ 
    .catch((error) => { //จัดการข้อผิดพลาด หากมีข้อผิดพลาด จะทำการทำงานในบล็อค catch แทน 
      res.status(500).json({ //ส่งข้อผิดพลาดไปยังผู้ใช้ โดยสถานะการทำงาน 500 คือ "Internal Server Error" ซึ่งหมายความว่ามีข้อผิดพลาดบางอย่างบนเซิร์ฟเวอร์
        message: "Error retrieving game with id=" + id, //ข้อความแจ้งเตือน เกิดข้อผิดพลาดในการเรียกข้อมูลเกมด้วย id
      }); //ส่งข้อผิดพลาดไปยังผู้ใช้ 
    }); //สิ้นสุดการจัดการข้อผิดพลาด
}; //สิ้นสุดฟังก์ชัน findOne 

// Update a game by the id in the request
// ฟังก์ชัน update ใช้สำหรับอัปเดตข้อมูลข้อความแชท
exports.update = async (req, res, next) => { //สร้างฟังก์ชัน update โดยใช้ async function 
  const id = req.params.id; //รับไอดีของข้อความแชทจากผู้ใช้ 

  try { //ใช้ try เพื่อจัดการข้อผิดพลาด 
    const data = await Chat.update(req.body, { //อัปเดตข้อมูลข้อความแชท 
      where: { chat_id: id }, //เงื่อนไขการอัปเดตข้อมูล 
    }); //อัปเดตข้อมูลข้อความแชท 
    if (data == 1) { //ถ้าอัปเดตข้อมูลสำเร็จ //การเปรียบเทียบ == 1 เป็นวิธีตรวจสอบว่ามีแถวหนึ่งแถวถูกอัปเดตจริงๆ ซึ่งช่วยให้เรารู้ว่าการอัปเดตสำเร็จหรือไม่ การใช้ true หรือ false ไม่สามารถระบุจำนวนแถวที่ถูกอัปเดตได้ชัดเจนเท่ากับการใช้จำนวนแถวที่ถูกอัปเดต

          const chat = await Chat.findByPk(id); //ค้นหาข้อความแชท 

          const notification = { //สร้างตัวแปร notification เป็น object ที่มี property ดังนี้ 
            type: "chat", //ประเภทของการแจ้งเตือน 
            read: false, //อ่านแล้วหรือยัง 
            time: new Date(), //เวลาที่สร้างการแจ้งเตือน 
            user_id: chat.dataValues.user_id, //ไอดีของผู้ใช้ 
            entity_id: id, //ไอดีของข้อความแชท 
          };
          await db.notification.create(notification); //สร้างการแจ้งเตือนใหม่ 

          const messages = []; //สร้างตัวแปร messages เป็น array 

          const notifications = await db.notification.findAll({ //ค้นหาการแจ้งเตือนทั้งหมด 
            where: { user_id: chat.dataValues.user_id, read: false }, //เงื่อนไขการค้นหา 
          }); //ค้นหาการแจ้งเตือนทั้งหมด
          for (let i = 0; i < notifications.length; i++) { //วนลูปเพื่อดึงข้อมูลการแจ้งเตือนทั้งหมด 
            if (notifications[i].type === "participate") { //ถ้าประเภทของการแจ้งเตือนเป็นการเข้าร่วม 
              const participate = await db.participate.findByPk( //ค้นหาการเข้าร่วม 
                notifications[i].entity_id //ไอดีของการเข้าร่วม 
              ); //ค้นหาการเข้าร่วม 
              messages.push({ //เพิ่มข้อมูลเข้าไปใน messages 
                type: "participate", //ประเภทของการเข้าร่วม 
                data: participate, //ข้อมูลการเข้าร่วม 
                notification_id: notifications[i].notification_id, //ไอดีของการแจ้งเตือน 
                entity_id: notifications[i].entity_id, //ไอดีของข้อมูล 
                read: notifications[i].read, //อ่านแล้วหรือยัง 
                time: notifications[i].time, //เวลาที่สร้างการแจ้งเตือน 
              }); //เพิ่มข้อมูลเข้าไปใน messages 
            } else if (notifications[i].type === "chat") { //ถ้าประเภทของการแจ้งเตือนเป็นการแชท 
              const chat = await db.chat.findByPk(notifications[i].entity_id); //ค้นหาข้อความแชท 
              messages.push({ //เพิ่มข้อมูลเข้าไปใน messages 
                type: "chat", //ประเภทของการแชท 
                data: chat, //ข้อมูลข้อความแชท 
                notification_id: notifications[i].notification_id, //ไอดีของการแจ้งเตือน 
                entity_id: notifications[i].entity_id, //ไอดีของข้อมูล 
                read: notifications[i].read, //อ่านแล้วหรือยัง 
                time: notifications[i].time, //เวลาที่สร้างการแจ้งเตือน 
              }); //เพิ่มข้อมูลเข้าไปใน messages
            } //สิ้นสุดเงื่อนไข
          } //สิ้นสุดการวนลูป
          req.app //ส่งข้อมูลไปยังแอปพลิเคชัน 
            .get("socketio") //เรียกใช้งาน socketio 
            .emit("notifications_" + chat.dataValues.user_id, messages); //ส่งข้อมูลไปยังผู้ใช้ที่เกี่ยวข้อง 

      res.status(200).json({ //ส่งข้อมูลไปยังผู้ใช้ 
        message: "Game was updated successfully.", //ข้อความแจ้งเตือน 
      }); //ส่งข้อมูลไปยังผู้ใช้ 
    } else { //ถ้าอัปเดตข้อมูลไม่สำเร็จ 
      res.status(400).json({ //ส่งข้อผิดพลาดไปยังผู้ใช้ โดยสถานะการทำงาน 400 คือ "Bad Request" ซึ่งหมายความว่าเซิร์ฟเวอร์ไม่สามารถเข้าใจคำขอ (request) ที่ส่งมา
        message: `Cannot update game with id=${id}. Maybe game was not found or req.body is empty!`, //ข้อความแจ้งเตือน 
      }); 
    }
  } catch (error) { //จัดการข้อผิดพลาด หากมีข้อผิดพลาด จะทำการทำงานในบล็อค catch แทน 
    next(error); //ส่งข้อผิดพลาดไปยัง middleware ถัดไป 
  } //สิ้นสุดการจัดการข้อผิดพลาด
};

// Delete a game with the specified id in the request
// ฟังก์ชัน delete ใช้สำหรับลบข้อมูลข้อความแชท
exports.delete = async (req, res, next) => { //สร้างฟังก์ชัน delete โดยใช้ async function 
  const id = req.params.id; //รับไอดีของข้อความแชทจากผู้ใช้ 

  try { //ใช้ try เพื่อจัดการข้อผิดพลาด
    const data = await Chat.destroy({ //ลบข้อมูลข้อความแชท 
      where: { chat_id: id }, //เงื่อนไขการลบข้อมูล
    }); //ลบข้อมูลข้อความแชท
    if (data == 1) { //ถ้าลบข้อมูลสำเร็จ //การเปรียบเทียบ == 1 เป็นวิธีตรวจสอบว่ามีแถวหนึ่งถูกลบจริงๆ ซึ่งช่วยให้เรารู้ว่าการลบสำเร็จหรือไม่ การใช้ true หรือ false ไม่สามารถระบุจำนวนแถวที่ถูกลบได้ชัดเจนเท่ากับการใช้จำนวนแถวที่ถูกลบ
      res.status(200).json({ //ส่งข้อมูลไปยังผู้ใช้
        message: "Game was deleted successfully!", //ข้อความแจ้งเตือน
      }); //ส่งข้อมูลไปยังผู้ใช้ 
    } else { //ถ้าลบข้อมูลไม่สำเร็จ 
      res.status(400).json({ //ส่งข้อผิดพลาดไปยังผู้ใช้ โดยสถานะการทำงาน 400 คือ "Bad Request" ซึ่งหมายความว่าเซิร์ฟเวอร์ไม่สามารถเข้าใจคำขอ (request) ที่ส่งมา
        message: `Cannot delete game with id=${id}. Maybe game was not found!`, //ข้อความแจ้งเตือน
      }); //ส่งข้อผิดพลาดไปยังผู้ใช้
    } //สิ้นสุดเงื่อนไข
  } catch (error) { //จัดการข้อผิดพลาด หากมีข้อผิดพลาด จะทำการทำงานในบล็อค catch แทน
    next(error); //ส่งข้อผิดพลาดไปยัง middleware ถัดไป 
  }
};

// Delete all games from the database.
// ฟังก์ชัน deleteAll ใช้สำหรับลบข้อมูลข้อความแชททั้งหมด
exports.deleteAll = async (req, res, next) => { //สร้างฟังก์ชัน deleteAll โดยใช้ async function 
  try { //ใช้ try เพื่อจัดการข้อผิดพลาด 
    const data = await Chat.destroy({ //ลบข้อมูลข้อความแชททั้งหมด 
      where: {}, //เงื่อนไขการลบข้อมูล 
      truncate: false, //ลบข้อมูลโดยไม่ตัดตัวแปร 
    }); //ลบข้อมูลข้อความแชททั้งหมด 
    res.status(200).json({ message: `${data} Games were deleted successfully!` }); //ส่งข้อความแจ้งเตือน 
  } catch (error) { //จัดการข้อผิดพลาด หากมีข้อผิดพลาด จะทำการทำงานในบล็อค catch แทน 
    next(error); //ส่งข้อผิดพลาดไปยัง middleware ถัดไป 
  }
};

// Find all published games
// ฟังก์ชัน findAllPublished ใช้สำหรับดึงข้อมูลข้อความแชทที่เผยแพร่ทั้งหมด
exports.findAllPublished = (req, res) => { //สร้างฟังก์ชัน findAllPublished โดยใช้ function ที่ไม่มี async function และ await ในการทำงาน
  Chat.findAll({ where: { published: true } }) //ค้นหาข้อมูลที่เผยแพร่ทั้งหมด 
    .then((data) => { //เมื่อค้นหาข้อมูลเสร็จแล้ว จะทำการส่งข้อมูลไปยังผู้ใช้ 
      res.status(200).json(data); //ส่งข้อมูลไปยังผู้ใช้ โดยสถานะการทำงาน 200 คือ "OK" ซึ่งหมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์สำเร็จ
    })
    .catch((error) => { //จัดการข้อผิดพลาด หากมีข้อผิดพลาด จะทำการทำงานในบล็อค catch แทน
      res.status(500).json({ //ส่งข้อผิดพลาดไปยังผู้ใช้ โดยสถานะการทำงาน 500 คือ "Internal Server Error" ซึ่งหมายความว่ามีข้อผิดพลาดบางอย่างบนเซิร์ฟเวอร์
        message: //ข้อความแจ้งเตือน 
          error.message || "Some error occurred while retrieving games.", //ข้อความแจ้งเตือน หรือ ข้อความแจ้งเตือนเริ่มต้น 
      });
    });
};

// Find all games by user
// ฟังก์ชัน findAllByUser ใช้สำหรับดึงข้อมูลข้อความแชททั้งหมดโดยผู้ใช้
exports.findAllByUser = (req, res) => { //สร้างฟังก์ชัน findAllByUser โดยใช้ function ที่ไม่มี async function และ await ในการทำงาน 
  const user_id = req.params.user_id; //รับไอดีของผู้ใช้จากผู้ใช้ 
  Chat.findAll({ where: { user_id: user_id } })
    .then((data) => { //เมื่อค้นหาข้อมูลเสร็จแล้ว จะทำการส่งข้อมูลไปยังผู้ใช้ 
      res.status(200).json(data); //ส่งข้อมูลไปยังผู้ใช้ โดยสถานะการทำงาน 200 คือ "OK" ซึ่งหมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์สำเร็จ
    })
    .catch((error) => { //จัดการข้อผิดพลาด หากมีข้อผิดพลาด จะทำการทำงานในบล็อค catch แทน 
      res.status(500).json({ //ส่งข้อผิดพลาดไปยังผู้ใช้ โดยสถานะการทำงาน 500 คือ "Internal Server Error" ซึ่งหมายความว่ามีข้อผิดพลาดบางอย่างบนเซิร์ฟเวอร์
        message: //ข้อความแจ้งเตือน
          error.message || "Some error occurred while retrieving games.", //ข้อความแจ้งเตือน หรือ ข้อความแจ้งเตือนเริ่มต้น
      });
    });
};

// Find all games by post_games_id
// ฟังก์ชัน findAllByPostGamesId ใช้สำหรับดึงข้อมูลข้อความแชททั้งหมดโดยไอดีของเกม
exports.findAllByPostGamesId = (req, res) => { //สร้างฟังก์ชัน findAllByPostGamesId โดยใช้ function ที่ไม่มี async function และ await ในการทำงาน
  const post_games_id = req.params.post_games_id; //รับไอดีของเกมจากผู้ใช้
  Chat.findAll({ where: { post_games_id: post_games_id } }) //ค้นหาข้อมูลทั้งหมดโดยไอดีของเกม 
    .then((data) => { //เมื่อค้นหาข้อมูลเสร็จแล้ว จะทำการส่งข้อมูลไปยังผู้ใช้
      res.status(200).json(data); //ส่งข้อมูลไปยังผู้ใช้ โดยสถานะการทำงาน 200 คือ "OK" ซึ่งหมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์สำเร็จ
    })
    .catch((error) => { //จัดการข้อผิดพลาด หากมีข้อผิดพลาด จะทำการทำงานในบล็อค catch แทน
      res.status(500).json({ //ส่งข้อผิดพลาดไปยังผู้ใช้ โดยสถานะการทำงาน 500 คือ "Internal Server Error" ซึ่งหมายความว่ามีข้อผิดพลาดบางอย่างบนเซิร์ฟเวอร์
        message: //ข้อความแจ้งเตือน
          error.message || "Some error occurred while retrieving games.", //ข้อความแจ้งเตือน หรือ ข้อความแจ้งเตือนเริ่มต้น
      });
    });
};
 


