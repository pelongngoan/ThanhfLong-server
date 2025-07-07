import express from "express";
import router from "../../src/routes/index";

const createTestApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", router);

  app.get("/", (req, res) => {
    res.send("Hello from ThanhfLong!");
  });

  return app;
};

export default createTestApp;
