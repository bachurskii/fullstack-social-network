import jwt from "jsonwebtoken";
import { secret } from "../controllers/userController.js";
import User from "../models/UserModels.js";
export default async function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer" || !token) {
        return res.status(401).json({ message: "Not authorized" });
    }
    try {
        const decode = jwt.verify(token, secret);
        const user = await User.findById(decode.id);
        if (!user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        if (user.token !== token) {
            return res.status(401).json({ message: "Not authorized" });
        }
        req.user = {
            _id: user._id.toString(),
            email: user.email,
            subscription: user.subscription,
        };
        next();
    }
    catch (error) {
        console.error("JWT Verification Error:", error.name, error.message);
        return res
            .status(401)
            .json({ message: "Invalid token or session expired" });
    }
}
