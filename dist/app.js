"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const validation_1 = require("./middlewares/validation");
const auth_1 = require("./Controllers/auth");
const isAuth_1 = require("./middlewares/isAuth");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const otpVerify_1 = require("./Controllers/otpVerify");
const authGoogle_1 = require("./Controllers/authGoogle");
const notes_1 = require("./Controllers/notes");
require("./Models/db");
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.get("/", (req, res) => {
    res.send("Hello, Rohit! 🚀 Server chal raha hai...");
});
app.post("/signup", validation_1.signupValidation, auth_1.signup);
app.post("/login", validation_1.loginValidation, auth_1.login);
app.get("/isAuth", isAuth_1.isAuthenticated, async (req, res) => {
    res.status(200).json({ message: "working notes", success: true });
});
app.post("/addnotes", isAuth_1.isAuthenticated, notes_1.addnotes);
app.post('/logout', isAuth_1.isAuthenticated, auth_1.logout);
app.get("/notes", isAuth_1.isAuthenticated, notes_1.getnotes);
app.delete('/notes/delete', isAuth_1.isAuthenticated, notes_1.deleteNote);
app.post("/auth/google", authGoogle_1.authGoogel);
app.post("/verify-otp", otpVerify_1.verifyOtp);
app.all(/.*/, (req, res) => {
    res.status(404).json({ message: "Page not found", });
});
app.listen(3000, () => {
    console.log("Server is working on port 3000");
});
//# sourceMappingURL=app.js.map