"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.signupValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Signup Validation Middleware
const signupValidation = (req, res, next) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(4).max(50).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({ message: "Bad request", error });
        return;
    }
    next();
};
exports.signupValidation = signupValidation;
// Login Validation Middleware
const loginValidation = (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(4).max(50).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({ message: "Bad request", error });
        return;
    }
    next();
};
exports.loginValidation = loginValidation;
//# sourceMappingURL=validation.js.map