const db = require("../models");
const moment = require("moment");
const bcrypt = require("bcryptjs");

const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);
const config = { DOMAIN: process.env.DOMAIN };
const AWS = require('aws-sdk');
const configs = require('../configs/config');  // ดึง config.js มาใช้

// ตั้งค่า AWS SDK ให้เชื่อมต่อกับ S3
const s3 = new AWS.S3({
  accessKeyId: configs.AWS_ACCESS_KEY_ID,
  secretAccessKey: configs.AWS_SECRET_ACCESS_KEY,
  region: configs.AWS_REGION,
});

const User = db.user;

exports.create = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.username) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    let birthday = moment(req.body.birthday, "MM-DD-YYYY");
    if (!birthday.isValid()) {
      res.status(400).send({
        message: "Invalid date format, please use MM-DD-YYYY",
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(5);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    // Handle user image
    let userImage;
    if (req.body.user_image) {
      if (req.body.user_image.startsWith("data:image")) {
        userImage = await saveImageToDisk(req.body.user_image);
      } else {
        userImage = req.body.user_image;
      }
    }

    // Create a user
    const user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: passwordHash,
      email: req.body.email,
      birthday: birthday,
      phone_number: req.body.phone_number,
      gender: req.body.gender,
      user_image: userImage,
    };

    await User.create(user);

    res.status(201).json({
      message: "User was registered successfully!",
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({
        error: {
          status_code: 400,
          message: "Username or email already exists",
        },
      });
    } else {
      res.status(500).json({
        error: {
          status_code: 500,
          message: error.message || "Some error occurred while creating the User.",
        },
      });
    }
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [['createdAt', 'DESC']] // เรียงลำดับจากใหม่ไปเก่า
    });

    const usersWithPhotoDomain = await users.map((user, index) => {
      return {
        ...user.dataValues,
        user_image: `${config.DOMAIN}/images/${user.user_image}`,
      };
    });

    res.status(200).json(usersWithPhotoDomain);
  } catch (error) {
    next(error);
  }
};

exports.findOne = (req, res, next) => {
  try {
    const users_id = req.params.id;

    User.findByPk(users_id, {
      attributes: { exclude: ["password"] },
    })
      .then(async (data) => {
        data.user_image = `${config.DOMAIN}/images/${data.user_image}`;

        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error retrieving User with id=" + users_id,
        });
      });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const users_id = req.params.id;

    // Handle user image
    if (req.body.user_image) {
      if (req.body.user_image.startsWith("data:image")) {
        const user = await User.findByPk(users_id);
        const uploadPath = path.resolve("./") + "/src/public/images/";

        fs.unlink(uploadPath + user.user_image, function (err) {
          if (err) console.log("File not found or already deleted.");
        });

        req.body.user_image = await saveImageToDisk(req.body.user_image);
      }
    }

    if (req.body.birthday) {
      req.body.birthday = moment(req.body.birthday, "MM-DD-YYYY");
      if (!req.body.birthday.isValid()) {
        res.status(400).send({
          message: "Invalid date format, please use MM-DD-YYYY",
        });
        return;
      }
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(5);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const [updated] = await User.update(req.body, {
      where: { users_id: users_id },
    });

    if (updated) {
      res.send({
        message: "User was updated successfully.",
      });
    } else {
      res.status(404).send({
        message: `Cannot update User with id=${users_id}. Maybe User was not found or req.body is empty!`,
      });
    }
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({
        error: {
          status_code: 400,
          message: "Username or email already exists",
        },
      });
    } else {
      res.status(500).send({
        message: "Error updating User with id=" + users_id,
      });
    }
  }
};

exports.delete = (req, res, next) => {
  try {
    const users_id = req.params.id;

    User.destroy({
      where: { users_id: users_id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "User was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete User with id=${users_id}. Maybe User was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete User with id=" + users_id,
        });
      });
  } catch (error) {
    next(error);
  }
};

exports.deleteAll = (req, res) => {
  res.send({ message: "DeleteAll handler" });
};

exports.findByEmail = async (req, res, next) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({
        message: "Email query parameter is required",
      });
    }

    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["password"] }, // ซ่อน password
    });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

async function saveImageToDisk(baseImage) {
  // เรียกใช้ฟังก์ชัน decodeBase64Image เพื่อแยกประเภทไฟล์และข้อมูล Base64
  const imageData = decodeBase64Image(baseImage);

  const ext = imageData.type.split("/")[1]; // แยกประเภทไฟล์จาก image/jpeg หรือ image/png

  // คำนวณค่าแฮชของภาพเพื่อสร้างชื่อไฟล์ไม่ให้ซ้ำกัน
  const imageBuffer = Buffer.from(imageData.data, "base64");
  const hash = crypto.createHash('md5').update(imageBuffer).digest('hex');
  const filename = `${hash}.${ext}`;

  if (!process.env.S3_BUCKET_NAME) {
    throw new Error("S3 Bucket name is missing in environment variables.");
  }

  // ตรวจสอบว่าไฟล์มีอยู่ใน S3 แล้วหรือไม่
  const paramsCheck = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `images/${filename}`
  };

  try {
    await s3.headObject(paramsCheck).promise();
    console.log('Image already exists in S3');
    return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/images/${filename}`;
  } catch (err) {
    if (err.code !== 'NotFound') {
      console.error('Error checking if image exists:', err);
      throw new Error('Failed to check if image exists in S3.');
    }

    // อัปโหลดภาพไปยัง S3
    const paramsUpload = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `images/${filename}`,
      Body: imageBuffer,
      ContentEncoding: 'base64',
      ContentType: imageData.type,  // ใช้ประเภทไฟล์จากฟังก์ชัน decodeBase64Image
    };

    const uploadResponse = await s3.upload(paramsUpload).promise();
    return uploadResponse.Location;  // คืนค่า URL ของรูปภาพที่ถูกอัปโหลด
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
