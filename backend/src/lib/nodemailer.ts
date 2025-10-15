import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
     user: process.env.BREVO_SMTP_LOGIN, // Your Brevo SMTP login (email address)
      pass: process.env.BREVO_SMTP_MASTER_PASSWORD,
  },
});
