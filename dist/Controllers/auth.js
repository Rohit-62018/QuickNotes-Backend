"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../Models/user");
const nodemailer_1 = __importDefault(require("nodemailer"));
// Signup
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await user_1.User.findOne({ email });
        if (user) {
            const token = jsonwebtoken_1.default.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({
                message: "Login successful",
                success: true,
                email: user.email,
                name: user.name,
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new user_1.User({ name, email,
            password: hashedPassword, otp: {
                code: otp,
                verify: false,
                otpExpires: new Date(Date.now() + 1 * 60 * 1000)
            }
        });
        await newUser.save();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });
        await transporter.sendMail({
            from: `"Quick Notes" <${process.env.EMAIL}>`,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It will expire in 1 minutes.`,
        });
        return res
            .status(201)
            .json({ message: "Account created", success: true });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_1.User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ message: "User doesn't exist", success: false });
        }
        if (!user.password) {
            return res.status(400).json({
                message: "Please Sign in with Google.",
                success: false,
            });
        }
        const isPassEqual = await bcrypt_1.default.compare(password, user.password);
        if (!isPassEqual) {
            return res
                .status(403)
                .json({ message: "Password is wrong", success: false });
        }
        const token = jsonwebtoken_1.default.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Login successful",
            success: true,
            email: user.email,
            name: user.name,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", success: false });
    }
};
exports.login = login;
const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
};
exports.logout = logout;
//# sourceMappingURL=auth.js.map