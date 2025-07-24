const nodemailer = require("nodemailer");
require('dotenv').config();
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or use another SMTP provider
    auth: {
      user: process.env.EMAIL_USER || 'valluruharshitha2005@gmail.com' ,
      pass: process.env.EMAIL_PASS || 'kqmeysisywtujfvb',
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
