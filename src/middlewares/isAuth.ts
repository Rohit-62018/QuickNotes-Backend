import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export const isAuthenticated = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const auth = req.headers["authorization"];
  if (!auth) {
    res.status(403).json({ message: "Unauthorized access", success: false });
    return;
  }

  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token", success: false });
    return;
  }
};