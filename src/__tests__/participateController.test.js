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

describe("Participate Controller", () => {
  it("should create a new participation", async () => {
    const res = await request(app)
      .post("/api/participate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        participant_apply_datetime: "2024-09-04T08:00:00",
        participant_status: "pending",
        user_id: "217affca-a63a-429d-abed-c3c34498a1a8",
        post_games_id: "8c2ff04c-4cc6-42b4-aae4-262891b9d970"
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty(
      "message",
      "Participate was created successfully."
    );
  });

  it("should fetch all participations", async () => {
    const res = await request(app).get("/api/participate");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should update a participation", async () => {
    const res = await request(app)
      .put("/api/participate/00a9d2b7-1ef2-4203-bf4b-7e9b206871ba")
      .set("Authorization", `Bearer ${token}`)
      .send({ participant_status: "unActive" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "Participate was updated successfully."
    );
  });

  it("should delete a participation", async () => {
    const res = await request(app)
      .delete("/api/participate/5ce4c905-53f7-4441-a234-c52810f06f0b")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "Participate was deleted successfully."
    );
  });
});
