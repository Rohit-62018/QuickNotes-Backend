import dotenv from "dotenv";
dotenv.config();
import express,{ Response } from "express";
import cors from "cors";
import { signupValidation, loginValidation } from "./middlewares/validation";
import { signup, login } from "./Controllers/auth";
import { isAuthenticated, AuthRequest } from "./middlewares/isAuth";
import { User, Note } from "./Models/user";
import cookieParser from "cookie-parser";
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


app.get("/", (req, res) => {
  res.send("Hello, Rohit! 🚀 Server chal raha hai...");
});


app.post("/signup", signupValidation, signup);
app.post("/login", loginValidation, login);
app.get("/isAuth", isAuthenticated,async(req:AuthRequest,res:Response)=>{
  
  res.status(200).json({message:"working notes",success:true, user:req.user})
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
      notes:userWithNotes?.notes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
});


app.listen(3000, () => {
  console.log("Server is working on port 3000");
});