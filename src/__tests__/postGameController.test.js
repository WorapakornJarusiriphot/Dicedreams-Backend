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

describe("Post Game Controller", () => {
  it("should create a new post game", async () => {
    const res = await request(app).post("/api/postGame").send({
      name_games: "Werewolf",
      detail_post: "เอา Werewolf ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก",
      num_people: 10,
      date_meet: "2024-07-13", // ตรวจสอบรูปแบบวันที่ที่ถูกต้อง
      time_meet: "18:00:00",
      games_image: "2e0c0d0a-b71c-486b-a57f-7d85b6f7d558.jpeg",
      status_post: "active",
      creation_date: "2024-07-13 02:50:00",
      users_id: "48b0a732-b292-4cf8-bdd2-52156f177587",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty("name_games", "Werewolf");
  });

  it("should fetch all post games", async () => {
    const res = await request(app).get("/api/postGame");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should update a post game", async () => {
    const res = await request(app)
      .put("/api/postGame/09cb699f-6daf-4c37-8aec-d02eb7296870")
      .send({
        name_games: "Updated Werewolf",
        detail_post:
          "Updated เอา Werewolf ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก",
        num_people: 25,
        date_meet: "2024-07-15",
        time_meet: "17:00:00",
        games_image: "0b2794e6-bdcb-419c-b8fc-52d35a88b958.jpeg",
        status_post: "unActive",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "Game was updated successfully."
    );
  });

  // it("should delete a post game", async () => {
  //   const res = await request(app)
  //     .delete(`/api/postGame/0799009b-7e03-4f44-9a6b-e96ce4028166`)
  //     .set("Authorization", `Bearer ${token}`); // เพิ่ม token
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body).toHaveProperty(
  //     "message",
  //     "Game was deleted successfully!"
  //   );
  // });
});
