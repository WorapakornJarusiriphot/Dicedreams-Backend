const db = require("../models");
const moment = require("moment");

const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const Fuse = require("fuse.js");
const writeFileAsync = promisify(fs.writeFile);
const crypto = require("crypto");
const AWS = require("aws-sdk");
const config = require("../configs/config"); // ดึง config.js มาใช้

// ตั้งค่า AWS SDK ให้เชื่อมต่อกับ S3
const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  region: config.AWS_REGION,
});

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

    // Handle games image
    let gamesImage;
    if (req.body.games_image) {
      if (req.body.games_image.startsWith("data:image")) {
        gamesImage = await saveImageToDisk(req.body.games_image);
      } else {
        gamesImage = req.body.games_image;
      }
    }

    // Create a game
    const game = {
      name_games: req.body.name_games,
      detail_post: req.body.detail_post,
      num_people: req.body.num_people,
      date_meet: moment(req.body.date_meet, "MM-DD-YYYY"),
      time_meet: req.body.time_meet,
      games_image: gamesImage,
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

// Retrieve all games from the database.
exports.findAll = async (req, res) => {
  const { search, search_date_meet, search_time_meet, search_num_people } =
    req.query;
  console.log(`Received search query for games: ${search}`);

  let condition = {
    status_post: { [Op.not]: "unActive" },
  };

  if (search_date_meet) {
    const date = moment(search_date_meet, "MM/DD/YYYY").format("YYYY-MM-DD");
    condition = {
      ...condition,
      date_meet: {
        [Op.lte]: date,
      },
    };
  }

  if (search_time_meet) {
    condition = {
      ...condition,
      time_meet: {
        [Op.lte]: search_time_meet,
      },
    };
  }

  try {
    const data = await PostGames.findAll({
      where: condition,
      order: [
        ["date_meet", "DESC"],
        ["time_meet", "DESC"],
      ],
      limit: 100,
    });

    let filteredData = data;

    if (search_num_people) {
      const fuse = new Fuse(data, {
        keys: ["num_people"],
        threshold: 0.3,
        distance: parseInt(search_num_people),
      });
      const result = fuse.search(search_num_people);
      filteredData = result.length
        ? result.map(({ item }) => item)
        : data.sort(
            (a, b) =>
              Math.abs(a.num_people - search_num_people) -
              Math.abs(b.num_people - search_num_people)
          );
    }

    if (search) {
      const searchTerms = search.split("&search=").filter((term) => term);
      const fuse = new Fuse(filteredData, {
        keys: ["name_games", "detail_post"],
        threshold: 0.3,
      });

      let finalResults = [];
      searchTerms.forEach((term) => {
        const result = fuse.search(term);
        finalResults = [...finalResults, ...result.map(({ item }) => item)];
      });

      filteredData = [...new Set(finalResults)];
    }

    filteredData.forEach((post_games) => {
      if (post_games.games_image) {
        post_games.games_image = `${req.protocol}://${req.get("host")}/images/${
          post_games.games_image
        }`;
      }
    });

    res.send(filteredData);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving games.",
    });
  }
};

exports.searchActiveGames = async (req, res) => {
  const { search, search_date_meet, search_time_meet, search_num_people } =
    req.query;

  let condition = {
    status_post: "active", // เฉพาะโพสต์ที่ยัง active อยู่
  };

  try {
    let data = await PostGames.findAll({
      where: condition,
      order: [
        ["date_meet", "ASC"], // เรียงตามวันที่
        ["time_meet", "ASC"], // เรียงตามเวลา
      ],
    });

    const currentTime = moment();

    // กรองโพสต์ที่วันที่และเวลานัดเล่นยังไม่ผ่านไป
    data = data.filter((post) => {
      const postDateTime = moment(`${post.date_meet} ${post.time_meet}`);
      return postDateTime.isAfter(currentTime); // โชว์เฉพาะโพสต์ที่ยังไม่ผ่านเวลานัด
    });

    // คำนวณความใกล้เคียงตามวันที่
    if (search_date_meet) {
      const targetDate = moment(search_date_meet, "MM/DD/YYYY").format(
        "YYYY-MM-DD"
      );

      data = data.map((post) => {
        const diffInDays = Math.abs(
          moment(post.date_meet).diff(targetDate, "days")
        );
        return { ...post.toJSON(), dateDiff: diffInDays }; // เพิ่มความต่างของวันที่เข้าไปในแต่ละโพสต์
      });

      // เรียงโพสต์ตามวันที่ที่ใกล้เคียงกับที่ค้นหามากที่สุด
      data.sort((a, b) => a.dateDiff - b.dateDiff);
    }

    // คำนวณความใกล้เคียงตามเวลา
    if (search_time_meet) {
      const targetTime = moment(search_time_meet, "HH:mm");

      data = data.map((post) => {
        const timeDiff = Math.abs(
          moment(post.time_meet, "HH:mm").diff(targetTime, "minutes")
        );
        return { ...post, timeDiff }; // เพิ่มความต่างของเวลาเข้าไปในแต่ละโพสต์
      });

      // เรียงโพสต์ตามเวลาที่ใกล้เคียงกับที่ค้นหามากที่สุด
      data.sort((a, b) => a.timeDiff - b.timeDiff);
    }

    // คำนวณความใกล้เคียงตามจำนวนคน
    if (search_num_people) {
      const targetPeople = parseInt(search_num_people);

      data = data.map((post) => {
        const peopleDiff = Math.abs(post.num_people - targetPeople);
        return { ...post, peopleDiff }; // เพิ่มความต่างของจำนวนคนเข้าไปในแต่ละโพสต์
      });

      // เรียงโพสต์ตามจำนวนคนที่ใกล้เคียงกับที่ค้นหามากที่สุด
      data.sort((a, b) => a.peopleDiff - b.peopleDiff);
    }

    // การกรองตามคำค้นหาหลายคำ (ใช้ Fuse.js)
    if (search) {
      const searchTerms = search.split("&search=").filter((term) => term); // แยกคำค้นหาออกเป็น Array
      const fuse = new Fuse(data, {
        keys: ["name_games", "detail_post"], // ค้นหาใน name_games และ detail_post
        threshold: 0.5, // ค่าความแม่นยำในการค้นหาที่สามารถยอมรับได้
        includeScore: true, // เพิ่มคะแนนการแมตช์เพื่อนำมาเรียงลำดับ
      });

      let finalResults = [];
      searchTerms.forEach((term) => {
        const result = fuse.search(term);
        finalResults = [...finalResults, ...result];
      });

      // รวมผลลัพธ์และเรียงลำดับตามคะแนนความใกล้เคียง
      finalResults.sort((a, b) => a.score - b.score);

      // เอาเฉพาะโพสต์ออกมา
      data = finalResults.map(({ item }) => item);
    }

    // การแก้ไข URL ของรูปภาพ
    data.forEach((post) => {
      if (post.games_image) {
        post.games_image = `${req.protocol}://${req.get("host")}/images/${
          post.games_image
        }`;
      }
    });

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving games.",
    });
  }
};

// ดึงโพสต์ทั้งหมดของผู้ใช้เฉพาะ
exports.findAllUserPosts = (req, res) => {
  const userId = req.params.userId;

  PostGames.findAll({
    where: { users_id: userId },
    order: [["creation_date", "DESC"]], // เรียงลำดับจากใหม่ไปเก่า
  })
    .then((data) => {
      data.forEach((post) => {
        if (post.games_image) {
          post.games_image = `${req.protocol}://${req.get("host")}/images/${
            post.games_image
          }`;
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

  // Check if image is updated
  if (req.body.games_image) {
    if (req.body.games_image.startsWith("data:image")) {
      const postGames = await PostGames.findByPk(id);
      const uploadPath = path.resolve("./") + "/src/public/images/";

      if (postGames.games_image) {
        fs.unlink(uploadPath + postGames.games_image, function (err) {
          if (err) console.log("File not found or already deleted.");
        });
      }

      req.body.games_image = await saveImageToDisk(req.body.games_image);
    } else {
      // แก้ไขให้เก็บเฉพาะชื่อไฟล์ ไม่ใช่ URL ทั้งหมด
      req.body.games_image = req.body.games_image.replace(
        `${req.protocol}://${req.get("host")}/images/`,
        ""
      );
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
  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );

  let filename = `${uuidv4()}.${ext}`;

  const imageBuffer = Buffer.from(
    baseImage.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  // ตรวจสอบว่าตัวแปร Bucket ถูกกำหนดหรือไม่
  if (!process.env.S3_BUCKET_NAME) {
    throw new Error("S3 Bucket name is missing in environment variables.");
  }

  const params = {
    Bucket: process.env.S3_BUCKET_NAME, // ใช้ตัวแปรจาก .env
    Key: `images/${filename}`, // ตั้งชื่อไฟล์ที่ต้องการอัปโหลด
    Body: imageBuffer,
    ContentEncoding: "base64", // บอก S3 ว่าไฟล์นี้ถูกเข้ารหัสด้วย base64
    ContentType: `image/${ext}`, // ประเภทของรูปภาพ
  };

  try {
    const uploadResponse = await s3.upload(params).promise();
    return uploadResponse.Location; // คืนค่า URL ของรูปภาพที่ถูกอัปโหลด
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw new Error("Failed to upload image to S3.");
  }
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
