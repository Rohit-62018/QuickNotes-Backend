import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    otp?: {
        code: number;
        verify: boolean;
        otpExpires: number;
    };
    notes: mongoose.Types.ObjectId[];
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
declare const Note: mongoose.Model<{
    [x: string]: unknown;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    [x: string]: unknown;
}, {}, mongoose.DefaultSchemaOptions> & {
    [x: string]: unknown;
} & Required<{
    _id: unknown;
}> & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    [x: string]: unknown;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    [x: string]: unknown;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    [x: string]: unknown;
}> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>>;
export { User, Note };
//# sourceMappingURL=user.d.ts.map