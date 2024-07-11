const db = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const { uploadImageToS3, deleteImageFromS3, getSignedUrl } = require("../utils/s3");

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

    let imageUrl = null;
    if (post_activity_image) {
      imageUrl = await uploadImageToS3(post_activity_image);
    }

    const data = {
      name_activity,
      status_post,
      creation_date,
      detail_post,
      date_activity: moment(date_activity, "MM-DD-YYYY"),
      time_activity,
      store_id,
      post_activity_image: imageUrl,
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
    console.log(`Received search query for activities: ${search}`);

    const condition = search
      ? {
          [Op.or]: [
            { name_activity: { [Op.like]: `%{search}%` } },
            { detail_post: { [Op.like]: `%{search}%` } },
          ],
          status_post: { [Op.not]: "unActive" },
        }
      : {
          status_post: { [Op.not]: "unActive" },
        };

    const post_activity = await PostActivity.findAll({ where: condition });
    const postsWithImageUrls = await Promise.all(post_activity.map(async (post) => {
      if (post.post_activity_image) {
        post.post_activity_image = await getSignedUrl(post.post_activity_image);
      }
      return post;
    }));
    res.status(200).json(postsWithImageUrls);
  } catch (error) {
    next(error);
  }
};

exports.findAllStorePosts = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    console.log(`Fetching posts for store ID: ${storeId}`);

    const post_activity = await PostActivity.findAll({
      where: { store_id: storeId },
    });

    console.log(`Found posts: ${post_activity.length}`);

    const postsWithImageUrls = await Promise.all(post_activity.map(async (post) => {
      if (post.post_activity_image) {
        post.post_activity_image = await getSignedUrl(post.post_activity_image);
      }
      return post;
    }));

    res.status(200).json(postsWithImageUrls);
  } catch (error) {
    console.error("Failed to fetch store posts:", error.message);
    next(error);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const post_activity_id = req.params.id;
    const post_activity = await PostActivity.findByPk(post_activity_id);
    if (post_activity.post_activity_image) {
      post_activity.post_activity_image = await getSignedUrl(post_activity.post_activity_image);
    }
    res.status(200).json(post_activity);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const post_activity_id = req.params.id;

    if (req.body.post_activity_image && req.body.post_activity_image.startsWith("data:image")) {
      const postactivity = await PostActivity.findByPk(post_activity_id);
      const oldImage = postactivity.post_activity_image;

      const newImageUrl = await uploadImageToS3(req.body.post_activity_image);
      req.body.post_activity_image = newImageUrl;

      // ลบรูปภาพเก่าออกจาก S3
      if (oldImage) {
        await deleteImageFromS3(oldImage);
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

    if (post_activity.post_activity_image) {
      await deleteImageFromS3(post_activity.post_activity_image);
    }

    await PostActivity.destroy({
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
    const post_activity = await PostActivity.findAll();

    for (let i = 0; i < post_activity.length; i++) {
      if (post_activity[i].post_activity_image) {
        await deleteImageFromS3(post_activity[i].post_activity_image);
      }
    }

    await PostActivity.destroy({
      where: {},
      truncate: false,
    });
    res.status(204).json({ message: "All PostActivities were deleted successfully." });
  } catch (error) {
    next(error);
  }
};
