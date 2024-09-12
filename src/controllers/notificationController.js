const db = require("../models");
const Notification = db.notification;
const Participate = db.participate;
const User = db.user;
const Chat = db.chat;
const PostGame = db.post_games;

// Define the relationships
Participate.belongsTo(User, { foreignKey: "user_id" });
Participate.belongsTo(PostGame, { foreignKey: "post_games_id" });
PostGame.belongsTo(User, { foreignKey: "users_id" });

// get all notifications
exports.findAll = async (req, res, next) => {
  try {
    const messages = [];
    const notifications = await Notification.findAll({
      where: { user_id: req.user.users_id },
      order: [['time', 'DESC']], // เรียงลำดับจากเวลาใหม่สุดไปเก่าสุด
    });

    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].type === "participate") {
        const participate = await Participate.findByPk(
          notifications[i].entity_id,
          {
            include: [
              {
                model: User,
                attributes: ["first_name", "last_name", "user_image"],
              },
              {
                model: PostGame,
                include: [
                  {
                    model: User,
                    attributes: ["first_name", "last_name", "user_image"],
                  },
                ],
              },
            ],
          }
        );

        if (participate && participate.user && participate.post_game) {
          const postParticipants = await Participate.count({
            where: {
              post_games_id: participate.post_games_id,
              participant_status: "active",
            },
          });

          messages.push({
            type: "participate",
            data: {
              ...participate.toJSON(),
              first_name: participate.user.first_name,
              last_name: participate.user.last_name,
              user_image: participate.user.user_image,
              name_games: participate.post_game.name_games,
              detail_post: participate.post_game.detail_post,
              participants: postParticipants + 1,
              num_people: participate.post_game.num_people,
              date_meet: participate.post_game.date_meet,
              time_meet: participate.post_game.time_meet,
              game_user_first_name: participate.post_game.user.first_name,
              game_user_last_name: participate.post_game.user.last_name,
              game_user_image: participate.post_game.user.user_image,
            },
            notification_id: notifications[i].notification_id,
            entity_id: notifications[i].entity_id,
            read: notifications[i].read,
            time: notifications[i].time,
          });
        }
      } else if (notifications[i].type === "chat") {
        // เพิ่ม alias 'user' ตามที่ตั้งไว้ในโมเดล Chat
        const chat = await Chat.findByPk(notifications[i].entity_id, {
          include: [
            {
              model: User,
              as: "user", // ระบุ alias 'user' ที่เชื่อมโยงกับ Chat
              attributes: ["first_name", "last_name", "user_image"],
            },
          ],
        });

        if (chat && chat.user) {
          messages.push({
            type: "chat",
            data: {
              message: chat.message,
              datetime_chat: chat.datetime_chat,
              first_name: chat.user.first_name,
              last_name: chat.user.last_name,
              user_image: chat.user.user_image,
              post_games_id: chat.post_games_id, // เชื่อมโยงกับโพสต์เกม
            },
            notification_id: notifications[i].notification_id,
            entity_id: notifications[i].entity_id,
            read: notifications[i].read,
            time: notifications[i].time,
          });
        }
      }
    }

    res.status(200).json({ messages: messages });
  } catch (error) {
    console.error("Error in findAll:", error);
    next(error);
  }
};

// API สำหรับดึงการแจ้งเตือนด้วย pagination
exports.findUserNotifications = async (req, res, next) => {
  const { page = 1, limit = 105 } = req.query; // รับค่าจาก query string
  const offset = (page - 1) * limit; // คำนวณตำแหน่ง offset

  try {
    const messages = [];
    const notifications = await Notification.findAll({
      where: { user_id: req.user.users_id }, // ดึงเฉพาะการแจ้งเตือนของผู้ใช้
      order: [['time', 'DESC']], // เรียงจากใหม่สุด
      limit: parseInt(limit), // จำกัดจำนวนการแจ้งเตือนที่ดึง
      offset: parseInt(offset) // ระบุจุดเริ่มต้น
    });

    // วนลูปดึงข้อมูลการแจ้งเตือน
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].type === "participate") {
        const participate = await Participate.findByPk(
          notifications[i].entity_id,
          {
            include: [
              {
                model: User,
                attributes: ["first_name", "last_name", "user_image"],
              },
              {
                model: PostGame,
                include: [
                  {
                    model: User,
                    attributes: ["first_name", "last_name", "user_image"],
                  },
                ],
              },
            ],
          }
        );

        if (participate && participate.user && participate.post_game) {
          const postParticipants = await Participate.count({
            where: {
              post_games_id: participate.post_games_id,
              participant_status: "active",
            },
          });

          messages.push({
            type: "participate",
            data: {
              ...participate.toJSON(),
              first_name: participate.user.first_name,
              last_name: participate.user.last_name,
              user_image: participate.user.user_image,
              name_games: participate.post_game.name_games,
              participants: postParticipants + 1,
              num_people: participate.post_game.num_people,
              date_meet: participate.post_game.date_meet,
              time_meet: participate.post_game.time_meet,
            },
            notification_id: notifications[i].notification_id,
            read: notifications[i].read,
            time: notifications[i].time,
          });
        }
      } else if (notifications[i].type === "chat") {
        const chat = await Chat.findByPk(notifications[i].entity_id, {
          include: [
            {
              model: User,
              as: "user",
              attributes: ["first_name", "last_name", "user_image"],
            },
          ],
        });

        if (chat && chat.user) {
          messages.push({
            type: "chat",
            data: {
              message: chat.message,
              first_name: chat.user.first_name,
              last_name: chat.user.last_name,
              user_image: chat.user.user_image,
              post_games_id: chat.post_games_id,
            },
            notification_id: notifications[i].notification_id,
            read: notifications[i].read,
            time: notifications[i].time,
          });
        }
      }
    }

    res.status(200).json({
      messages: messages,
      page: parseInt(page), // ส่งหน้าปัจจุบันกลับไป
      total: notifications.length, // ส่งจำนวนการแจ้งเตือนทั้งหมดในหน้านี้กลับไป
    });
  } catch (error) {
    console.error("Error in findUserNotifications:", error);
    next(error);
  }
};

// update read notification
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;

    for (let i = 0; i < req.body.notification_id.length; i++) {
      const updated = await Notification.update(
        { read: true },
        {
          where: { notification_id: req.body.notification_id[i] },
        }
      );
    }

    req.app.get("socketio").emit("notifications_" + req.user.users_id, []);

    res.status(200).json({ message: "Notification was updated successfully." });
  } catch (error) {
    next(error);
  }
};

// New endpoint to mark all notifications as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.update(
      { read: true },
      {
        where: { user_id: req.user.users_id },
      }
    );

    req.app.get("socketio").emit("notifications_" + req.user.users_id, []);

    res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    next(error);
  }
};
