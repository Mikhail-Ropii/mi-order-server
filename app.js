const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

const sendOrder = require("./helpers/sendOrder");

dotenv.config();

const app = express();

app.listen(3000, () => {
  console.log("Server running");
});

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.post("/sendOrder", (req, res) => {
  sendOrder(req.body);
  res.status(200).json({ message: "Order sended" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server Error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
