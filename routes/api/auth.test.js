const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const User = require("../../models/user");

describe("Auth Controller Tests", () => {
  beforeAll(async () => {
    // Clear users collection before tests
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/users/signup", () => {
    it("should create a new user and return user data", async () => {
      const response = await request(app).post("/api/users/signup").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty("email", "test@example.com");
      expect(response.body.user).toHaveProperty("subscription", "starter");
      expect(response.body.user).toHaveProperty("avatarURL");
    });
  });

  describe("POST /api/users/login", () => {
    it("should login user and return token with user data", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "test@example.com",
        password: "password123",
      });

      // Status code should be 200
      expect(response.status).toBe(200);

      // Response should have token
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");

      // Response should have user object
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("email", "test@example.com");
      expect(response.body.user).toHaveProperty("subscription", "starter");

      // All properties should be strings
      expect(typeof response.body.user.email).toBe("string");
      expect(typeof response.body.user.subscription).toBe("string");
    });

    it("should return 401 with invalid credentials", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "message",
        "Email or password is wrong"
      );
    });
  });
});
