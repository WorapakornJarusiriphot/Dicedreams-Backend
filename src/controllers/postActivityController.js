// ไฟล์นี้เป็นคอนโทรลเลอร์สำหรับจัดการกิจกรรม (post_activity) ในแอปพลิเคชัน โดยใช้ไลบรารี Sequelize เพื่อจัดการกับฐานข้อมูลและการทำงานต่างๆ ที่เกี่ยวข้องกับกิจกรรม
const db = require("../models");
const moment = require("moment");
// ไลบรารี moment ใช้ในการจัดการและปรับแต่งวันที่และเวลา ทำให้การจัดการวันที่และเวลาในแอปพลิเคชันเป็นไปอย่างง่ายดายและมีประสิทธิภาพ
const { v4: uuidv4 } = require("uuid"); // เรียกใช้งาน uuid เพื่อสร้างชื่อไฟล์ภาพที่ไม่ซ้ำกัน และสุ่ม โดยใช้ uuidv4()
// ไลบรารี uuid ใช้ในการสร้าง UUID (Universally Unique Identifier) ซึ่งเป็นไอดีที่ไม่ซ้ำกันทั่วโลก ทำให้มั่นใจได้ว่าไอดีที่สร้างขึ้นจะไม่ซ้ำกับไอดีอื่นๆ
const { Op } = require("sequelize"); // เรียกใช้งาน Op จาก sequelize เพื่อใช้เป็นตัวดำเนินการในการค้นหาข้อมูล
const fs = require("fs"); // เรียกใช้งาน fs เพื่อจัดการไฟล์และเอาออก โดยใช้ unlink ในการลบไฟล์ และ writeFile ในการเขียนไฟล์ และอ่านไฟล์ 
const path = require("path"); // เรียกใช้งาน path เพื่อจัดการ path ของไฟล์ และโฟลเดอร์ 
const { promisify } = require("util"); // เรียกใช้งาน promisify เพื่อแปลง callback เป็น promise ในการใช้ fs ในการเขียนไฟล์ 
const writeFileAsync = promisify(fs.writeFile); // ใช้ promisify ในการแปลง writeFile เป็น promise ในการใช้ fs ในการเขียนไฟล์ 

const PostActivity = db.post_activity; // เรียกใช้งาน post_activity จาก models ที่ได้สร้างไว้ 

// ฟังก์ชันนี้ใช้สำหรับสร้างกิจกรรมใหม่ โดยมีการตรวจสอบและบันทึกข้อมูลที่ได้รับจาก req.body ลงในฐานข้อมูล และหากมีรูปภาพกิจกรรมก็จะทำการบันทึกรูปภาพลงในดิสก์
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

// ฟังก์ชันนี้ใช้สำหรับดึงข้อมูลกิจกรรมทั้งหมด โดยมีการตรวจสอบคำค้นหา และค้นหาข้อมูลในฐานข้อมูล และส่งข้อมูลกิจกรรมทั้งหมดกลับไปที่ผู้ใช้
// ฟังก์ชันนี้ดึงข้อมูลกิจกรรมทั้งหมดจากฐานข้อมูลตามเงื่อนไขการค้นหา (search) และสถานะ (status_post), จากนั้นปรับ URL ของรูปภาพก่อนจะส่งกลับในรูปแบบ JSON
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

// ดึงโพสต์ทั้งหมดของร้านค้าตาม store_id
// ฟังก์ชันนี้ดึงข้อมูลกิจกรรมทั้งหมดของร้านค้าจากฐานข้อมูลตาม store_id ที่ระบุใน req.params.storeId และปรับ URL ของรูปภาพก่อนจะส่งกลับในรูปแบบ JSON
exports.findAllStorePosts = async (req, res, next) => { 
  try {
    const storeId = req.params.storeId;
    console.log(`Fetching posts for store ID: ${storeId}`);

    const post_activity = await PostActivity.findAll({
      where: { store_id: storeId },
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

// ฟังก์ชันนี้ดึงข้อมูลกิจกรรมที่มี ID ตรงกับที่ระบุใน req.params.id และปรับ URL ของรูปภาพก่อนจะส่งกลับในรูปแบบ JSON
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

// ฟังก์ชันนี้อัปเดตข้อมูลกิจกรรมที่มี ID ตรงกับที่ระบุใน req.params.id โดยมีการตรวจสอบและบันทึกรูปภาพใหม่ลงในดิสก์หากมีการอัปเดตรูปภาพ
exports.update = async (req, res, next) => { 
  try {
    const post_activity_id = req.params.id; // รับค่า post_activity_id จาก req.params 

    if (req.body.post_activity_image) { // ตรวจสอบว่ามีการอัปเดตรูปภาพหรือไม่
      if (req.body.post_activity_image.search("data:image") != -1) { // ตรวจสอบว่ารูปภาพที่อัปเดตเป็นรูปภาพใหม่หรือไม่ โดยตรวจสอบจาก URL ของรูปภาพ
        const postactivity = await PostActivity.findByPk(post_activity_id); // ค้นหาข้อมูลกิจกรรมที่ต้องการอัปเดต 
        const uploadPath = path.resolve("./") + "/src/public/images/"; // กำหนด path ของโฟลเดอร์ที่เก็บรูปภาพ 

        fs.unlink( // ลบรูปภาพเดิมออกจากดิสก์ โดยใช้ unlink ในการลบไฟล์ 
          uploadPath + postactivity.post_activity_image, // ระบุ path ของไฟล์ที่ต้องการลบ 
          function (err) { // ฟังก์ชัน callback ที่รับ err จากการลบไฟล์ 
            console.log("File deleted!"); // แสดงข้อความเมื่อลบไฟล์สำเร็จ 
          }
        );

        req.body.post_activity_image = await saveImageToDisk( // บันทึกรูปภาพลงในดิสก์ และเปลี่ยนชื่อไฟล์เป็นชื่อใหม่ โดยใช้ uuidv4()
          req.body.post_activity_image // รับรูปภาพจาก req.body
        );
      }
    }
    req.body.date_activity = moment(req.body.date_activity, "MM-DD-YYYY"); // แปลงวันที่กิจกรรมจาก string เป็น date object โดยใช้ moment library 
    await PostActivity.update(req.body, { // อัปเดตข้อมูลกิจกรรมที่ต้องการอัปเดต โดยใช้ update จาก Sequelize
      where: { // ระบุเงื่อนไขในการอัปเดตข้อมูล
        post_activity_id, // ระบุ post_activity_id ที่ต้องการ 
      },
    });
    res.status(200).json({ message: "PostActivity was updated successfully." }); // ส่งข้อความยืนยันเมื่อการอัปเดตสำเร็จ
  } catch (error) { // จัดการ error ที่เกิดขึ้น
    next(error); // ส่ง error ไปที่ middleware ถัดไป
  }
};

// ฟังก์ชันนี้ลบข้อมูลกิจกรรมที่มี ID ตรงกับที่ระบุใน req.params.id และส่งข้อความยืนยันเมื่อการลบสำเร็จ
exports.delete = async (req, res, next) => { 
  try { 
    const post_activity_id = req.params.id; // รับค่า post_activity_id จาก req.params
    const post_activity = await PostActivity.destroy({ // ลบข้อมูลกิจกรรมที่ต้องการ โดยใช้ destroy จาก Sequelize 
      where: { // ระบุเงื่อนไขในการลบข้อมูล
        post_activity_id, // ระบุ post_activity_id ที่ต้องการ 
      },
    });
    res.status(204).json({ message: "PostActivity was deleted successfully." }); // ส่งข้อความยืนยันเมื่อการลบสำเร็จ 
  } catch (error) {
    next(error);
  }
};

// ฟังก์ชันนี้ลบข้อมูลกิจกรรมทั้งหมดจากฐานข้อมูลและส่งข้อความยืนยันเมื่อการลบสำเร็จ
exports.deleteAll = async (req, res, next) => {
  try {
    const post_activity = await PostActivity.destroy({ // ลบข้อมูลกิจกรรมทั้งหมด โดยใช้ destroy จาก Sequelize 
      where: {}, // ไม่ระบุเงื่อนไขในการลบข้อมูล จึงจะลบทุก row ในตาราง 
      truncate: false, // ถ้าเป็น true จะลบทุก row ในตาราง แต่ถ้าเป็น false จะลบแค่ row ที่ตรงกับเงื่อนไข 
    });
    res.status(204).json(post_activity); // ส่งข้อความยืนยันเมื่อการลบสำเร็จ 
  } catch (error) { // จัดการ error ที่เกิดขึ้น 
    next(error);  // ส่ง error ไปที่ middleware ถัดไป
  }
};

async function saveImageToDisk(baseImage) { // ฟังก์ชันนี้ใช้สำหรับบันทึกรูปภาพลงในดิสก์
  const projectPath = path.resolve("./"); // กำหนด path ของโฟลเดอร์ที่เก็บรูปภาพ

  const uploadPath = `${projectPath}/src/public/images/`; // กำหนด path ของโฟลเดอร์ที่เก็บรูปภาพ

  const ext = baseImage.substring( // ตัดส่วนของ URL ของรูปภาพเพื่อหานามสกุลของไฟล์
    baseImage.indexOf("/") + 1, // หา index ของ "/" และบวก 1 เพื่อให้ได้ index ของนามสกุลไฟล์ 
    baseImage.indexOf(";base64") // หา index ของ ";base64" เพื่อให้ได้ index สุดท้ายของนามสกุลไฟล์ 
  );

  let filename = ""; // กำหนดชื่อไฟล์เป็นค่าว่าง
  if (ext === "svg+xml") { // ตรวจสอบนามสกุลของไฟล์ ถ้าเป็น svg+xml ให้สุ่มชื่อไฟล์ใหม่ 
    filename = `${uuidv4()}.svg`; // สุ่มชื่อไฟล์ใหม่ โดยใช้ uuidv4() และเพิ่มนามสกุลไฟล์เป็น svg
  } else {
    filename = `${uuidv4()}.${ext}`; // สุ่มชื่อไฟล์ใหม่ โดยใช้ uuidv4() และเพิ่มนามสกุลไฟล์เป็นนามสกุลของไฟล์ 
  }

  let image = decodeBase64Image(baseImage); // ถอดรหัสรูปภาพจาก base64 เพื่อให้ได้ข้อมูลของรูปภาพ 

  await writeFileAsync(uploadPath + filename, image.data, "base64"); // บันทึกรูปภาพลงในดิสก์ โดยใช้ writeFileAsync ในการเขียนไฟล์ 

  return filename; // ส่งชื่อไฟล์กลับ 
}

function decodeBase64Image(base64Str) { // ฟังก์ชันนี้ใช้สำหรับถอดรหัสรูปภาพจาก base64
  var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/); // ใช้ regex ในการตรวจสอบ base64 string ว่าถูกต้องหรือไม่ 
  var image = {}; // กำหนด object ของรูปภาพเป็นค่าว่าง 
  if (!matches || matches.length !== 3) { // ถ้าไม่ตรงกับ regex หรือไม่มีข้อมูล จะส่ง error 
    throw new Error("Invalid base64 string"); // ส่ง error ว่า base64 string ไม่ถูกต้อง 
  }

  image.type = matches[1]; // กำหนด type ของรูปภาพจาก regex ที่ตรงกับ index 1 
  image.data = matches[2]; // กำหนด data ของรูปภาพจาก regex ที่ตรงกับ index 2

  return image; // ส่งข้อมูลรูปภาพกลับ 
}
