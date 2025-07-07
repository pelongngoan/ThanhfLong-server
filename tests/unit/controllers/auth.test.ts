import { Request, Response } from "express";
import { login, register } from "../../../src/controllers/auth";
import * as accountService from "../../../src/services/account";
import bcrypt from "bcrypt";
import {
  mockAccount,
  mockLoginData,
  mockRegisterData,
} from "../../helpers/testData";

// Mock the account service
jest.mock("../../../src/services/account");
jest.mock("bcrypt");

const mockedAccountService = accountService as jest.Mocked<
  typeof accountService
>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe("Auth Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };

    jest.clearAllMocks();
  });

  describe("login", () => {
    beforeEach(() => {
      mockRequest.body = mockLoginData;
    });

    it("should login successfully with valid credentials", async () => {
      const mockAccount = {
        _id: "mockId",
        email: mockLoginData.email,
        password: "hashedPassword",
        username: "testuser",
      };

      mockedAccountService.getAccountByEmail.mockResolvedValue(
        mockAccount as any
      );
      mockedBcrypt.compare.mockResolvedValue(true as never);

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockedAccountService.getAccountByEmail).toHaveBeenCalledWith(
        mockLoginData.email
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        mockLoginData.password,
        mockAccount.password
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ message: "Login successful" });
    });

    it("should return 401 when account does not exist", async () => {
      mockedAccountService.getAccountByEmail.mockResolvedValue(null);

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockedAccountService.getAccountByEmail).toHaveBeenCalledWith(
        mockLoginData.email
      );
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Invalid email or password",
      });
    });

    it("should return 401 when password is invalid", async () => {
      const mockAccount = {
        _id: "mockId",
        email: mockLoginData.email,
        password: "hashedPassword",
        username: "testuser",
      };

      mockedAccountService.getAccountByEmail.mockResolvedValue(
        mockAccount as any
      );
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockedAccountService.getAccountByEmail).toHaveBeenCalledWith(
        mockLoginData.email
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        mockLoginData.password,
        mockAccount.password
      );
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Invalid email or password",
      });
    });

    it("should return 500 when an error occurs", async () => {
      mockedAccountService.getAccountByEmail.mockRejectedValue(
        new Error("Database error")
      );

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("register", () => {
    beforeEach(() => {
      mockRequest.body = mockRegisterData;
    });

    it("should register successfully with valid data", async () => {
      const newMockAccount = {
        _id: "newMockId",
        ...mockRegisterData,
        password: "hashedPassword",
      };

      mockedAccountService.getAccountByEmail.mockResolvedValue(null);
      mockedAccountService.createAccount.mockResolvedValue(
        newMockAccount as any
      );

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockedAccountService.getAccountByEmail).toHaveBeenCalledWith(
        mockRegisterData.email
      );
      expect(mockedAccountService.createAccount).toHaveBeenCalledWith({
        email: mockRegisterData.email,
        password: mockRegisterData.password,
        username: mockRegisterData.username,
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({ message: "Register successful" });
    });

    it("should return 400 when email already exists", async () => {
      const existingAccount = {
        _id: "existingId",
        email: mockRegisterData.email,
        password: "hashedPassword",
        username: "existinguser",
      };

      mockedAccountService.getAccountByEmail.mockResolvedValue(
        existingAccount as any
      );

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockedAccountService.getAccountByEmail).toHaveBeenCalledWith(
        mockRegisterData.email
      );
      expect(mockedAccountService.createAccount).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Email already exists",
      });
    });

    it("should return 500 when an error occurs during account creation", async () => {
      mockedAccountService.getAccountByEmail.mockResolvedValue(null);
      mockedAccountService.createAccount.mockRejectedValue(
        new Error("Database error")
      );

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockedAccountService.getAccountByEmail).toHaveBeenCalledWith(
        mockRegisterData.email
      );
      expect(mockedAccountService.createAccount).toHaveBeenCalledWith({
        email: mockRegisterData.email,
        password: mockRegisterData.password,
        username: mockRegisterData.username,
      });
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });

    it("should return 500 when an error occurs during email check", async () => {
      mockedAccountService.getAccountByEmail.mockRejectedValue(
        new Error("Database error")
      );

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockedAccountService.getAccountByEmail).toHaveBeenCalledWith(
        mockRegisterData.email
      );
      expect(mockedAccountService.createAccount).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
});
