import dotenv from "dotenv";
dotenv.config();
import express,{ Response } from "express";
import cors from "cors";
import { signupValidation, loginValidation } from "./middlewares/validation";
import { signup, login,logout } from "./Controllers/auth";
import { isAuthenticated, AuthRequest } from "./middlewares/isAuth";
import cookieParser from "cookie-parser";
import  { verifyOtp }  from './Controllers/otpVerify'
import { authGoogel } from "./Controllers/authGoogle";
import { addnotes, deleteNote, getnotes } from "./Controllers/notes";
import "./Models/db";


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "https://68b5a323f002a9e3b3bf60a1--quicknotesss.netlify.app"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Hello, Rohit! 🚀 Server chal raha hai...");
});

app.post("/signup", signupValidation, signup);
app.post("/login", loginValidation, login);
app.get("/isAuth", isAuthenticated,async(req:AuthRequest,res:Response)=>{
  res.status(200).json({message:"working notes",success:true})
});

app.post("/addnotes", isAuthenticated, addnotes);
app.post('/logout',isAuthenticated,logout)
app.get("/notes", isAuthenticated, getnotes);
app.delete('/notes/delete',isAuthenticated, deleteNote)
app.post("/auth/google",authGoogel); 
app.post("/verify-otp",verifyOtp);

app.all(/.*/, (req:AuthRequest, res: Response) => {
  res.status(404).json({message:"Page not found",})
});

app.listen(3000, () => {
  console.log("Server is working on port 3000");
});