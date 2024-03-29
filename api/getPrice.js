const ftp = require("basic-ftp");
const path = require("path");
require("dotenv").config();

const { FTP_ACCESS_PASS } = process.env;

const pricePath = path.join(__dirname, "../temp/price.xls");

const getPrice = async (req, res, next) => {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: "46.36.221.117",
      user: "mitools",
      password: FTP_ACCESS_PASS,
      secureOptions: {
        rejectUnauthorized: false,
      },
    });
    await client.downloadTo(pricePath, "price.xls");
    next();
  } catch (error) {
    next(error);
  }
  client.close();
};

module.exports = getPrice;
