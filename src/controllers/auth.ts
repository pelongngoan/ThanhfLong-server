import { Request, Response } from "express";
import { createAccount, getAccountByEmail } from "../services/account";
import bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const account = await getAccountByEmail(email);
    if (!account) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    const account = await getAccountByEmail(email);
    if (account) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newAccount = await createAccount({
      email,
      password,
      username,
    });
    res.status(201).json({ message: "Register successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
