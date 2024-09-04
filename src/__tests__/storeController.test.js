const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../server");
const db = require("../models");
const { secret } = require("../configs/auth.config");

let token;
let usersId;
let storeId;

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

    // const { username, email } = generateUniqueUser();

    // // สร้างผู้ใช้ใหม่และเก็บ users_id
    // const user = await db.user.create({
    //   first_name: "Worapakorn",
    //   last_name: "Jarusiriphot",
    //   username: username,
    //   password: "password123",
    //   email: email,
    //   birthday: "03/17/2003",
    //   phone_number: "0623844415",
    //   gender: "ชาย",
    //   user_image: "a84f9cd9-3c1d-4cb2-ba88-a188c298d119.jpeg",
    // });
    // usersId = user.users_id;

    // // สร้าง token จาก users_id
    // token = jwt.sign({ users_id: usersId }, secret, { expiresIn: "24h" });

    // // สร้าง store ใหม่โดยใช้ users_id
    // const store = await db.store.create({
    //   name_store: "Outcast Gaming",
    //   phone_number: "0623844415",
    //   house_number: "43/5",
    //   province: "นครปฐม",
    //   district: "เทศบาลนคร",
    //   sub_district: "ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง",
    //   road: "ถนนราชดำเนิน (ถนนต้นสน)",
    //   alley: "เทศบาล",
    //   store_image: "b3afd629-c2cb-4dfe-8657-157f9a567fb8.jpeg",
    //   users_id: usersId, // ใช้ users_id ที่เพิ่งสร้าง
    // });

    // storeId = store.store_id;
  } catch (err) {
    console.error("Error during setup:", err);
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

describe("Store Controller", () => {
  it("should create a new store", async () => {
    const res = await request(app)
      .post("/api/store")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name_store: "New Store",
        phone_number: "0623844415",
        house_number: "43/5",
        province: "Bangkok",
        district: "District1",
        sub_district: "SubDistrict1",
        road: "Main Road",
        alley: "Alley1",
        store_image: "store_image.jpeg",
        users_id: "08c3ee6b-cc21-48e2-861f-e445e135f4c1", // ฟิลด์สำคัญที่ต้องตรงกับข้อมูลจริง
      });
  
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty("name_store", "New Store");
  });  

  it("should fetch all stores", async () => {
    const res = await request(app)
      .get("/api/store")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should update a store", async () => {
    const res = await request(app)
      .put(`/api/store/3594f82f-e3bf-11ee-9efc-30d0422f59c9`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name_store: "Updated Store",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "Store was updated successfully."
    );
  });

  it("should delete a store", async () => {
    const res = await request(app)
      .delete(`/api/store/07da8a2f-8a82-4074-a8af-94f2e84e374c`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "Store was deleted successfully!"
    );
  });
});
