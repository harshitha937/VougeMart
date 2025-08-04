const nodemailer = require("nodemailer");
require('dotenv').config();
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
  port: 587,
  secure: false,
    auth: {
      user: process.env.EMAIL_USER ,
      pass: process.env.EMAIL_PASS ,
    },
     tls: {
    rejectUnauthorized: false,
  },
  });

  await transporter.sendMail({
    from: `"VougeMart" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
