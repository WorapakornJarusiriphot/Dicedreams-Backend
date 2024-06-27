const express = require("express");
const http = require('http');
const socketIo = require('socket.io');

const cors = require("cors");
const path = require('path');
const passport = require('passport');
const bodyParser = require('body-parser');
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

db.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
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

app.use(cors(corsOptions));

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth', routerAuth);
app.use('/api/users', routerUser);
app.use('/api/postActivity', routerPostActivity);
app.use('/api/postGame', routerPostGame);
app.use('/api/chat', routerChat);
app.use('/api/participate', routParticipate);
app.use('/api/store', routerStore);
app.use('/api/notification', routerNotification);

// Serve swagger.json
//โค้ดนี้ให้บริการไฟล์ swagger.json เพื่อให้สามารถเข้าถึงได้จากเส้นทางที่กำหนด
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// โค้ดนี้ใช้มิดเดิลแวร์สำหรับการจัดการข้อผิดพลาดและตั้งค่าพอร์ตที่เซิร์ฟเวอร์จะรับฟังการร้องขอ โดยแสดงข้อความยืนยันเมื่อเซิร์ฟเวอร์เริ่มทำงานสำเร็จ
app.use(errorHandler);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`Visit the application at: http://localhost:${PORT}`);
  console.log(`API documentation is available at: http://localhost:${PORT}/api-docs`);
  console.log(`Swagger JSON is available at: http://localhost:${PORT}/swagger.json`);
});

// console.log('Using mysql2 version:', require('mysql2').version);

//ไฟล์ server.js นี้เป็นไฟล์หลักในการตั้งค่าและรันเซิร์ฟเวอร์สำหรับแอปพลิเคชัน โดยรวมถึงการตั้งค่าการเชื่อมต่อกับฐานข้อมูล การจัดการเส้นทาง API การเชื่อมต่อ WebSocket 
//และการจัดการเอกสาร API ด้วย Swagger ซึ่งช่วยให้การพัฒนาและการจัดการเซิร์ฟเวอร์เป็นไปอย่างมีประสิทธิภาพและสะดวก