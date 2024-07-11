const db = require("../models");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { uploadImageToS3, deleteImageFromS3, getSignedUrl } = require("../utils/s3");

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

exports.findAll = async (req, res) => {
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

  try {
    const data = await PostGames.findAll({ where: condition });
    const postsWithImageUrls = await Promise.all(data.map(async (post_games) => {
      if (post_games.games_image) {
        post_games.games_image = await getSignedUrl(post_games.games_image);
      }
      return post_games;
    }));
    res.send(postsWithImageUrls);
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while retrieving games." });
  }
};

exports.findAllUserPosts = async (req, res) => {
  const userId = req.params.userId;
  try {
    const data = await PostGames.findAll({ where: { users_id: userId } });
    const postsWithImageUrls = await Promise.all(data.map(async (post) => {
      if (post.games_image) {
        post.games_image = await getSignedUrl(post.games_image);
      }
      return post;
    }));
    res.send(postsWithImageUrls);
  } catch (err) {
    res.status(500).send({ message: err.message || "มีข้อผิดพลาดเกิดขึ้นขณะดึงข้อมูลโพสต์" });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await PostGames.findByPk(id);
    if (data.games_image) {
      data.games_image = await getSignedUrl(data.games_image);
    }
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving game with id=" + id });
  }
};

exports.update = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (req.body.games_image && req.body.games_image.search("data:image") != -1) {
      const postGames = await PostGames.findByPk(id);
      if (postGames.games_image) {
        await deleteImageFromS3(postGames.games_image);
      }
      req.body.games_image = await uploadImageToS3(req.body.games_image);
    }

    req.body.date_meet = moment(req.body.date_meet, "MM-DD-YYYY");

    const num = await PostGames.update(req.body, { where: { post_games_id: id } });
    if (num == 1) {
      res.send({ message: "Game was updated successfully." });
    } else {
      res.send({ message: `Cannot update game with id=${id}. Maybe game was not found or req.body is empty!` });
    }
  } catch (err) {
    res.status(500).send({ message: "Error updating game with id=" + id });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const postGames = await PostGames.findByPk(id);
    if (postGames.games_image) {
      await deleteImageFromS3(postGames.games_image);
    }

    const num = await PostGames.destroy({ where: { post_games_id: id } });
    if (num == 1) {
      res.send({ message: "Game was deleted successfully!" });
    } else {
      res.send({ message: `Cannot delete game with id=${id}. Maybe game was not found!` });
    }
  } catch (err) {
    res.status(500).send({ message: "Could not delete game with id=" + id });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const postGames = await PostGames.findAll();
    for (const game of postGames) {
      if (game.games_image) {
        await deleteImageFromS3(game.games_image);
      }
    }

    const nums = await PostGames.destroy({ where: {}, truncate: false });
    res.send({ message: `${nums} Games were deleted successfully!` });
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while removing all games." });
  }
};
