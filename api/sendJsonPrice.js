const XLSX = require("xlsx");
const path = require("path");

const pricePath = path.join(__dirname, "../temp");

const priceToJson = async (req, res, next) => {
  const file = XLSX.readFile(`${pricePath}/price.xls`);
  const sheetNames = file.SheetNames;
  const tempData = XLSX.utils.sheet_to_json(file.Sheets[sheetNames]);
  try {
    res.send(JSON.stringify(tempData));
    res.status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = priceToJson;
