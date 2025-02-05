import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
