import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/isAuth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  { User }   from "../Models/user"; 
import nodemailer  from 'nodemailer'

// Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { email: user.email, _id: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );
    
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email,
      password: hashedPassword,otp: {
      code:otp,
      verify:false,
      otpExpires: new Date(Date.now() + 1 * 60 * 1000)}
    });

    await newUser.save();
    const transporter = nodemailer.createTransport({
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
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
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

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res
        .status(403)
        .json({ message: "Password is wrong", success: false });
    }

    const token = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );
    
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
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const logout = (req: AuthRequest, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
}
