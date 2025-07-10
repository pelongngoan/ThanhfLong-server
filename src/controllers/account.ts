import { getAccounts } from "@/services/account";
import { Request, Response } from "express";

export const getAccountsController = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const accounts = await getAccounts(Number(page), Number(limit));
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
