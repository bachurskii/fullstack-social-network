import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is missing or not a string`);
  }

  return value;
}

function requirePort(name: string): number {
  const value = process.env[name];
  const port = Number(value);
  if (isNaN(port) || port > 65535) {
    throw new Error(`Environment variable ${name} is missing or not a number`);
  }
  return port;
}

export const env = {
  dbUrl: requireEnv("DATA_BASE_URL"),
  port: requirePort("PORT"),
  jwtSecret: requireEnv("JWT_SECRET"),
  baseUrl: requireEnv("BASE_URL"),
  smtpEmail: requireEnv("SMTP_USER"),
  smtpPass: requireEnv("SMTP_PASSWORD"),
};

export const paths = {
  avatars: path.join(__dirname, ".././public", "avatars/"),
};
