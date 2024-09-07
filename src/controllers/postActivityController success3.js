const db = require("../models");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const Fuse = require("fuse.js");
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

    // Handle post activity image
    let postActivityImage;
    if (post_activity_image) {
      if (post_activity_image.startsWith("data:image")) {
        postActivityImage = await saveImageToDisk(post_activity_image);
      } else {
        postActivityImage = post_activity_image;
      }
    }

    const data = {
      name_activity: name_activity,
      status_post: status_post,
      creation_date: creation_date,
      detail_post: detail_post,
      date_activity: moment(date_activity, "MM-DD-YYYY"),
      time_activity: time_activity,
      store_id: store_id,
      post_activity_image: postActivityImage,
    };
    const post_activity = await PostActivity.create(data);
    res.status(201).json(post_activity);
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const { search, search_date_activity, search_time_activity } = req.query;
    console.log(`Received search query for activities: ${search}`);

    let condition = {
      status_post: { [Op.not]: "unActive" },
    };

    if (search_date_activity) {
      const date = moment(search_date_activity, "MM/DD/YYYY").format(
        "YYYY-MM-DD"
      );
      condition = {
        ...condition,
        date_activity: {
          [Op.lte]: date,
        },
      };
    }

    const data = await PostActivity.findAll({
      where: condition,
      order: [
        ["creation_date", "DESC"], // เรียงลำดับจากเก่าสุดไปใหม่สุด
        ["date_activity", "DESC"],
        ["time_activity", "DESC"],
      ],
      limit: 100,
    });

    let filteredData = data;

    if (search) {
      const searchTerms = search.split("&search=").filter((term) => term);
      const fuse = new Fuse(filteredData, {
        keys: ["name_activity", "detail_post"],
        threshold: 0.3,
      });

      let finalResults = [];
      searchTerms.forEach((term) => {
        const result = fuse.search(term);
        finalResults = [...finalResults, ...result.map(({ item }) => item)];
      });

      filteredData = [...new Set(finalResults)];
    }

    if (search_time_activity) {
      const targetTime = moment(search_time_activity, "HH:mm").toDate();
      filteredData = filteredData
        .sort((a, b) => {
          const timeA = moment(a.time_activity, "HH:mm").toDate();
          const timeB = moment(b.time_activity, "HH:mm").toDate();
          return Math.abs(targetTime - timeA) - Math.abs(targetTime - timeB);
        })
        .slice(0, 100); // ค้นหาข้อมูลที่ใกล้เคียงที่สุดและจำกัดผลลัพธ์ไม่เกิน 100 รายการ
    }

    filteredData.forEach((post_activity) => {
      if (post_activity.post_activity_image) {
        post_activity.post_activity_image = `${req.protocol}://${req.get(
          "host"
        )}/images/${post_activity.post_activity_image}`;
      }
    });

    res.send(filteredData);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving activities.",
    });
  }
};

exports.searchActiveActivities = async (req, res) => {
  const { search, search_date_activity, search_time_activity } = req.query;

  let condition = {
    status_post: "active", // เฉพาะโพสต์ที่ยัง active อยู่
  };

  if (search_date_activity) {
    const date = moment(search_date_activity, "MM/DD/YYYY").format(
      "YYYY-MM-DD"
    );
    condition.date_activity = {
      [Op.gte]: date,
    };
  }

  if (search_time_activity) {
    condition.time_activity = {
      [Op.gte]: search_time_activity,
    };
  }

  try {
    let data = await PostActivity.findAll({
      where: condition,
      order: [
        ["date_activity", "ASC"],
        ["time_activity", "ASC"],
      ],
    });

    // การกรองตามคำค้นหา
    if (search) {
      const searchTerms = search.split("&search=").filter((term) => term);
      const fuse = new Fuse(data, {
        keys: ["name_activity", "detail_post"],
        threshold: 0.3,
      });

      let finalResults = [];
      searchTerms.forEach((term) => {
        const result = fuse.search(term);
        finalResults = [...finalResults, ...result.map(({ item }) => item)];
      });

      data = [...new Set(finalResults)];
    }

    // การกรองโพสต์ที่เลยเวลานัดเล่นหรือคนเต็มแล้ว
    const currentTime = moment();
    data = data.filter((post) => {
      const postDateTime = moment(
        `${post.date_activity} ${post.time_activity}`
      );
      const isPostFull = post.participants >= post.num_people;
      return postDateTime.isAfter(currentTime) && !isPostFull;
    });

    data.forEach((post) => {
      if (post.post_activity_image) {
        post.post_activity_image = `${req.protocol}://${req.get(
          "host"
        )}/images/${post.post_activity_image}`;
      }
    });

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving activities.",
    });
  }
};

// ดึงโพสต์ทั้งหมดของร้านค้าตาม store_id
exports.findAllStorePosts = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    console.log(`Fetching posts for store ID: ${storeId}`);

    const post_activity = await PostActivity.findAll({
      where: { store_id: storeId },
      order: [
        ["creation_date", "DESC"], // เรียงลำดับจากเก่าสุดไปใหม่สุด
      ],
    });

    console.log(`Found posts: ${post_activity.length}`);

    post_activity.forEach((post) => {
      if (post.post_activity_image) {
        post.post_activity_image = `${req.protocol}://${req.get(
          "host"
        )}/images/${post.post_activity_image}`;
      }
    });

    res.status(200).json(post_activity);
  } catch (error) {
    console.error("Failed to fetch store posts:", error.message);
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
      if (req.body.post_activity_image.startsWith("data:image")) {
        const postactivity = await PostActivity.findByPk(post_activity_id);
        const uploadPath = path.resolve("./") + "/src/public/images/";

        if (postactivity.post_activity_image) {
          fs.unlink(
            uploadPath + postactivity.post_activity_image,
            function (err) {
              if (err) console.log("File not found or already deleted.");
            }
          );
        }

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
    const post_activity = await PostActivity.findByPk(post_activity_id);

    if (post_activity && post_activity.post_activity_image) {
      const uploadPath = path.resolve("./") + "/src/public/images/";
      fs.unlink(uploadPath + post_activity.post_activity_image, function (err) {
        if (err) console.log("File not found or already deleted.");
      });
    }

    const deleted = await PostActivity.destroy({
      where: {
        post_activity_id,
      },
    });

    if (deleted) {
      res.status(200).json({
        message: "PostActivity was deleted successfully.",
        post_activity_id: post_activity_id,
      });
    } else {
      res.status(404).json({
        message: `PostActivity with id=${post_activity_id} not found.`,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const post_activities = await PostActivity.findAll();

    for (const post_activity of post_activities) {
      if (post_activity.post_activity_image) {
        const uploadPath = path.resolve("./") + "/src/public/images/";
        fs.unlink(
          uploadPath + post_activity.post_activity_image,
          function (err) {
            if (err) console.log("File not found or already deleted.");
          }
        );
      }
    }

    await PostActivity.destroy({
      where: {},
      truncate: false,
    });

    res.status(200).json({
      message: "All PostActivities were deleted successfully.",
    });
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
