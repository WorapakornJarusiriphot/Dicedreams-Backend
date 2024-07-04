const express = require("express");
// ไลบรารี express เป็นเฟรมเวิร์กที่นิยมใช้ในการสร้างเซิร์ฟเวอร์ HTTP ด้วย Node.js มีเครื่องมือและมิดเดิลแวร์ที่หลากหลายสำหรับการจัดการคำขอและการตอบกลับ
const http = require('http');
const socketIo = require('socket.io');
// ไลบรารี socket.io ใช้ในการจัดการการเชื่อมต่อแบบเรียลไทม์ระหว่างไคลเอนต์และเซิร์ฟเวอร์ผ่าน WebSocket ทำให้สามารถสื่อสารแบบสองทางได้อย่างมีประสิทธิภาพ
const cors = require("cors");
// ไลบรารี cors ใช้ในการจัดการปัญหาการร้องขอข้ามโดเมน (Cross-Origin Resource Sharing) ซึ่งช่วยให้เซิร์ฟเวอร์สามารถอนุญาตการเข้าถึงจากโดเมนอื่นได้ตามที่กำหนด
const path = require('path');
const passport = require('passport');
// ไลบรารี passport และ passport-jwt ใช้ในการจัดการการตรวจสอบผู้ใช้ (authentication) โดย passport 
// เป็น middleware ที่นิยมใช้ในการตรวจสอบผู้ใช้ในแอปพลิเคชัน Node.js และ passport-jwt เป็น strategy หนึ่งที่ใช้ในการตรวจสอบ JWT
const bodyParser = require('body-parser');
// ไลบรารี body-parser ใช้ในการแยกส่วนข้อมูล (parse) ที่ถูกส่งมาในคำขอ HTTP เช่น ข้อมูลในรูปแบบ JSON 
// หรือ URL-encoded ทำให้สามารถเข้าถึงข้อมูลเหล่านั้นได้ง่ายขึ้นผ่าน req.body
const db = require("./models/index");

const errorHandler = require('./middleware/errorHandler');
const routerUser = require("./routers/users");
const routerAuth = require("./routers/auth");
const routerPostActivity = require("./routers/postActivity");
const routerPostGame = require("./routers/postGame");
const routerChat = require("./routers/chat");
const routParticipate = require("./routers/participate");
const routerStore = require("./routers/store");
const routerNotification = require("./routers/notification");

// Import Swagger configuration
const { swaggerUi, specs } = require('./configs/swaggerConfig');

db.sequelize.sync(); //โค้ดนี้ใช้ในการเชื่อมต่อกับฐานข้อมูล MySQL โดยใช้ Sequelize ORM และสร้างตารางใหม่หากยังไม่มีตารางในฐานข้อมูล และเชื่อมต่อกับตารางที่มีอยู่แล้วหากมีตารางในฐานข้อมูลแล้ว
// db.sequelize.sync({ force: true }).then(() => { //โค้ดนี้ใช้ในการเชื่อมต่อกับฐานข้อมูล MySQL โดยใช้ Sequelize ORM และลบตารางที่มีอยู่ในฐานข้อมูลและสร้างตารางใหม่ทุกครั้งที่เริ่มเซิร์ฟเวอร์
//     console.log("Drop and resync DB"); 
//   });

const app = express(); //โค้ดนี้สร้าง Express.js แอปพลิเคชัน

const server = http.createServer(app); //โค้ดนี้สร้างเซิร์ฟเวอร์ HTTP จาก Express.js แอปพลิเคชัน และเรียกใช้งาน Socket.IO โดยใช้เซิร์ฟเวอร์ HTTP ที่สร้างขึ้น
const io = socketIo(server); //โค้ดนี้สร้างเซิร์ฟเวอร์ WebSocket จากเซิร์ฟเวอร์ HTTP ที่สร้างขึ้น และเรียกใช้งาน Socket.IO โดยใช้เซิร์ฟเวอร์ HTTP ที่สร้างขึ้น
app.set('socketio', io); //โค้ดนี้เก็บอ็อบเจ็กต์ WebSocket ใน Express.js แอปพลิเคชันเพื่อให้สามารถเข้าถึงได้จากทุกที่ในแอปพลิเคชัน โดยใช้ req.app.get('socketio')

io.on('connection', (socket) => { //โค้ดนี้เริ่มต้นการเชื่อมต่อ WebSocket และแสดงข้อความยืนยันเมื่อมีการเชื่อมต่อสำเร็จ
  console.log('a user connected');  
  socket.on('disconnect', () => { //โค้ดนี้จัดการเหตุการณ์เมื่อผู้ใช้ตัดการเชื่อมต่อ WebSocket และแสดงข้อความยืนยันเมื่อการตัดการเชื่อมต่อสำเร็จ
    console.log('user disconnected'); 
  });
});

//โค้ดนี้ตั้งค่า CORS เพื่ออนุญาตการร้องขอข้ามโดเมนจากทุกต้นทาง (origin: *)
var corsOptions = { 
  origin: "*" 
};

app.use(cors(corsOptions)); //โค้ดนี้ใช้ CORS ใน Express.js แอปพลิเคชัน โดยใช้การตั้งค่าที่กำหนดในตัวแปร corsOptions ที่อนุญาตการร้องขอข้ามโดเมนจากทุกต้นทาง (origin: *) 

// parse requests of content-type - application/json
//โค้ดนี้ตั้งค่า Body Parser สำหรับการแยกส่วนข้อมูลจากคำขอ HTTP ที่มีเนื้อหา JSON และ URL-encoded และตั้งค่าเส้นทางสำหรับไฟล์สาธารณะ
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//init passport
app.use(passport.initialize()); //โค้ดนี้ตั้งค่า Passport สำหรับการตรวจสอบผู้ใช้

// simple route
// โค้ดนี้ตั้งค่าเส้นทางเริ่มต้นสำหรับการแสดงข้อความต้อนรับและหน้า HTML สำหรับการทดสอบการแจ้งเตือน รวมถึงการตั้งค่าเส้นทางสำหรับ Swagger UI และเส้นทาง API ต่างๆ
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Worapakorn Jarusiriphot application." });
});

app.get('/testnotification', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

// Add Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));  //โค้ดนี้เพิ่ม Swagger UI ใน Express.js แอปพลิเคชัน โดยใช้เส้นทาง /api-docs และสร้างเอกสาร API จาก specs ที่ได้จากไฟล์ swaggerConfig.js

app.use('/api/auth', routerAuth); //โค้ดนี้เพิ่มเส้นทาง /api/auth ใน Express.js แอปพลิเคชัน โดยใช้ routerAuth ที่เป็นเส้นทางสำหรับการตรวจสอบผู้ใช้ (authentication) และการสร้าง Token JWT โดยใช้ Passport และ JWT ในการตรวจสอบผู้ใช้ 
app.use('/api/users', routerUser); //โค้ดนี้เพิ่มเส้นทาง /api/users ใน Express.js แอปพลิเคชัน โดยใช้ routerUser ที่เป็นเส้นทางสำหรับการจัดการข้อมูลผู้ใช้ รวมถึงการสร้างผู้ใช้ใหม่ แก้ไข และลบผู้ใช้ และการแสดงข้อมูลผู้ใช้ โดยใช้ Passport ในการตรวจสอบผู้ใช้ 
app.use('/api/postActivity', routerPostActivity); //โค้ดนี้เพิ่มเส้นทาง /api/postActivity ใน Express.js แอปพลิเคชัน โดยใช้ routerPostActivity ที่เป็นเส้นทางสำหรับการจัดการกิจกรรม รวมถึงการสร้างกิจกรรมใหม่ แก้ไข และลบกิจกรรม และการแสดงข้อมูลกิจกรรม โดยใช้ Passport ในการตรวจสอบผู้ใช้ 
app.use('/api/postGame', routerPostGame); //โค้ดนี้เพิ่มเส้นทาง /api/postGame ใน Express.js แอปพลิเคชัน โดยใช้ routerPostGame ที่เป็นเส้นทางสำหรับการจัดการเกม รวมถึงการสร้างเกมใหม่ แก้ไข และลบเกม และการแสดงข้อมูลเกม โดยใช้ Passport ในการตรวจสอบผู้ใช้ 
app.use('/api/chat', routerChat); //โค้ดนี้เพิ่มเส้นทาง /api/chat ใน Express.js แอปพลิเคชัน โดยใช้ routerChat ที่เป็นเส้นทางสำหรับการจัดการการแชท รวมถึงการสร้างข้อความใหม่ แก้ไข และลบข้อความ และการแสดงข้อมูลข้อความ โดยใช้ Passport ในการตรวจสอบผู้ใช้ 
app.use('/api/participate', routParticipate); //โค้ดนี้เพิ่มเส้นทาง /api/participate ใน Express.js แอปพลิเคชัน โดยใช้ routParticipate ที่เป็นเส้นทางสำหรับการจัดการการเข้าร่วมกิจกรรม รวมถึงการสร้างการเข้าร่วมใหม่ แก้ไข และลบการเข้าร่วม และการแสดงข้อมูลการเข้าร่วม โดยใช้ Passport ในการตรวจสอบผู้ใช้ 
app.use('/api/store', routerStore); //โค้ดนี้เพิ่มเส้นทาง /api/store ใน Express.js แอปพลิเคชัน โดยใช้ routerStore ที่เป็นเส้นทางสำหรับการจัดการข้อมูลร้านค้า รวมถึงการสร้างร้านค้าใหม่ แก้ไข และลบร้านค้า และการแสดงข้อมูลร้านค้า โดยใช้ Passport ในการตรวจสอบผู้ใช้ 
app.use('/api/notification', routerNotification); //โค้ดนี้เพิ่มเส้นทาง /api/notification ใน Express.js แอปพลิเคชัน โดยใช้ routerNotification ที่เป็นเส้นทางสำหรับการจัดการการแจ้งเตือน รวมถึงการสร้างการแจ้งเตือนใหม่ แก้ไข และลบการแจ้งเตือน และการแสดงข้อมูลการแจ้งเตือน โดยใช้ Passport ในการตรวจสอบผู้ใช้ 

// Serve swagger.json
//โค้ดนี้ให้บริการไฟล์ swagger.json เพื่อให้สามารถเข้าถึงได้จากเส้นทางที่กำหนด
app.get('/swagger.json', (req, res) => { 
  res.setHeader('Content-Type', 'application/json'); 
  res.send(specs); 
}); 

// โค้ดนี้ใช้มิดเดิลแวร์สำหรับการจัดการข้อผิดพลาดและตั้งค่าพอร์ตที่เซิร์ฟเวอร์จะรับฟังการร้องขอ โดยแสดงข้อความยืนยันเมื่อเซิร์ฟเวอร์เริ่มทำงานสำเร็จ
app.use(errorHandler);
// set port, listen for requests
const PORT = process.env.PORT || 8080; //โค้ดนี้ตั้งค่าพอร์ตที่เซิร์ฟเวอร์จะรับฟังการร้องขอ โดยใช้พอร์ตที่กำหนดในตัวแปรสภาพแวดล้อม PORT หรือใช้พอร์ต 8080 ถ้าไม่ได้กำหนดพอร์ต
server.listen(PORT, () => { //โค้ดนี้เริ่มเซิร์ฟเวอร์ที่พอร์ตที่กำหนด และแสดงข้อความยืนยันเมื่อเซิร์ฟเวอร์เริ่มทำงานสำเร็จ 
  console.log(`Server is running on port ${PORT}.`);
  console.log(`Visit the application at: http://localhost:${PORT}`);
  console.log(`API documentation is available at: http://localhost:${PORT}/api-docs`);
  console.log(`Swagger JSON is available at: http://localhost:${PORT}/swagger.json`);
});

// console.log('Using mysql2 version:', require('mysql2').version);

//ไฟล์ server.js นี้เป็นไฟล์หลักในการตั้งค่าและรันเซิร์ฟเวอร์สำหรับแอปพลิเคชัน โดยรวมถึงการตั้งค่าการเชื่อมต่อกับฐานข้อมูล การจัดการเส้นทาง API การเชื่อมต่อ WebSocket 
//และการจัดการเอกสาร API ด้วย Swagger ซึ่งช่วยให้การพัฒนาและการจัดการเซิร์ฟเวอร์เป็นไปอย่างมีประสิทธิภาพและสะดวก