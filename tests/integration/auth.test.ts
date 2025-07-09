import request from "supertest";
import createTestApp from "../helpers/testApp";
import { createAccount } from "../../src/services/account";
import {
  mockAccount,
  mockLoginData,
  mockRegisterData,
  mockInvalidLoginData,
  mockInvalidAccount,
  mockExistingUserRegister,
} from "../helpers/testData";
import "../setup";

const app = createTestApp();

describe("Auth Routes Integration Tests", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(mockRegisterData)
        .expect(201);

      expect(response.body).toEqual({
        message: "Register successful",
      });
    });

    it("should return 400 when email already exists", async () => {
      // Create an account first
      await createAccount(mockAccount);

      const response = await request(app)
        .post("/api/auth/register")
        .send(mockExistingUserRegister)
        .expect(400);

      expect(response.body).toEqual({
        message: "Email already exists",
      });
    });

    it("should return 400 when validation fails", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(mockInvalidAccount)
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });

    it("should return 400 when required fields are missing", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          // Missing password and username
        })
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });

    it("should return 400 when email format is invalid", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "invalid-email",
          password: "ValidPass123",
          username: "testuser",
        })
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });

    it("should return 400 when password does not meet requirements", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          password: "weakpass", // Missing uppercase and number
          username: "testuser",
        })
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });

    it("should return 400 when username is too short", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          password: "ValidPass123",
          username: "ab", // Too short
        })
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a test account before each login test
      await createAccount(mockAccount);
    });

    it("should login successfully with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send(mockLoginData)
        .expect(200);

      expect(response.body).toEqual({
        message: "Login successful",
      });
    });

    it("should return 401 when email does not exist", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "TestPass123",
        })
        .expect(401);

      expect(response.body).toEqual({
        message: "Invalid email or password",
      });
    });

    it("should return 401 when password is incorrect", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: mockLoginData.email,
          password: "WrongPassword123",
        })
        .expect(401);

      expect(response.body).toEqual({
        message: "Invalid email or password",
      });
    });

    it("should return 400 when validation fails", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send(mockInvalidLoginData)
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });

    it("should return 400 when required fields are missing", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          // Missing password
        })
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });

    it("should return 400 when email format is invalid", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "invalid-email",
          password: "TestPass123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });

    it("should return 400 when password is too short", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "123", // Too short
        })
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });
  });

  describe("POST /api/auth/* - Invalid routes", () => {
    it("should return 404 for invalid auth routes", async () => {
      await request(app).post("/api/auth/invalid").send({}).expect(404);
    });
  });

  describe("GET requests to auth routes", () => {
    it("should return 404 for GET requests to auth routes", async () => {
      await request(app).get("/api/auth/login").expect(404);

      await request(app).get("/api/auth/register").expect(404);
    });
  });
});
