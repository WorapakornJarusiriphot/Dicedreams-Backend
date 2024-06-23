const db = require("../models");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

const PostActivity = db.post_activity;

exports.create = async (req, res, next) => {
  try {
    const {
      name_activity,
      status_post,
      creation_date,
      detail_post,
      date_activity,
      time_activity,
      post_activity_image,
      store_id,
    } = req.body;

    const data = {
      name_activity: name_activity,
      status_post: status_post,
      creation_date: creation_date,
      detail_post: detail_post,
      date_activity: moment(date_activity, "MM-DD-YYYY"),
      time_activity: time_activity,
      store_id: store_id,
      post_activity_image: post_activity_image
        ? await saveImageToDisk(post_activity_image)
        : post_activity_image,
    };
    const post_activity = await PostActivity.create(data);
    res.status(201).json(post_activity);
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const { search } = req.query;
    console.log(`Received search query for activities: ${search}`); // เพิ่ม log เพื่อตรวจสอบคำค้นหา

    const condition = search
      ? {
          [Op.or]: [
            { name_activity: { [Op.like]: `%${search}%` } },
            { detail_post: { [Op.like]: `%{search}%` } },
          ],
          status_post: { [Op.not]: "unActive" },
        }
      : {
          status_post: { [Op.not]: "unActive" },
        };

    const post_activity = await PostActivity.findAll({ where: condition });
    post_activity.map((post_activity) => {
      post_activity.post_activity_image = `${req.protocol}://${req.get(
        "host"
      )}/images/${post_activity.post_activity_image}`;
    });
    res.status(200).json(post_activity);
  } catch (error) {
    next(error);
  }
};

// ฟังก์ชันใหม่: ดึงโพสต์ทั้งหมดของร้านค้าตาม store_id
exports.findAllStorePosts = async (req, res, next) => {
  try {
    const storeId = req.params.storeId; // รับ ID ร้านค้าจากพารามิเตอร์ URL
    console.log(`Fetching posts for store ID: ${storeId}`); // เพิ่ม log เพื่อตรวจสอบการดึงโพสต์

    const post_activity = await PostActivity.findAll({
      where: { store_id: storeId }, // ค้นหาโพสต์ที่มี store_id ตรงกับ ID ที่ส่งมา
    });

    console.log(`Found posts: ${post_activity.length}`); // เพิ่ม log เพื่อตรวจสอบจำนวนโพสต์ที่พบ

    post_activity.forEach((post) => {
      if (post.post_activity_image) {
        post.post_activity_image = `${req.protocol}://${req.get(
          "host"
        )}/images/${post.post_activity_image}`;
      }
    });

    res.status(200).json(post_activity);
  } catch (error) {
    console.error("Failed to fetch store posts:", error.message); // เพิ่ม log ข้อผิดพลาด
    next(error);
  }
};


exports.findOne = async (req, res, next) => {
  try {
    const post_activity_id = req.params.id;
    const post_activity = await PostActivity.findByPk(post_activity_id);
    post_activity.post_activity_image = `${req.protocol}://${req.get(
      "host"
    )}/images/${post_activity.post_activity_image}`;
    res.status(200).json(post_activity);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const post_activity_id = req.params.id;

    if (req.body.post_activity_image) {
      if (req.body.post_activity_image.search("data:image") != -1) {
        const postactivity = await PostActivity.findByPk(post_activity_id);
        const uploadPath = path.resolve("./") + "/src/public/images/";

        fs.unlink(
          uploadPath + postactivity.post_activity_image,
          function (err) {
            console.log("File deleted!");
          }
        );

        req.body.post_activity_image = await saveImageToDisk(
          req.body.post_activity_image
        );
      }
    }
    req.body.date_activity = moment(req.body.date_activity, "MM-DD-YYYY");
    await PostActivity.update(req.body, {
      where: {
        post_activity_id,
      },
    });
    res.status(200).json({ message: "PostActivity was updated successfully." });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const post_activity_id = req.params.id;
    const post_activity = await PostActivity.destroy({
      where: {
        post_activity_id,
      },
    });
    res.status(204).json({ message: "PostActivity was deleted successfully." });
  } catch (error) {
    next(error);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const post_activity = await PostActivity.destroy({
      where: {},
      truncate: false,
    });
    res.status(204).json(post_activity);
  } catch (error) {
    next(error);
  }
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
