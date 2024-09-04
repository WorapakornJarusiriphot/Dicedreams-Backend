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

describe("Chat Controller", () => {
  it("should create a new chat", async () => {
    const res = await request(app).post("/api/chat").send({
      message: "Test message",
      datetime_chat: "2024-09-04T08:00:00",
      user_id: "3cb8cba9-874c-482e-bb5e-c5d523d77b7a",
      post_games_id: "e2743413-ac96-4884-b645-9ee77b43d571",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Chat created successfully.");
  });

  it("should fetch all chats", async () => {
    const res = await request(app).get("/api/chat");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should fetch a single chat", async () => {
    const res = await request(app).get("/api/chat/94710");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("chat_id");
  });

  it("should update a chat", async () => {
    const res = await request(app)
      .put("/api/chat/56")
      .send({ message: "Updated message" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "Chat updated successfully."
    );
  });

  it("should delete a chat", async () => {
    const res = await request(app).delete("/api/chat/9223372036854775807");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "Chat deleted successfully!"
    );
  });
});
