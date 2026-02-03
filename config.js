import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const env = {
  dbUrl: process.env.DATA_BASE_URL,
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  baseUrl: process.env.BASE_URL,
  smtpEmail: process.env.SMTP_USER,
  smthPass: process.env.SMTP_PASSWORD,
};

export const paths = {
  avatars: path.join(__dirname, ".././public", "avatars/"),
};
