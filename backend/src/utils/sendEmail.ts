import dotenv from "dotenv";
import { transporter } from "../lib/nodemailer";
import { generateVerificationEmail } from "../lib/mjml";

dotenv.config();

export const sendVerificationEmail = async (to: string, code: string, link: string) => {
  try {
    const html = generateVerificationEmail(code, link);

    await transporter.sendMail({
      from: `"SkillAI" <qureshirameez140@gmail.com>`,
      to,
      subject: "Verify Your Email Address",
      html,
    });

    console.log(`✅ Verification email sent to ${to}`); 
  } catch (err) {
    console.error("❌ Error sending verification email:", err);
  }
};