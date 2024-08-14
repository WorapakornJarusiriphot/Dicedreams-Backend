// create controllers/participateController.js

const db = require("../models");
const Participate = db.participate;
const User = db.user; // เพิ่มการ import โมเดล User

// Create and Save a new Participate
exports.create = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.user_id) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    // check if the user already participate
    const user_id = req.body.user_id;
    const post_games_id = req.body.post_games_id;
    const check = await Participate.findOne({
      where: { user_id: user_id, post_games_id: post_games_id },
    });
    if (check) {
      res.status(400).send({
        message: "You already participate this game!",
      });
      return;
    }

    // Create a Participate
    const participate = {
      participant_apply_datetime: req.body.participant_apply_datetime,
      participant_status: req.body.participant_status,
      user_id: req.body.user_id,
      post_games_id: req.body.post_games_id,
    };

    // Save Participate in the database async
    const data = await Participate.create(participate);

    //select postgame by post_game_id
    const postGame = await db.post_games.findByPk(post_games_id);

     // insert table notification
     const notification = {
      type: "participate",
      read: false,
      time: new Date(),
      user_id: postGame.dataValues.users_id,
      entity_id: data.dataValues.part_Id,
    };
    await db.notification.create(notification);

    const messages = [];

    // get table notification by user_id where read = false
    const notifications = await db.notification.findAll({
      where: { user_id: postGame.dataValues.users_id, read: false },
    });
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].type === "participate") {
        const participate = await Participate.findByPk(
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
      .json({ message: "Participate was created successfully.", data: data });
  } catch (error) {
    next(error);
  }
};

// Retrieve all Participates from the database.
exports.findAll = (req, res) => {
  Participate.findAll({
    order: [['createdAt', 'ASC']] // เรียงลำดับจากเวลาเก่าสุดไปใหม่สุด
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message:
          error.message || "Some error occurred while retrieving Participates.",
      });
    });
};

// Find a single Participate with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Participate.findByPk(id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving Participate with id=" + id,
      });
    });
};

// Update a Participate by the id in the request
exports.update = async (req, res, next) => {
  const id = req.params.id;

  try {

    const updated = await Participate.update(req.body, {
      where: { part_Id: id },
    });

    if (updated) {
      // get in table participate by id
      const parti = await Participate.findByPk(id);

      // insert table notification
      const notification = {
        type: "participate",
        read: false,
        time: new Date(),
        user_id: parti.dataValues.user_id,
        entity_id: id,
      };
      await db.notification.create(notification);

      const messages = [];

      // get table notification by user_id where read = false
      const notifications = await db.notification.findAll({
        where: { user_id: parti.dataValues.user_id, read: false },
      });
      for (let i = 0; i < notifications.length; i++) {
        if (notifications[i].type === "participate") {
          const participate = await Participate.findByPk(
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
exports.findAllByPostGamesId = async (req, res, next) => {
  const post_games_id = req.params.id;
  try {
    const data = await Participate.findAll({
      where: { post_games_id: post_games_id },
      include: [{ model: User, attributes: [ 'users_id' , 'first_name', 'last_name', 'user_image' , 'email' , 'phone_number' , 'gender' ] }], // เพิ่มการ include User model
      order: [['createdAt', 'ASC']] // เรียงลำดับจากเวลาเก่าสุดไปใหม่สุด
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Retrieve all Participates by user_id
exports.findAllByUserId = async (req, res, next) => {
  const user_id = req.params.userId; 
  try {
    const data = await Participate.findAll({
      where: { user_id: user_id },
      order: [['createdAt', 'ASC']] // เรียงลำดับจากเวลาเก่าสุดไปใหม่สุด
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
