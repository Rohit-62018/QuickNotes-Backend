import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
export interface AuthRequest extends Request {
    user?: string | JwtPayload;
}
export declare const isAuthenticated: (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=isAuth.d.ts.map