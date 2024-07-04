// ไฟล์นี้เป็นคอนโทรลเลอร์สำหรับจัดการกับโพสต์เกม (post_games) ในแอปพลิเคชัน โดยใช้ไลบรารี Sequelize เพื่อจัดการกับฐานข้อมูลและการทำงานต่างๆ ที่เกี่ยวข้องกับโพสต์เกม
const db = require("../models");
const moment = require("moment");
// ไลบรารี moment ใช้ในการจัดการและปรับแต่งวันที่และเวลา ทำให้การจัดการวันที่และเวลาในแอปพลิเคชันเป็นไปอย่างง่ายดายและมีประสิทธิภาพ

const { v4: uuidv4 } = require("uuid");
// ไลบรารี uuid ใช้ในการสร้าง UUID (Universally Unique Identifier) ซึ่งเป็นไอดีที่ไม่ซ้ำกันทั่วโลก ทำให้มั่นใจได้ว่าไอดีที่สร้างขึ้นจะไม่ซ้ำกับไอดีอื่นๆ
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
        ? await saveImageToDisk(req.body.games_image) // ส่งรูปเกมไปเก็บในระบบ ถ้ามีการส่งรูปเกมมา ถ้าไม่มีจะเป็นค่าว่าง และจะไม่เก็บรูปเกม ในระบบ และจะเป็นค่าว่าง ในฐานข้อมูล 
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

// Retrieve all games from the database.
exports.findAll = (req, res) => {
  const { search } = req.query;
  console.log(`Received search query for games: ${search}`);

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
  const userId = req.params.userId;

  PostGames.findAll({
    where: { users_id: userId },
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
    where: {}, // ส่งเงื่อนไขว่าจะลบข้อมูลทั้งหมดหรือไม่
    truncate: false, // ถ้าเป็น true จะลบทั้งตาราง ถ้าเป็น false จะลบแค่ข้อมูล
  })
    .then((nums) => { // ส่งจำนวนข้อมูลที่ถูกลบกลับไป และแสดงข้อความว่าลบสำเร็จ
      res.send({ message: `${nums} Games were deleted successfully!` }); 
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all games.",
      });
    });
};

// ฟังก์ชัน saveImageToDisk ใช้สำหรับบันทึกรูปภาพที่ได้รับมาในรูปแบบ base64 ลงในดิสก์ และฟังก์ชัน decodeBase64Image ใช้สำหรับแปลง base64 string เป็นข้อมูลรูปภาพ
async function saveImageToDisk(baseImage) { // ฟังก์ชัน saveImageToDisk ใช้สำหรับบันทึกรูปภาพที่ได้รับมาในรูปแบบ base64 ลงในดิสก์
  const projectPath = path.resolve("./"); // ระบุ path ของโปรเจค โดยใช้ path.resolve("./") ซึ่งจะไปอ้างอิงไปที่ root ของโปรเจค และเก็บไว้ในตัวแปร projectPath 

  const uploadPath = `${projectPath}/src/public/images/`; // ระบุ path ที่จะเก็บรูปภาพที่ได้รับมา โดยใช้ตัวแปร projectPath ที่ได้รับมาจาก path.resolve("./") และเก็บไว้ในตัวแปร uploadPath

  const ext = baseImage.substring( // สร้างตัวแปร ext โดยใช้ฟังก์ชัน substring โดยรับค่าจาก baseImage โดยเริ่มตั้งแต่ตำแหน่งที่ 0 ไปจนถึงตำแหน่งที่มีค่า / และเก็บไว้ในตัวแปร ext
    baseImage.indexOf("/") + 1, // ระบุตำแหน่งเริ่มต้นที่จะเริ่มตัดค่า โดยใช้ฟังก์ชัน indexOf โดยรับค่าจาก baseImage โดยเริ่มตั้งแต่ตำแหน่งที่มีค่า / ไปจนถึงตำแหน่งสุดท้าย และเก็บไว้ในตัวแปร ext
    baseImage.indexOf(";base64") // ระบุตำแหน่งสุดท้ายที่จะเริ่มตัดค่า โดยใช้ฟังก์ชัน indexOf โดยรับค่าจาก baseImage โดยเริ่มตั้งแต่ตำแหน่งที่มีค่า ;base64 ไปจนถึงตำแหน่งสุดท้าย และเก็บไว้ในตัวแปร ext
  );

  let filename = ""; // สร้างตัวแปร filename และกำหนดค่าเริ่มต้นให้เป็นค่าว่าง 
  if (ext === "svg+xml") { // ถ้า ext เป็น svg+xml ให้สร้างชื่อไฟล์ใหม่โดยใช้ uuidv4 และกำหนดนามสกุลไฟล์เป็น svg
    filename = `${uuidv4()}.svg`; 
  } else {
    filename = `${uuidv4()}.${ext}`; // ถ้าไม่ใช่ให้สร้างชื่อไฟล์ใหม่โดยใช้ uuidv4 และกำหนดนามสกุลไฟล์เป็น ext
  }

  let image = decodeBase64Image(baseImage); // สร้างตัวแปร image โดยใช้ฟังก์ชัน decodeBase64Image โดยรับค่าจาก baseImage และเก็บไว้ในตัวแปร image

  await writeFileAsync(uploadPath + filename, image.data, "base64"); // บันทึกรูปภาพลงในดิสก์ โดยใช้ฟังก์ชัน writeFileAsync โดยรับค่า uploadPath และ filename และข้อมูลรูปภาพ และรูปแบบข้อมูลเป็น base64

  return filename;
}

function decodeBase64Image(base64Str) { // ฟังก์ชัน decodeBase64Image ใช้สำหรับแปลง base64 string เป็นข้อมูลรูปภาพ  โดยรับค่า base64Str และส่งค่าออกมาเป็นข้อมูลรูปภาพ
  var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/); // สร้างตัวแปร matches โดยใช้ฟังก์ชัน match โดยรับค่าจาก base64Str โดยตรวจสอบว่าข้อมูลที่รับมาตรงกับรูปแบบของ base64 หรือไม่ และเก็บไว้ในตัวแปร matches
  var image = {}; // สร้างตัวแปร image และกำหนดค่าเริ่มต้นให้เป็นออบเจ็คว่าง
  if (!matches || matches.length !== 3) {  // ถ้าไม่ตรงกับรูปแบบของ base64 หรือไม่มีข้อมูล ให้ส่งข้อความว่า Invalid base64 string
    throw new Error("Invalid base64 string"); 
  }

  image.type = matches[1]; // กำหนดค่าให้กับ image.type โดยใช้ค่าจาก matches ที่มี index เท่ากับ 1
  image.data = matches[2]; // กำหนดค่าให้กับ image.data โดยใช้ค่าจาก matches ที่มี index เท่ากับ 2

  return image; // ส่งค่าออกไปเป็นข้อมูลรูปภาพ
}
