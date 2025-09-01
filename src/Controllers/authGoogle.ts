import jwt from "jsonwebtoken";
import { AuthRequest } from "../middlewares/isAuth";
import { OAuth2Client } from "google-auth-library";
import { User } from "../Models/user";
import { Response } from "express";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const authGoogel = async (req:AuthRequest, res: Response) => {
  try {
    const { gtoken } = req.body; 
    const ticket = await client.verifyIdToken({
      idToken: gtoken,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid token",success:false });
    }

    const { email, name } = payload;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        password: "", 
      });
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

    return res.json({
      message: "Login successful",
      success: true,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error("Google auth error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};