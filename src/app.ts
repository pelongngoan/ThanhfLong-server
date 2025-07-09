import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { connectDB } from "./config/mongoDb";
import router from "./routes/index";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI || "";

connectDB(MONGODB_URI);

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello from ThanhfLong!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
