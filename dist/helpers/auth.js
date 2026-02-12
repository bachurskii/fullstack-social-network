import jwt from "jsonwebtoken";
import { secret } from "../controllers/userController.js";
import User from "../models/UserModels.js";
const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: "Not authorized" });
    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer" || !token)
        return res.status(401).json({ message: "Not authorized" });
    try {
        const decoded = jwt.verify(token, secret);
        if (typeof decoded !== "object" ||
            decoded === null ||
            !("id" in decoded) ||
            typeof decoded.id !== "string") {
            return res.status(401).json({ message: "Not authorized" });
        }
        const userId = decoded.id;
        const user = await User.findById(userId);
        if (!user || user.token !== token)
            return res.status(401).json({ message: "Not authorized" });
        req.user = {
            _id: user._id.toString(),
            email: user.email,
            subscription: user.subscription,
        };
        return next();
    }
    catch (error) {
        return res
            .status(401)
            .json({ message: "Invalid token or session expired" });
    }
};
export default auth;
