import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  User  from "../Models/user"; 

// Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User already exist",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    return res
      .status(201)
      .json({ message: "Sign Up successful", success: true });
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

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};