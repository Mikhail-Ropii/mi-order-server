const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

const authMiddle = require("./middlewares/authMiddle");
const getPrice = require("./api/getPrice");
const sendJsonPrice = require("./api/sendJsonPrice");
const sendOrder = require("./api/sendOrder");

dotenv.config();

const app = express();

app.listen(3000, () => {
  console.log("Server running");
});

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.post("/sendorder", sendOrder);

app.get("/getprice", authMiddle, getPrice, sendJsonPrice);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server Error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
