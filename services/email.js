import nodemailer from "nodemailer";
import { env } from "../config";
let transport = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: env.smtpEmail,
    pass: env.smthPass,
  },
});

export async function sendVerificationEmail(toEmail, verificationToken) {
  const verificationUrl = `${env.baseUrl}/api/users/verify/${verificationToken}`;
  const verifyEmail = await transport.sendMail({
    from: '"Gay Thompson" <gay64@ethereal.email>',
    to: toEmail,
    subject: "Confirm your email",
    text: `Please, verify your email clicking by ${verificationUrl}`,
    html: `
    <h1>Welcome</h1>
    <p>Click the link below to verify your email:</p>
    <a href="${verificationUrl}" target="_blank">Verify email</a>
    `,
  });
  return verifyEmail;
}
