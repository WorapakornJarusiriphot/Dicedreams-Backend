const db = require("../models");
const Chat = db.chat;
const User = db.user;

// Create Chat
exports.create = async (req, res, next) => {
  try {
    if (!req.body.message) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    const chat = {
      message: req.body.message,
      datetime_chat: req.body.datetime_chat,
      user_id: req.body.user_id,
      post_games_id: req.body.post_games_id,
    };

    const data = await Chat.create(chat);

     const postGame = await db.post_games.findByPk(req.body.post_games_id);
         const notification = {
          type: "chat",
          read: false,
          time: new Date(),
          user_id: postGame.dataValues.users_id,
          entity_id: data.dataValues.chat_id,
        };
        await db.notification.create(notification);
    
        const messages = [];

        const notifications = await db.notification.findAll({
          where: { user_id: postGame.dataValues.users_id, read: false },
        });
        for (let i = 0; i < notifications.length; i++) {
          if (notifications[i].type === "participate") {
            const participate = await db.participate.findByPk(
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
    
        req.app
          .get("socketio")
          .emit("notifications_" + postGame.dataValues.users_id, messages);

    res
      .status(201)
      .json({ message: "Game was created successfully.", data: data });
  } catch (error) {
    next(error);
  }
};

// Retrieve all games from the database.
exports.findAll = (req, res) => {
  Chat.findAll({
    order: [['createdAt', 'ASC']], // เรียงลำดับจากอดีตไปใหม่ที่สุด
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message:
          error.message || "Some error occurred while retrieving chats.",
      });
    });
};

// Find a single game with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Chat.findByPk(id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving game with id=" + id,
      });
    });
};

// Update a game by the id in the request
exports.update = async (req, res, next) => {
  const id = req.params.id;

  try {
    const data = await Chat.update(req.body, {
      where: { chat_id: id },
    });
    if (data == 1) {

          const chat = await Chat.findByPk(id);

          const notification = {
            type: "chat",
            read: false,
            time: new Date(),
            user_id: chat.dataValues.user_id,
            entity_id: id,
          };
          await db.notification.create(notification);

          const messages = [];

          const notifications = await db.notification.findAll({
            where: { user_id: chat.dataValues.user_id, read: false },
          });
          for (let i = 0; i < notifications.length; i++) {
            if (notifications[i].type === "participate") {
              const participate = await db.participate.findByPk(
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
          req.app
            .get("socketio")
            .emit("notifications_" + chat.dataValues.user_id, messages);

      res.status(200).json({
        message: "Game was updated successfully.",
      });
    } else {
      res.status(400).json({
        message: `Cannot update game with id=${id}. Maybe game was not found or req.body is empty!`,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Delete a game with the specified id in the request
exports.delete = async (req, res, next) => {
  const id = req.params.id;

  try {
    const data = await Chat.destroy({
      where: { chat_id: id },
    });
    if (data == 1) {
      res.status(200).json({
        message: "Game was deleted successfully!",
      });
    } else {
      res.status(400).json({
        message: `Cannot delete game with id=${id}. Maybe game was not found!`,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Delete all games from the database.
exports.deleteAll = async (req, res, next) => {
  try {
    const data = await Chat.destroy({
      where: {},
      truncate: false,
    });
    res.status(200).json({ message: `${data} Games were deleted successfully!` });
  } catch (error) {
    next(error);
  }
};

// Find all games by user
exports.findAllByUser = (req, res) => {
  const user_id = req.params.user_id;
  Chat.findAll({
    where: { user_id: user_id },
    order: [['createdAt', 'ASC']], // เรียงลำดับจากอดีตไปใหม่ที่สุด
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message:
          error.message || "Some error occurred while retrieving chats.",
      });
    });
};

// Find all games by post_games_id
exports.findAllByPostGamesId = (req, res) => {
  const post_games_id = req.params.id;

  Chat.findAll({
    where: { post_games_id: post_games_id },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["first_name", "last_name", "user_image"]
      }
    ],
    order: [['createdAt', 'ASC']] // เรียงลำดับตาม createdAt จากเก่าที่สุดไปใหม่ที่สุด
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message || "Some error occurred while retrieving chats.",
      });
    });
};