// create controller for store
const db = require("../models");
const Store = db.store;

const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

// Create and Save a new Store
exports.create = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.name_store) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    // Handle store image
    let storeImage;
    if (req.body.store_image) {
      if (req.body.store_image.startsWith("data:image")) {
        storeImage = await saveImageToDisk(req.body.store_image);
      } else {
        storeImage = req.body.store_image;
      }
    }

    // Create a Store
    const store = {
      name_store: req.body.name_store,
      phone_number: req.body.phone_number,
      house_number: req.body.house_number,
      province: req.body.province,
      district: req.body.district,
      sub_district: req.body.sub_district,
      road: req.body.road,
      alley: req.body.alley,
      store_image: storeImage,
      users_id: req.body.users_id,
    };

    // Save Store in the database async
    const data = await Store.create(store);
    res.status(201).json({ message: "Store was created successfully.", data: data });
  } catch (error) {
    next(error);
  }
};

// Retrieve all Stores from the database.
exports.findAll = (req, res) => {
  Store.findAll({
    order: [['createdAt', 'DESC']]  // เรียงลำดับจากใหม่ไปเก่า
  })
    .then((data) => {
      data.map((store) => {
        if (store.store_image) {
          store.store_image = `${req.protocol}://${req.get("host")}/images/${store.store_image}`;
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

// Find a single Store with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Store.findByPk(id)
    .then((data) => {
      if (data) {
        if (data.store_image) {
          data.store_image = `${req.protocol}://${req.get("host")}/images/${data.store_image}`;
        }
        res.status(200).json(data);
      } else {
        res.status(404).send({
          message: `Cannot find Store with id=${id}.`
        });
      }
    })
    .catch((err) => {
      console.error("Error retrieving Store with id=", id, "error:", err);
      res.status(500).send({
        message: "Error retrieving Store with id=" + id
      });
    });
};

// Update a Store by the id in the request
exports.update = async (req, res, next) => {
  const id = req.params.id;

  if (req.body.store_image) {
    // Check if image is updated
    if (req.body.store_image.startsWith("data:image")) {
      const store = await Store.findByPk(id);
      const uploadPath = path.resolve("./") + "/src/public/images/";

      if (store.store_image) {
        fs.unlink(uploadPath + store.store_image, function (err) {
          if (err) console.log("File not found or already deleted.");
        });
      }

      req.body.store_image = await saveImageToDisk(req.body.store_image);
    }
  }

  Store.update(req.body, {
    where: { store_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "Store was updated successfully.",
        });
      } else {
        res.status(400).json({
          message: `Cannot update Store with id=${id}. Maybe Store was not found or req.body is empty!`,
        });
      }
    })
    .catch((error) => {
      next(error);
    });
};

// Delete a Store with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Store.destroy({
    where: { store_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "Store was deleted successfully!",
        });
      } else {
        res.status(400).json({
          message: `Cannot delete Store with id=${id}. Maybe Store was not found!`,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Could not delete Store with id=" + id,
      });
    });
};

// Delete all Stores from the database.
exports.deleteAll = (req, res) => {
  Store.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res
        .status(200)
        .json({ message: `${nums} Stores were deleted successfully!` });
    })
    .catch((error) => {
      res.status(500).json({
        message:
          error.message || "Some error occurred while removing all Stores.",
      });
    });
};

// Retrieve all Stores by user_id
exports.findAllByUserId = (req, res) => {
  const id = req.params.id;
  Store.findAll({
    where: { user_id: id },
    order: [['createdAt', 'DESC']]  // เรียงลำดับจากใหม่ไปเก่า
  })
    .then((data) => {
      data.map((store) => {
        if (store.store_image) {
          store.store_image = `${req.protocol}://${req.get("host")}/images/${store.store_image}`;
        }
      });
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving Store with id=" + id,
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
