const fs = require("fs/promises");
const nodemailer = require("nodemailer");
const path = require("path");
const XLSX = require("xlsx");
require("dotenv").config();

const { MAIL_PASS } = process.env;

const orderPath = path.join(__dirname, "../temp");

const sendOrder = async (req, res, next) => {
  const { items, clientName, managerName } = req.body;
  const cropClientName = clientName.substr(0, 20);

  const transporter = nodemailer.createTransport({
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
      user: "mega_sendgrid@ukr.net",
      pass: MAIL_PASS,
    },
  });

  const mailOptions = {
    from: "mega_sendgrid@ukr.net",
    to: "online.zakaz@mitools.com.ua",
    subject: `${managerName}`,
    text: `Замовлення від ${managerName}, клієнт ${clientName}`,
    attachments: [{ path: `${orderPath}/${cropClientName}.xlsx` }],
  };
  try {
    const workSheet = XLSX.utils.json_to_sheet(items);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, `${cropClientName}`);
    XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workBook, `${orderPath}/${cropClientName}.xlsx`);

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Order sended" });
  } catch (error) {
    next(error);
  }
  try {
    // Delete temp file
    await fs.unlink(`${orderPath}/${cropClientName}.xlsx`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendOrder;
