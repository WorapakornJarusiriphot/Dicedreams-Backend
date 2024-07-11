const db = require("../models");
const moment = require("moment");
const bcrypt = require("bcryptjs");

const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { uploadImageToS3, deleteImageFromS3, s3 } = require("../utils/s3");
const config = { DOMAIN: process.env.DOMAIN };

const User = db.user;

exports.create = async (req, res, next) => {
  try {
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

    const salt = await bcrypt.genSalt(5);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const userImage = req.body.user_image ? await uploadImageToS3(req.body.user_image) : null;

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
    next(error);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    const usersWithPhotoDomain = users.map((user) => {
      return {
        ...user.dataValues,
        user_image: user.user_image
          ? s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET_NAME, Key: user.user_image })
          : null,
      };
    });

    res.status(200).json(usersWithPhotoDomain);
  } catch (error) {
    next(error);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const users_id = req.params.id;

    const user = await User.findByPk(users_id, {
      attributes: { exclude: ["password"] },
    });

    if (user) {
      user.user_image = user.user_image
        ? s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET_NAME, Key: user.user_image })
        : null;
      res.status(200).json(user);
    } else {
      res.status(404).send({
        message: `Cannot find User with id=${users_id}.`
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const users_id = req.params.id;

    if (req.body.user_image) {
      if (req.body.user_image.search("data:image") != -1) {
        const user = await User.findByPk(users_id);
        if (user.user_image) {
          await deleteImageFromS3(user.user_image);
        }
        req.body.user_image = await uploadImageToS3(req.body.user_image);
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

    User.update(req.body, {
      where: { users_id: users_id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update User with id=${users_id}. Maybe User was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating User with id=" + users_id,
        });
      });
  } catch (error) {
    next(error);
  }
};

exports.delete = (req, res, next) => {
  try {
    const users_id = req.params.id;

    User.findByPk(users_id).then(async (user) => {
      if (user.user_image) {
        await deleteImageFromS3(user.user_image);
      }

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
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAll = (req, res) => {
  res.send({ message: "DeleteAll handler" });
};

