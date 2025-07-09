import express from "express";
import { login, register } from "../controllers/auth";
import {
  validateLogin,
  validateRegister,
  createValidationMiddleware,
} from "../validation/index";

const authRoutes = express.Router();

// Create validation middleware instances
const validateLoginMiddleware = createValidationMiddleware(validateLogin);
const validateRegisterMiddleware = createValidationMiddleware(validateRegister);

authRoutes.post("/login", validateLoginMiddleware, async (req, res) => {
  await login(req, res);
});

authRoutes.post("/register", validateRegisterMiddleware, async (req, res) => {
  await register(req, res);
});

export default authRoutes;
