import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { connectDB } from "./config/mongoDb.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI || "";

connectDB(MONGO_URI);
app.get("/", (req, res) => {
  res.send("Hello from ThanhfLong!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
