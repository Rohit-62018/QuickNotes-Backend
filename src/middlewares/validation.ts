import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Signup Validation Middleware
export const signupValidation = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(50).required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).json({ message: "Bad request", error });
    return;
  }

  next();
};

// Login Validation Middleware
export const loginValidation = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(50).required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).json({ message: "Bad request", error });
    return;
  }

  next();
};

