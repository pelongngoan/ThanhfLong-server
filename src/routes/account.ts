import express from "express";
import { getAccountsController } from "@/controllers/account";
const accountRoutes = express.Router();

accountRoutes.get("/", getAccountsController);

export default accountRoutes;
