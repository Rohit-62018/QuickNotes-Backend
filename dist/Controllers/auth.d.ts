import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/isAuth";
export declare const signup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const logout: (req: AuthRequest, res: Response) => Response<any, Record<string, any>>;
//# sourceMappingURL=auth.d.ts.map