import dotenv from "dotenv";
dotenv.config();
import express,{ Response } from "express";
import cors from "cors";
import { signupValidation, loginValidation } from "./middlewares/validation";
import { signup, login } from "./Controllers/auth";
import { isAuthenticated, AuthRequest } from "./middlewares/isAuth";
import "./Models/db";



const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  res.send("Hello, Rohit! 🚀 Server chal raha hai...");
});


app.post("/signup", signupValidation, signup);
app.post("/login", loginValidation, login);
app.get("/notes", isAuthenticated,(req:AuthRequest,res:Response)=>{
  res.status(200).json({message:"working notes",success:true})
});


app.listen(3000, () => {
  console.log("Server is working on port 3000");
});