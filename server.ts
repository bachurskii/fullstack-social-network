import { env } from "./config.js";
import mongoose from "mongoose";
import app from "./app.js";

async function startServer() {
  try {
    await mongoose.connect(env.dbUrl);
    console.log("Database connection successful");
    app.listen(env.port, () => {
      console.log(`Server is running. Use our API on port: ${env.port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
startServer();
