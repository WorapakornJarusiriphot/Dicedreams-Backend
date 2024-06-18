// create router for postActivity
const express = require("express");
const router = express.Router();
const postActivityController = require("../controllers/postActivityController");
const authentication = require("../middleware/authentication");
const passportJWT = require('../middleware/passportJWT');

router.post("/", [passportJWT.isLogin, authentication.isStore], postActivityController.create);
router.get("/", postActivityController.findAll);
router.get("/:id", [passportJWT.isLogin, authentication.isStoreOrUser], postActivityController.findOne);
router.put("/:id", [passportJWT.isLogin, authentication.isStore], postActivityController.update);
router.delete("/:id", [passportJWT.isLogin, authentication.isStore], postActivityController.delete);
// เส้นทางใหม่: ดึงโพสต์ทั้งหมดของร้านค้าตาม store_id
router.get("/store/:storeId", [passportJWT.isLogin, authentication.isStoreOrUser], postActivityController.findAllStorePosts);

module.exports = router;