import {
  createAccount,
  getAccountByEmail,
  getAccountByUsername,
  getAccountById,
  updateAccount,
  deleteAccount,
} from "../../../src/services/account";
import Account from "../../../src/schema/account";
import { mockAccount, mockRegisterData } from "../../helpers/testData";
import "../../setup";

describe("Account Service", () => {
  describe("createAccount", () => {
    it("should create a new account successfully", async () => {
      const account = await createAccount(mockAccount);

      expect(account).toBeDefined();
      expect(account.username).toBe(mockAccount.username);
      expect(account.email).toBe(mockAccount.email);
      expect(account.password).not.toBe(mockAccount.password);
      expect(account.createdAt).toBeDefined();
    });

    it("should throw error when creating account with duplicate email", async () => {
      await createAccount(mockAccount);

      await expect(createAccount(mockAccount)).rejects.toThrow();
    });

    it("should throw error when creating account with duplicate username", async () => {
      await createAccount(mockAccount);

      const duplicateUsername = {
        ...mockRegisterData,
        username: mockAccount.username,
      };

      await expect(createAccount(duplicateUsername)).rejects.toThrow();
    });
  });

  describe("getAccountByEmail", () => {
    it("should return account when email exists", async () => {
      const createdAccount = await createAccount(mockAccount);
      const foundAccount = await getAccountByEmail(mockAccount.email);

      expect(foundAccount).toBeDefined();
      expect(foundAccount!.email).toBe(mockAccount.email);
      expect(foundAccount!._id.toString()).toBe(createdAccount._id.toString());
    });

    it("should return null when email does not exist", async () => {
      const foundAccount = await getAccountByEmail("nonexistent@example.com");

      expect(foundAccount).toBeNull();
    });
  });

  describe("getAccountByUsername", () => {
    it("should return account when username exists", async () => {
      const createdAccount = await createAccount(mockAccount);
      const foundAccount = await getAccountByUsername(mockAccount.username);

      expect(foundAccount).toBeDefined();
      expect(foundAccount!.username).toBe(mockAccount.username);
      expect(foundAccount!._id.toString()).toBe(createdAccount._id.toString());
    });

    it("should return null when username does not exist", async () => {
      const foundAccount = await getAccountByUsername("nonexistent");

      expect(foundAccount).toBeNull();
    });
  });

  describe("getAccountById", () => {
    it("should return account when id exists", async () => {
      const createdAccount = await createAccount(mockAccount);
      const foundAccount = await getAccountById(createdAccount._id.toString());

      expect(foundAccount).toBeDefined();
      expect(foundAccount!._id.toString()).toBe(createdAccount._id.toString());
    });

    it("should return null when id does not exist", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";
      const foundAccount = await getAccountById(nonExistentId);

      expect(foundAccount).toBeNull();
    });
  });

  describe("updateAccount", () => {
    it("should update account successfully", async () => {
      const createdAccount = await createAccount(mockAccount);
      const updateData = {
        username: "updateduser",
        email: "updated@example.com",
        password: "UpdatedPass123",
      };

      const updatedAccount = await updateAccount(
        createdAccount._id.toString(),
        updateData
      );

      expect(updatedAccount).toBeDefined();
      expect(updatedAccount!.username).toBe(updateData.username);
      expect(updatedAccount!.email).toBe(updateData.email);
    });

    it("should return null when updating non-existent account", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";
      const updateData = {
        username: "updateduser",
        email: "updated@example.com",
        password: "UpdatedPass123",
      };

      const updatedAccount = await updateAccount(nonExistentId, updateData);

      expect(updatedAccount).toBeNull();
    });
  });

  describe("deleteAccount", () => {
    it("should delete account successfully", async () => {
      const createdAccount = await createAccount(mockAccount);
      const deletedAccount = await deleteAccount(createdAccount._id.toString());

      expect(deletedAccount).toBeDefined();
      expect(deletedAccount!._id.toString()).toBe(
        createdAccount._id.toString()
      );

      // Verify account is actually deleted
      const foundAccount = await getAccountById(createdAccount._id.toString());
      expect(foundAccount).toBeNull();
    });

    it("should return null when deleting non-existent account", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";
      const deletedAccount = await deleteAccount(nonExistentId);

      expect(deletedAccount).toBeNull();
    });
  });
});
