const db = require("../models");
const moment = require("moment");

const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

const PostGames = db.post_games;
const JoinGame = db.joingame;
const User = db.user;
// create fucntion to create a new game and save it to the database

exports.create = async (req, res, next) => {
  try {
    const { post_games_id  } = req.body;

    // Create a game
    const game = {
      post_games_id: post_games_id,
      users_id: req.user.users_id,
    };
    console.log(game)
    // Save game in the database async
    const data = await JoinGame.create(game);
    res
      .status(201)
      .json({ message: "join game was created successfully.", data: data });
  } catch (error) {
    next(error);
  }
};

// Retrieve all games from the database.
exports.findAll = (req, res) => {

  const { search } = req.query;
  console.log(`Received search query for games: ${search}`); // เพิ่ม log เพื่อตรวจสอบคำค้นหา

  const condition = search
    ? {
        [Op.or]: [
          { name_games: { [Op.like]: `%${search}%` } },
          { detail_post: { [Op.like]: `%${search}%` } },
        ],
        status: { [Op.not]: "unActive" },
      }
    : {
        status: { [Op.not]: "unActive" },
      };

  // JoinGame.findAll({ where: condition })
  JoinGame.findAll({include: [
    {
      model: User,
      as: 'user',
      attributes: ['users_id', 'username', 'email', 'phone_number'] // คุณสามารถเพิ่ม attributes ที่ต้องการได้
    }
  ]})

  .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

// Find a single game with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  JoinGame.findByPk(id, {
    include: [{
      model: Comments,
      as: 'comments',
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['users_id', 'username'] // คุณสามารถเพิ่ม attributes ที่ต้องการได้
        }
      ]
    }]
  })
    .then((data) => {
      if (data.games_image) {
        data.games_image = `${req.protocol}://${req.get("host")}/images/${
          data.games_image
        }`;
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving game with id=" + id,
      });
    });
};

// Update a game by the id in the request
exports.update = async (req, res, next) => {
  const id = req.params.id;

  //   check image is updated
  if (req.body.games_image) {
    if (req.body.games_image.search("data:image") != -1) {
      const postGames = await JoinGame.findByPk(id);
      const uploadPath = path.resolve("./") + "/src/app/api/public/images/";

      fs.unlink(uploadPath + JoinGame.games_image, function (err) {
        console.log("File deleted!");
      });

      req.body.games_image = await saveImageToDisk(req.body.games_image);
    }
  }
  req.body.date_meet = moment(req.body.date_meet, "MM-DD-YYYY");

  JoinGame.update(req.body, {
    where: { post_games_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Game was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update game with id=${id}. Maybe game was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating game with id=" + id,
      });
    });
};

// Delete a game with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  JoinGame.destroy({
    where: { post_games_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Game was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete game with id=${id}. Maybe game was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete game with id=" + id,
      });
    });
};

// Delete all games from the database.
exports.deleteAll = (req, res) => {
  JoinGame.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Games were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all games.",
      });
    });
};

async function saveImageToDisk(baseImage) {
  const projectPath = path.resolve("./");

  const uploadPath = `${projectPath}/src/app/api/public/images/`;

  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );

  let filename = "";
  if (ext === "svg+xml") {
    filename = `${uuidv4()}.svg`;
  } else {
    filename = `${uuidv4()}.${ext}`;
  }

  let image = decodeBase64Image(baseImage);

  await writeFileAsync(uploadPath + filename, image.data, "base64");

  return filename;
}

function decodeBase64Image(base64Str) {
  var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var image = {};
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  image.type = matches[1];
  image.data = matches[2];

  return image;
}
