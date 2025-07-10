import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import { connectDB } from "./config/mongoDb";
import router from "./routes/index";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

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
