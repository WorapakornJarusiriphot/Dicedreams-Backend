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

describe("Post Activity Controller", () => {
  it("should create a new post activity", async () => {
    const res = await request(app)
      .post("/api/postActivity")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name_activity: "Board Game Night",
        status_post: "active",
        creation_date: "2024-07-13 02:50:00",
        detail_post: "มาร่วมสนุกกับเกมกระดานยามค่ำคืนกับเรา",
        date_activity: "2024-07-13",
        time_activity: "18:00:00",
        post_activity_image: "1cd2498d-07fa-4ea5-83ef-c71781bc8cdf.jpeg",
        store_id: "3594f82f-e3bf-11ee-9efc-30d0422f59c9",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("name_activity", "Board Game Night");
  });

  it("should fetch all post activities", async () => {
    const res = await request(app).get("/api/postActivity");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should update a post activity", async () => {
    const res = await request(app)
      .put("/api/postActivity/296bcf4f-0c62-4cbd-9070-4698ab629f83")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name_activity: "Updated Board Game Night",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "PostActivity was updated successfully."
    );
  });

  it("should delete a post activity", async () => {
    const res = await request(app)
      .delete("/api/postActivity/1f3781cc-6e9e-489b-9cd7-5708aaf694ac")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "PostActivity was deleted successfully."
    );
  });
});
