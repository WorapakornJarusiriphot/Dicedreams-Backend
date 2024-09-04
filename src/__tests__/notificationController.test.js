const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../server");
const db = require("../models");
const { secret } = require("../configs/auth.config");

let token;

beforeAll(async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("Database synced");

    // // สร้าง token สำหรับการทดสอบ
    // const user = await db.user.create({
    //   first_name: "Worapakorn",
    //   last_name: "Jarusiriphot",
    //   username: "TestUser",
    //   password: "password123",
    //   email: "testuser@gmail.com",
    // });
    // token = jwt.sign({ users_id: user.users_id }, secret, { expiresIn: "24h" });
  } catch (err) {
    console.error("Error syncing database", err);
  }
});

afterAll(async () => {
  try {
    await db.sequelize.close();
    console.log("Database connection closed");
  } catch (err) {
    console.error("Error closing database connection", err);
  }
});

describe("Notification Controller", () => {
  // beforeAll(async () => {
  //   jest.setTimeout(15000); // เพิ่ม timeout
  //   // เพิ่มการสร้าง notification ล่วงหน้าเพื่อให้ทดสอบได้
  //   await db.notification.create({
  //     message: "Test notification",
  //     is_read: false,
  //   });
  // });

  it("should fetch all notifications", async () => {
    const res = await request(app).get("/api/notification");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should update a notification", async () => {
    // const notification = await db.notification.findOne(); // หา notification ที่มีอยู่
    const res = await request(app)
      .put(`/api/notification`)
      .send({ notification_id: ["1b308424-b3dd-4d8e-a589-8a4041bf15a1"] });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "Notification was updated successfully."
    );
  });
});
