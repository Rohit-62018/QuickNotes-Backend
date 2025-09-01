"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGoogel = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const user_1 = require("../Models/user");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const authGoogel = async (req, res) => {
    try {
        const { gtoken } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: gtoken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ message: "Invalid token", success: false });
        }
        const { email, name } = payload;
        let user = await user_1.User.findOne({ email });
        if (!user) {
            user = await user_1.User.create({
                email,
                name,
                password: "",
            });
        }
        const token = jsonwebtoken_1.default.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.json({
            message: "Login successful",
            success: true,
            email: user.email,
            name: user.name,
        });
    }
    catch (error) {
        console.error("Google auth error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.authGoogel = authGoogel;
