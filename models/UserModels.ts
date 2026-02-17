import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required "],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  avatarURL: {
    type: String,
    required: [true],
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
  token: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
