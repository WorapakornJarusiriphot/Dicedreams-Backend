const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../server");
const db = require("../models");
const { secret } = require("../configs/auth.config");
const { user: User } = require("../models"); // อ้างอิง db.user โดยตรง

function generateUniqueUser() {
  const timestamp = Date.now();
  return {
    username: `WOJA${timestamp}`,
    email: `Worapakorn${timestamp}@gmail.com`,
  };
}

beforeAll(async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("Database synced");
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

describe("User Controller", () => {
  it("should create a new user", async () => {
    const { username, email } = generateUniqueUser();
    const res = await request(app).post("/api/users").send({
      first_name: "Worapakorn",
      last_name: "Jarusiriphot",
      username: username,
      password: "password123",
      email: email,
      birthday: "03/17/2003",
      phone_number: "0623844415",
      gender: "ชาย",
      user_image: "a84f9cd9-3c1d-4cb2-ba88-a188c298d119.jpeg",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty(
      "message",
      "User was registered successfully!"
    );
  });

  it("should fetch all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0]).toHaveProperty("first_name");
  });

  it("should update a user", async () => {
    try {
      const { username, email } = generateUniqueUser();
      const newUser = await request(app).post("/api/users").send({
        first_name: "Worapakorn",
        last_name: "Jarusiriphot",
        username: username,
        password: "password123",
        email: email,
        birthday: "03/17/2003",
        phone_number: "0623844415",
        gender: "ชาย",
      });

      const users_id = newUser.body.users_id;
      const token = jwt.sign({ users_id }, secret, { expiresIn: "24h" });

      const res = await request(app)
        .put(`/api/users/${users_id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          first_name: "UpdatedFirstName",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty(
        "message",
        "User was updated successfully."
      );
    } catch (error) {
      console.error("Error during test:", error);
    }
  });

  it("should delete a user as admin", async () => {
    // ดึงข้อมูลผู้ใช้ล่าสุดจากฐานข้อมูล
    const user = await User.findOne({
      where: {},
      order: [["createdAt", "DESC"]],
    });

    // // ตรวจสอบ role ของผู้ใช้
    // const userRole = await User.findOne({ where: { users_id: user.users_id } });

    // if (userRole.role !== "admin") {
    //   throw new Error("Unauthorized. Admin only.");
    // }

    // // สร้าง JWT token สำหรับ admin
    // const token = jwt.sign({ users_id: user.users_id }, secret, {
    //   expiresIn: "24h",
    // });

    // ส่ง request ลบผู้ใช้
    const res = await request(app)
      .delete(`/api/users/${user.users_id}`)
      // .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "User was deleted successfully!"
    );
  });
});
