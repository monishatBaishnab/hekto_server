import nodemailer from "nodemailer";
import { local_config } from "../config";

const email_sender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "baishnabmonishat@gmail.com",
      pass: local_config.app_pass,
    },
  });
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Password Reset Link" <baishnabmonishat@gmail.com>',
    to: email,
    subject: "Password Reset Link",
    text: "Hello world?",
    html: html,
  });

  return info;
};
export default email_sender;