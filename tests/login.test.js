import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { env } from "../config.js";

describe("Auth flow && register", () => {
  const uniqueEmail = `urer_${Date.now()}@text.com`;
  const password = "testUserPassword";

  beforeAll(async () => {
    await mongoose.connect(env.dbUrl);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("register=> loginFlow", async () => {
    const regRes = await request(app)
      .post("/api/users/register")
      .send({ email: uniqueEmail, password });

    expect(regRes.status).toBe(201);

    const loginBeforeVerify = await request(app)
      .post("/api/users/login")
      .send({ email: uniqueEmail, password });

    expect(loginBeforeVerify.status).toBe(401);

    const user = await mongoose.connection
      .collection("users")
      .findOne({ email: uniqueEmail });

    expect(user.verificationToken).toBeDefined();

    const verifyRes = await request(app).get(
      `/api/users/verify/${user.verificationToken}`,
    );
    expect(verifyRes.status).toBe(200);

    const loginAfterVerify = await request(app)
      .post("/api/users/login")
      .send({ email: uniqueEmail, password });

    expect(loginAfterVerify.status).toBe(200);
    expect(loginAfterVerify.body.token).toBeDefined();
  });
});
