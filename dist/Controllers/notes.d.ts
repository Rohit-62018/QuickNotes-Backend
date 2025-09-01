import { AuthRequest } from "../middlewares/isAuth";
import { Response } from "express";
export declare const addnotes: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteNote: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getnotes: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=notes.d.ts.map