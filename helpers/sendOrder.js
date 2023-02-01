const fs = require("fs/promises");
const nodemailer = require("nodemailer");
const path = require("path");
const XLSX = require("xlsx");
require("dotenv").config();

const { MAIL_PASS } = process.env;

const orderPath = path.join(__dirname, "../temp");

const sendOrder = async ({ items, clientName, managerName }) => {
  const convertToXlsx = async () => {
    const workSheet = XLSX.utils.json_to_sheet(items);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, `${clientName}`);
    XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workBook, `${orderPath}/${clientName}.xlsx`);
  };
  await convertToXlsx();
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
    to: "a.novak@mitools.com.ua",
    subject: `${managerName}`,
    text: `Замовлення від ${managerName}, клієнт ${clientName}`,
    attachments: [{ path: `${orderPath}/${clientName}.xlsx` }],
  };

  await transporter.sendMail(mailOptions);

  // Delete temp file
  fs.unlink(`${orderPath}/${clientName}.xlsx`);
};

module.exports = sendOrder;
