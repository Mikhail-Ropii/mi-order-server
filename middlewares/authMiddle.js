const { createError } = require("../helpers/createError");
require("dotenv").config();

const { ACCESS_KEY } = process.env;

const authMiddle = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    console.log(req.headers);
    if (authorization !== ACCESS_KEY) {
      throw createError(401, "Invalid access key");
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddle;
