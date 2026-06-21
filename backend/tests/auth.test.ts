import request from "supertest";
import { app } from "../src/index";
import { prisma } from "../src/lib/prisma";

// These tests assume a TEST database is configured via DATABASE_URL in CI.
// Run `prisma migrate deploy` against the test DB before running this suite.

describe("Auth routes", () => {
  const testUser = {
    email: "test-user@example.com",
    password: "SuperSecret123",
    name: "Test User",
  };

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it("signs up a new user and returns tokens", async () => {
    const res = await request(app).post("/auth/signup").send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("rejects signup with a duplicate email", async () => {
    const res = await request(app).post("/auth/signup").send(testUser);
    expect(res.status).toBe(409);
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("rejects login with wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: "wrong-password",
    });

    expect(res.status).toBe(401);
  });
});
