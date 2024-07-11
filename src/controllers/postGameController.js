const db = require("../models");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { uploadImageToS3, s3 } = require("../utils/s3");

const PostGames = db.post_games;

exports.create = async (req, res, next) => {
  try {
    if (!req.body.name_games) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }

    let games_image = req.body.games_image ? await uploadImageToS3(req.body.games_image) : null;

    const game = {
      name_games: req.body.name_games,
      detail_post: req.body.detail_post,
      num_people: req.body.num_people,
      date_meet: moment(req.body.date_meet, "MM-DD-YYYY"),
      time_meet: req.body.time_meet,
      games_image: games_image,
      status_post: req.body.status_post,
      creation_date: req.body.creation_date,
      users_id: req.body.users_id,
    };

    const data = await PostGames.create(game);
    res.status(201).json({ message: "Game was created successfully.", data: data });
  } catch (error) {
    next(error);
  }
};

exports.findAll = (req, res) => {
  const { search } = req.query;
  const condition = search
    ? {
        [Op.or]: [
          { name_games: { [Op.like]: `%${search}%` } },
          { detail_post: { [Op.like]: `%${search}%` } },
        ],
        status_post: { [Op.not]: "unActive" },
      }
    : { status_post: { [Op.not]: "unActive" } };

  PostGames.findAll({ where: condition })
    .then((data) => {
      data.map((post_games) => {
        if (post_games.games_image) {
          post_games.games_image = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET_NAME, Key: post_games.games_image });
        }
      });
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving games." });
    });
};

exports.findAllUserPosts = (req, res) => {
  const userId = req.params.userId;
  PostGames.findAll({ where: { users_id: userId } })
    .then((data) => {
      data.forEach((post) => {
        if (post.games_image) {
          post.games_image = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET_NAME, Key: post.games_image });
        }
      });
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "มีข้อผิดพลาดเกิดขึ้นขณะดึงข้อมูลโพสต์" });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  PostGames.findByPk(id)
    .then((data) => {
      if (data.games_image) {
        data.games_image = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET_NAME, Key: data.games_image });
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving game with id=" + id });
    });
};

exports.update = async (req, res, next) => {
  const id = req.params.id;

  if (req.body.games_image && req.body.games_image.search("data:image") != -1) {
    const postGames = await PostGames.findByPk(id);
    if (postGames.games_image) {
      await s3.deleteObject({ Bucket: process.env.S3_BUCKET_NAME, Key: postGames.games_image }).promise();
    }
    req.body.games_image = await uploadImageToS3(req.body.games_image);
  }

  req.body.date_meet = moment(req.body.date_meet, "MM-DD-YYYY");

  PostGames.update(req.body, { where: { post_games_id: id } })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Game was updated successfully." });
      } else {
        res.send({ message: `Cannot update game with id=${id}. Maybe game was not found or req.body is empty!` });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error updating game with id=" + id });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  PostGames.findByPk(id).then(async (postGames) => {
    if (postGames.games_image) {
      await s3.deleteObject({ Bucket: process.env.S3_BUCKET_NAME, Key: postGames.games_image }).promise();
    }

    PostGames.destroy({ where: { post_games_id: id } })
      .then((num) => {
        if (num == 1) {
          res.send({ message: "Game was deleted successfully!" });
        } else {
          res.send({ message: `Cannot delete game with id=${id}. Maybe game was not found!` });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Could not delete game with id=" + id });
      });
  });
};

exports.deleteAll = (req, res) => {
  PostGames.findAll().then(async (postGames) => {
    for (const game of postGames) {
      if (game.games_image) {
        await s3.deleteObject({ Bucket: process.env.S3_BUCKET_NAME, Key: game.games_image }).promise();
      }
    }

    PostGames.destroy({ where: {}, truncate: false })
      .then((nums) => {
        res.send({ message: `${nums} Games were deleted successfully!` });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message || "Some error occurred while removing all games." });
      });
  });
};
