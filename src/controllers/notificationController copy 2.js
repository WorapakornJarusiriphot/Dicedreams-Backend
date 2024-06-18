const db = require("../models");
const Notification = db.notification;
const Participate = db.participate;
const User = db.user; // Ensure you have correct model name here
const Chat = db.chat; // Add this line to import the Chat model

// Define the relationships
Participate.belongsTo(User, { foreignKey: 'user_id' });
Chat.belongsTo(User, { foreignKey: 'user_id' });

// get all notification
exports.findAll = async (req, res, next) => {
  try {
    console.log(req.user.users_id);
    const messages = [];

    // get table notification by user_id where read = false
    const notifications = await Notification.findAll({
      where: { user_id: req.user.users_id, read: false },
    });

    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].type === "participate") {
        // ดึงข้อมูลจาก table participate โดยใช้ entity_id ที่ได้จาก table notification
        const participate = await Participate.findByPk(notifications[i].entity_id, {
          include: [{ model: User, attributes: ['first_name', 'last_name', 'user_image'] }]
        });
        if (participate && participate.user) {
          messages.push({
            type: "participate",
            data: {
              ...participate.toJSON(),
              first_name: participate.user.first_name,
              last_name: participate.user.last_name,
              user_image: participate.user.user_image
            },
            notification_id: notifications[i].notification_id,
            entity_id: notifications[i].entity_id,
            read: notifications[i].read,
            time: notifications[i].time,
          });
        }
      } else if (notifications[i].type === "chat") {
        // ดึงข้อมูลจาก table chat โดยใช้ entity_id ที่ได้จาก table notification
        const chat = await Chat.findByPk(notifications[i].entity_id, {
          include: [{ model: User, attributes: ['first_name', 'last_name', 'user_image'] }]
        });
        if (chat && chat.user) {
          messages.push({
            type: "chat",
            data: {
              ...chat.toJSON(),
              first_name: chat.user.first_name,
              last_name: chat.user.last_name,
              user_image: chat.user.user_image
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
    console.error('Error in findAll:', error);
    next(error);
  }
};

// update read notification
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    // get req.body.notification_id is array of notification_id to update read = true
    for (let i = 0; i < req.body.notification_id.length; i++) {
      const updated = await Notification.update(
        { read: true },
        {
          where: { notification_id: req.body.notification_id[i] },
        }
      );
    }

    // update socket.io to update notification to all client 
  
    req.app
    .get("socketio")
    .emit("notifications_" + req.user.users_id, []);

    res.status(200).json({ message: "Notification was updated successfully." });
  } catch (error) {
    next(error);
  }
};
