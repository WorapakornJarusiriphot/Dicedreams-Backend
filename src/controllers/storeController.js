// create controller for store
const db = require("../models");
const Store = db.store;

const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);
const { uploadImageToS3, deleteImageFromS3, s3 } = require("../utils/s3");

exports.create = async (req, res, next) => {
  try {
    if (!req.body.name_store) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }

    let store_image = req.body.store_image ? await uploadImageToS3(req.body.store_image) : null;

    const store = {
      name_store: req.body.name_store,
      phone_number: req.body.phone_number,
      house_number: req.body.house_number,
      province: req.body.province,
      district: req.body.district,
      sub_district: req.body.sub_district,
      road: req.body.road,
      alley: req.body.alley,
      store_image: store_image,
      users_id: req.body.users_id,
    };

    const data = await Store.create(store);
    res.status(201).json({ message: "Store was created successfully.", data: data });
  } catch (error) {
    next(error);
  }
};

exports.findAll = (req, res) => {
  Store.findAll()
    .then((data) => {
      data.map((store) => {
        if (store.store_image) {
          store.store_image = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET_NAME, Key: store.store_image });
        }
      });
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message || "Some error occurred while retrieving Stores.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Store.findByPk(id)
    .then((data) => {
      if (data) {
        if (data.store_image) {
          data.store_image = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET_NAME, Key: data.store_image });
        }
        res.status(200).json(data);
      } else {
        res.status(404).send({ message: `Cannot find Store with id=${id}.` });
      }
    })
    .catch((err) => {
      console.error("Error retrieving Store with id=", id, "error:", err);
      res.status(500).send({ message: "Error retrieving Store with id=" + id });
    });
};

exports.update = async (req, res, next) => {
  const id = req.params.id;

  if (req.body.store_image) {
    if (req.body.store_image.search("data:image") != -1) {
      const store = await Store.findByPk(id);
      if (store.store_image) {
        await deleteImageFromS3(store.store_image);
      }
      req.body.store_image = await uploadImageToS3(req.body.store_image);
    }
  }

  Store.update(req.body, {
    where: { store_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({ message: "Store was updated successfully." });
      } else {
        res.status(400).json({ message: `Cannot update Store with id=${id}. Maybe Store was not found or req.body is empty!` });
      }
    })
    .catch((error) => {
      next(error);
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Store.findByPk(id).then(async (store) => {
    if (store.store_image) {
      await deleteImageFromS3(store.store_image);
    }

    Store.destroy({
      where: { store_id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.status(200).json({ message: "Store was deleted successfully!" });
        } else {
          res.status(400).json({ message: `Cannot delete Store with id=${id}. Maybe Store was not found!` });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: "Could not delete Store with id=" + id });
      });
  });
};

exports.deleteAll = (req, res) => {
  Store.findAll().then(async (stores) => {
    for (const store of stores) {
      if (store.store_image) {
        await deleteImageFromS3(store.store_image);
      }
    }

    Store.destroy({
      where: {},
      truncate: false,
    })
      .then((nums) => {
        res.status(200).json({ message: `${nums} Stores were deleted successfully!` });
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message || "Some error occurred while removing all Stores.",
        });
      });
  });
};

exports.findAllByUserId = (req, res) => {
  const id = req.params.userId;
  Store.findAll({
    where: { users_id: id },
  })
    .then((data) => {
      data.map((store) => {
        if (store.store_image) {
          store.store_image = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET_NAME, Key: store.store_image });
        }
      });
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error retrieving Store with id=" + id });
    });
};
