"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../Models/user");
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await user_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        if (!user.otp || user.otp.code !== parseInt(otp)) {
            return res.status(400).json({ message: "Invalid OTP", success: false });
        }
        if (user.otp.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired", success: false });
        }
        user.otp.verify = true;
        await user.save();
        const token = jsonwebtoken_1.default.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "OTP verified successfully, account active",
            success: true,
            email: user.email,
            name: user.name,
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
exports.verifyOtp = verifyOtp;
