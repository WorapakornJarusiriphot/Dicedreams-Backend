require("dotenv").config(); // โหลดค่าจากไฟล์ .env

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const cors = require("cors");
const path = require("path");
const passport = require("passport");
const bodyParser = require("body-parser");
const db = require("./models/index");

const errorHandler = require("./middleware/errorHandler");
const routerUser = require("./routers/users");
const routerAuth = require("./routers/auth");
const routerPostActivity = require("./routers/postActivity");
const routerPostGame = require("./routers/postGame");
const routerChat = require("./routers/chat");
const routParticipate = require("./routers/participate");
const routerStore = require("./routers/store");
const routerNotification = require("./routers/notification");
const AWS = require("aws-sdk");
const config = require("./configs/config");

// ตั้งค่า AWS SDK ให้เชื่อมต่อกับ S3 โดยดึงค่าจาก config.js
const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  region: config.AWS_REGION,
});

// Import Swagger configuration
const { swaggerUi, specs } = require("./configs/swaggerConfig");

// ใช้การ sync แบบ alter เพื่ออัพเดต schema ของตารางที่มีอยู่แล้ว
db.sequelize
  .sync({ alter: true })
  .then(() => console.log("Tables have been updated successfully."))
  .catch((error) => console.error("Error updating tables:", error));

const app = express();

const server = http.createServer(app);
const io = socketIo(server);
app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//init passport
app.use(passport.initialize());

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Worapakorn Jarusiriphot application." });
});

app.get("/testnotification", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

// Add Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", routerAuth);
app.use("/api/users", routerUser);
app.use("/api/postActivity", routerPostActivity);
app.use("/api/postGame", routerPostGame);
app.use("/api/chat", routerChat);
app.use("/api/participate", routParticipate);
app.use("/api/store", routerStore);
app.use("/api/notification", routerNotification);

// Serve swagger.json
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

app.use(errorHandler);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
const DOMAIN = process.env.DOMAIN;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`Visit the application at: ${DOMAIN}`);
  console.log(`API documentation is available at: ${DOMAIN}/api-docs`);
  console.log(`Swagger JSON is available at: ${DOMAIN}/swagger.json`);
  // ตรวจสอบว่าชื่อ Bucket ถูกต้องหรือไม่
  console.log("S3 Bucket:", process.env.S3_BUCKET_NAME);
});

// console.log('Using mysql2 version:', require('mysql2').version);
