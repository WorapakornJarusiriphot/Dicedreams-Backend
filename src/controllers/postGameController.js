const db = require("../models");
const moment = require("moment");

const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

const PostGames = db.post_games;
// create fucntion to create a new game and save it to the database
exports.create = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.name_games) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    console.log(req.body.date_meet, "date_meet");
    // Create a game
    const game = {
      name_games: req.body.name_games,
      detail_post: req.body.detail_post,
      num_people: req.body.num_people,
      date_meet: moment(req.body.date_meet, "MM-DD-YYYY"),
      time_meet: req.body.time_meet,
      games_image: req.body.games_image
        ? await saveImageToDisk(req.body.games_image)
        : req.body.games_image, // ส่งรูปเกมไปเก็บในระบบ
      status_post: req.body.status_post,
      creation_date: req.body.creation_date,
      users_id: req.body.users_id,
    };

    // Save game in the database async
    const data = await PostGames.create(game);
    res
      .status(201)
      .json({ message: "Game was created successfully.", data: data });
  } catch (error) {
    next(error);
  }
};

// postGameController.js
// exports.create = async (req, res, next) => {
//   try {
//     // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ส่งเข้ามา
//     console.log("Received data:", req.body);

//     // Validate request
//     if (!req.body.name_games) {
//       res.status(400).send({
//         message: "Content can not be empty!",
//       });
//       return;
//     }

//     console.log(req.body.date_meet, "date_meet");
//     // Create a game
//     const game = {
//       name_games: req.body.name_games,
//       detail_post: req.body.detail_post,
//       num_people: req.body.num_people,
//       date_meet: moment(req.body.date_meet, "MM-DD-YYYY"),
//       time_meet: req.body.time_meet,
//       games_image: req.body.games_image
//         ? await saveImageToDisk(req.body.games_image)
//         : req.body.games_image, // ส่งรูปเกมไปเก็บในระบบ
//       status_post: req.body.status_post,
//       creation_date: req.body.creation_date,
//       users_id: req.body.users_id,
//     };

//     // Save game in the database async
//     const data = await PostGames.create(game);
//     res
//       .status(201)
//       .json({ message: "Game was created successfully.", data: data });
//   } catch (error) {
//     console.error("Error creating game:", error); // เพิ่ม log ข้อผิดพลาด
//     res.status(500).send({
//       message: "An error occurred while creating the game.",
//       error: error.message, // เพิ่มการส่งข้อความข้อผิดพลาดกลับไปยัง client
//     });
//   }
// };

// Update functions and other functions similarly

// exports.create = async (req, res, next) => {
//   try {
//     // Log the received data for debugging
//     console.log("Received data:", req.body);

//     // Validate request
//     if (!req.body.name_games) {
//       res.status(400).send({
//         message: "Content can not be empty!",
//       });
//       return;
//     }

//     console.log(req.body.date_meet, "date_meet");

//     // Create a game
//     const game = {
//       name_games: req.body.name_games,
//       detail_post: req.body.detail_post,
//       num_people: req.body.num_people,
//       date_meet: moment(req.body.date_meet, "MM-DD-YYYY"),
//       time_meet: req.body.time_meet,
//       games_image: req.body.games_image ? await saveImageToDisk(req.body.games_image) : req.body.games_image,
//       status_post: req.body.status_post,
//       creation_date: req.body.creation_date,
//       users_id: req.body.users_id,
//     };

//     // Log the data before inserting into the database
//     console.log("Inserting data into database:", game);

//     // Save game in the database
//     const data = await PostGames.create(game);
//     res.status(201).json({ message: "Game was created successfully.", data: data });

//   } catch (error) {
//     // Log the error message
//     console.error("Error creating game:", error);

//     // Send error message to the client
//     res.status(500).send({
//       message: "An error occurred while creating the game.",
//       error: error.message,
//     });
//   }
// };

// exports.create = async (req, res, next) => {
//   try {
//     // Log the received data for debugging
//     console.log("Received data:", req.body);

//     // ตรวจสอบ `users_id`
//     const userId = req.body.users_id;
//     console.log("Received users_id:", userId);

//     // ตรวจสอบว่ามี `users_id` และมีอยู่ในฐานข้อมูล
//     if (!userId) {
//       return res.status(400).json({
//         message: "Users ID is missing",
//       });
//     }

//     const user = await db.users.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     // Validate request
//     if (!req.body.name_games) {
//       res.status(400).send({
//         message: "Content can not be empty!",
//       });
//       return;
//     }

//     console.log(req.body.date_meet, "date_meet");

//     // Create a game
//     const game = {
//       name_games: req.body.name_games,
//       detail_post: req.body.detail_post,
//       num_people: req.body.num_people,
//       date_meet: moment(req.body.date_meet, "MM-DD-YYYY"),
//       time_meet: req.body.time_meet,
//       games_image: req.body.games_image
//         ? await saveImageToDisk(req.body.games_image)
//         : req.body.games_image,
//       status_post: req.body.status_post,
//       creation_date: req.body.creation_date,
//       users_id: userId,
//     };

//     // Log the data before inserting into the database
//     console.log("Inserting data into database:", game);

//     // Save game in the database
//     const data = await PostGames.create(game);
//     res
//       .status(201)
//       .json({ message: "Game was created successfully.", data: data });
//   } catch (error) {
//     // Log the error message
//     console.error("Error creating game:", error);

//     // Send error message to the client
//     res.status(500).send({
//       message: "An error occurred while creating the game.",
//       error: error.message,
//     });
//   }
// };

// Retrieve all games from the database.
exports.findAll = (req, res) => {
  //   const name_games = req.query.name_games;
  //   var condition = name_games
  //     ? { name_games: { [Op.like]: `%${name_games}%` } }
  //     : null;
  const { search } = req.query;
  console.log(`Received search query for games: ${search}`); // เพิ่ม log เพื่อตรวจสอบคำค้นหา

  const condition = search
    ? {
        [Op.or]: [
          { name_games: { [Op.like]: `%${search}%` } },
          { detail_post: { [Op.like]: `%${search}%` } },
        ],
        status_post: { [Op.not]: "unActive" },
      }
    : {
        status_post: { [Op.not]: "unActive" },
      };

  PostGames.findAll({ where: condition })
    .then((data) => {
      data.map((post_games) => {
        if (post_games.games_image) {
          post_games.games_image = `${req.protocol}://${req.get(
            "host"
          )}/images/${post_games.games_image}`;
        }
      });
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

// ดึงโพสต์ทั้งหมดของผู้ใช้เฉพาะ
exports.findAllUserPosts = (req, res) => {
  const userId = req.params.userId; // รับ ID ผู้ใช้จากพารามิเตอร์

  PostGames.findAll({
    where: { users_id: userId }, // ค้นหาโพสต์ที่มี users_id ตรงกับ ID ที่ส่งมา
  })
    .then((data) => {
      data.forEach((post) => {
        if (post.games_image) {
          post.games_image = `${req.protocol}://${req.get("host")}/images/${post.games_image}`;
        }
      });
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "มีข้อผิดพลาดเกิดขึ้นขณะดึงข้อมูลโพสต์",
      });
    });
};

// Find a single game with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  PostGames.findByPk(id)
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
      const postGames = await PostGames.findByPk(id);
      const uploadPath = path.resolve("./") + "/src/public/images/";

      fs.unlink(uploadPath + postGames.games_image, function (err) {
        console.log("File deleted!");
      });

      req.body.games_image = await saveImageToDisk(req.body.games_image);
    }
  }
  req.body.date_meet = moment(req.body.date_meet, "MM-DD-YYYY");

  PostGames.update(req.body, {
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

  PostGames.destroy({
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
  PostGames.destroy({
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

  const uploadPath = `${projectPath}/src/public/images/`;

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
