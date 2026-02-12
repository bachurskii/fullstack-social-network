import { env, paths } from "../config.js";
import User from "../models/UserModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { Jimp } from "jimp";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import { sendVerificationEmail } from "../services/email.js";
export const secret = env.jwtSecret;
export const avatarsDir = paths.avatars;
export const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
        return res.status(409).json({ message: "Email in use" });
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const avatar = gravatar.url(email, { s: "250", r: "pg", d: "retro" });
    const tokenEmail = nanoid();
    sendVerificationEmail(email, tokenEmail);
    const newUser = await User.create({
        email: email,
        password: hash,
        avatarURL: avatar,
        verificationToken: tokenEmail,
    });
    return res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL: newUser.avatarURL,
        },
    });
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(401).json({ message: "Wrong email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Wrong email or password" });
    }
    if (!user.verify) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const payload = { id: user._id };
    const userToken = jwt.sign(payload, secret, {
        expiresIn: "1h",
    });
    const updatedUser = await User.findByIdAndUpdate(user._id, { token: userToken }, { new: true });
    if (updatedUser !== null) {
        return res.status(200).json({
            token: updatedUser.token,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        });
    }
    return res.status(401).json({ message: "Not authorized" });
};
export const logout = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(userId, { token: null });
    if (!user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    return res.status(204).send();
};
export const current = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const { email, subscription } = req.user;
    return res.status(200).json({
        email,
        subscription,
    });
};
export const changeSubscription = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(userId, { subscription: req.body.subscription }, {
        new: true,
    });
    if (!user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    return res.status(200).json({
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    });
};
export const changeAvatar = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const userId = req.user._id;
    let file = req.file;
    if (!file) {
        return res.status(400).json({ message: "Bad request" });
    }
    const tmpPath = req.file.path;
    const image = await Jimp.read(tmpPath);
    image.resize({ w: 250, h: 250 });
    const fileName = `${userId}_${Date.now()}.png`;
    const finalPath = `${avatarsDir}/${fileName}`;
    await image.write(finalPath);
    await fs.unlink(tmpPath);
    const avatarURL = `/avatars/${fileName}`;
    const user = await User.findByIdAndUpdate(userId, {
        avatarURL: avatarURL,
    }, { new: true });
    if (!user) {
        return res.status(404).json({ message: "Ops... Something wrong" });
    }
    return res.status(200).json({
        avatarURL: user.avatarURL,
    });
};
export const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken: verificationToken });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndUpdate(user._id, {
        verify: true,
        verificationToken: null,
    });
    return res.status(200).json({
        message: "Verification successful",
    });
};
export const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.verify === true) {
        return res
            .status(400)
            .json({ message: "Verification has already been passed" });
    }
    const token = user.verificationToken;
    await sendVerificationEmail(email, token);
    return res.status(200).json({ message: "Verification email sent" });
};
