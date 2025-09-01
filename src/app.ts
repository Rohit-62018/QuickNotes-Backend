import dotenv from "dotenv";
dotenv.config();
import express,{ Response } from "express";
import cors from "cors";
import { signupValidation, loginValidation } from "./middlewares/validation";
import { signup, login } from "./Controllers/auth";
import { isAuthenticated, AuthRequest } from "./middlewares/isAuth";
import { User, Note } from "./Models/user";
import cookieParser from "cookie-parser";
import { OAuth2Client } from "google-auth-library";
import  { verifyOtp }  from './Controllers/otpVerify'
import jwt from "jsonwebtoken";
import "./Models/db";


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.get("/", (req, res) => {
  res.send("Hello, Rohit! 🚀 Server chal raha hai...");
});


app.post("/signup", signupValidation, signup);
app.post("/login", loginValidation, login);
app.get("/isAuth", isAuthenticated,async(req:AuthRequest,res:Response)=>{
  res.status(200).json({message:"working notes",success:true})
});

app.post("/addnotes", isAuthenticated, async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const note = await Note.create({ content });
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    user.notes.push(note.id);
    await user.save();
    const userWithNotes = await User.findById(req.user._id).populate("notes");
    return res.status(201).json({
      message: "Note created ",
      success: true,
      notes:userWithNotes?.notes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
});

app.post('/logout',isAuthenticated,(req: AuthRequest, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
})

app.get("/notes", isAuthenticated, async (req: AuthRequest, res: Response) => {
  try {
    const userWithNotes = await User.findById(req.user._id).populate("notes");
    return res.status(201).json({
      message: "Note created ",
      success: true,
      user:{
        notes:userWithNotes?.notes,
        email:req.user.email,
        name:userWithNotes?.name
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
});

app.delete('/notes/delete',isAuthenticated,async(req:AuthRequest,res:Response)=>{
    try{
      const {id} = req.body;
      await User.findByIdAndUpdate(req.user._id,{$pull:{notes:id}})
      await Note.findByIdAndDelete(id);
      const userWithNotes = await User.findById(req.user._id).populate("notes");
      return res.status(201).json({
        message: "Note deleted",
        success: true,
        notes:userWithNotes?.notes,
      });
    }catch(error){
        return res.status(500).json({message:"Internal server error",success:false})
    }
})

app.post("/auth/google", async (req:AuthRequest, res: Response) => {
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
});

app.post("/verify-otp",verifyOtp);

app.all(/.*/, (req:AuthRequest, res: Response) => {
  res.status(404).json({message:"Page not found",})
});

app.listen(3000, () => {
  console.log("Server is working on port 3000");
});